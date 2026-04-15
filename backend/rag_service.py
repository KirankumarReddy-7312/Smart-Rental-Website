import os
import re
import json
import numpy as np
import pandas as pd
import faiss
from typing import List, Dict, Any, Tuple, Optional
from sentence_transformers import SentenceTransformer
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from django.db.models import Avg, Count, Q
from properties.models import Property, Location

class RentoraRAG:
    """
    Ultimate RAG System for Rentora:
    - Layer 1: Deterministic BI (Pandas) for exact stats
    - Layer 2: Vector Search (FAISS) for semantic property discovery
    - Layer 3: LLM Generation (LangChain) for natural responses
    """
    
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RentoraRAG, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        print("🚀 Initializing Rentora RAG Intelligence System...")
        
        # 1. Load Embedding Model
        try:
            self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"❌ Error loading embedder: {e}")
            self.embedder = None

        # 2. State
        self.index = None
        self.documents = []
        self.property_map = {}
        self.df = pd.DataFrame()
        
        # 3. LLM Configuration
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            self.llm = ChatOpenAI(
                model_name="gpt-3.5-turbo",
                temperature=0.2,
                openai_api_key=api_key
            )
        else:
            self.llm = None
            print("⚠️ OPENAI_API_KEY not found. LLM features disabled (using Rule-Based Generation).")

        self.reload_data()
        self._initialized = True

    def reload_data(self):
        """Sync with Database and rebuild indices"""
        try:
            # A. Load to DataFrame for BI Layer
            properties_qs = Property.objects.all().values(
                'property_id', 'type', 'rent', 'deposit', 'property_size', 
                'bathroom', 'furnishing', 'gym', 'parking', 'lift', 
                'swimming_pool', 'locality__name', 'building_type'
            )
            self.df = pd.DataFrame(list(properties_qs))
            
            if self.df.empty:
                print("📭 Database is empty. Waiting for records...")
                return

            # Add derived columns for stats
            self.df['has_gym'] = self.df['gym'].astype(int)
            self.df['has_pool'] = self.df['swimming_pool'].astype(int)
            self.df['has_lift'] = self.df['lift'].astype(int)
            self.df['has_parking'] = self.df['parking'].astype(int)
            self.df['amenity_count'] = self.df[['has_gym', 'has_pool', 'has_lift', 'has_parking']].sum(axis=1)

            # B. Build Documents for Vector Layer
            self.documents = []
            self.property_map = {}
            
            for i, row in self.df.iterrows():
                doc = f"""
                Location: {row['locality__name']}
                Type: {row['type']} ({row['building_type']})
                Rent: ₹{row['rent']}/month
                Size: {row['property_size']} sqft
                Furnishing: {row['furnishing']}
                Amenities: {'Gym ' if row['gym'] else ''}{'Pool ' if row['swimming_pool'] else ''}{'Lift ' if row['lift'] else ''}{'Parking' if row['parking'] else ''}
                """.strip()
                self.documents.append(doc)
                self.property_map[len(self.documents) - 1] = row.to_dict()

            # C. Create Vector Index
            if self.embedder and self.documents:
                embeddings = self.embedder.encode(self.documents)
                dimension = embeddings.shape[1]
                self.index = faiss.IndexFlatL2(dimension)
                self.index.add(np.array(embeddings).astype('float32'))
                
            print(f"✅ RAG Reloaded: {len(self.df)} properties indexed.")
        except Exception as e:
            print(f"❌ Error during data reload: {e}")

    def _fmt_inr(self, val):
        return f"₹{int(val):,}" if pd.notna(val) else "N/A"

    def get_statistical_answer(self, query: str) -> Optional[str]:
        """Layer 1: Deterministic Pandas-based Business Intelligence"""
        if self.df.empty: return None
        
        q = query.lower()
        by_loc = self.df.groupby("locality__name")

        # 1. Average Rents
        if "average rent" in q or "avg rent" in q:
            for loc in self.df['locality__name'].unique():
                if loc.lower() in q:
                    try:
                        mean = by_loc.get_group(loc)['rent'].mean()
                        count = by_loc.get_group(loc).shape[0]
                        return f"The average rent in {loc} is approximately {self._fmt_inr(mean)} based on {count} verified listings."
                    except KeyError:
                        continue
            
            # Global stats if no locality specified
            if "highest" in q:
                top = by_loc['rent'].mean().sort_values(ascending=False)
                return f"The locality with the highest average rent is {top.index[0]} at {self._fmt_inr(top.iloc[0])}/month."
            if "cheapest" in q or "lowest" in q:
                bottom = by_loc['rent'].mean().sort_values(ascending=True)
                return f"The most affordable locality is {bottom.index[0]} with an average rent of {self._fmt_inr(bottom.iloc[0])}/month."

        # 2. Supply Analysis
        if "listings" in q or "how many properties" in q or "supply" in q:
            counts = by_loc.size().sort_values(ascending=False)
            if "most" in q:
                return f"{counts.index[0]} currently has the most supply with {counts.iloc[0]} active listings."
            
        return None

    def get_semantic_context(self, query: str, k: int = 4) -> str:
        """Layer 2: FAISS-based Retrieval"""
        if not self.index or not self.embedder or not self.documents:
            return ""
        
        # Search
        q_emb = self.embedder.encode([query])
        distances, indices = self.index.search(np.array(q_emb).astype('float32'), k)
        
        results = []
        for idx in indices[0]:
            if idx != -1 and idx < len(self.documents):
                results.append(self.documents[idx].replace('\n', ' '))
                
        if not results:
            return ""
            
        return "Relevant Property Data:\n" + "\n".join([f"- {r}" for r in results])

    def generate_response(self, query: str) -> str:
        """Layer 3: Orchestration & Generation"""
        # 0. Precise BHK Filtering for Stats
        q = query.lower()
        bhk_match = re.search(r'(\d+)\s*bhk', q)
        
        # 1. Try Statistical Layer first for accuracy
        stat_ans = self.get_statistical_answer(query)
        if stat_ans:
            if bhk_match and not self.df.empty:
                bhk_val = f"{bhk_match.group(1)}BHK"
                bhk_df = self.df[self.df['type'].str.contains(bhk_val, case=False, na=False)]
                if not bhk_df.empty:
                    bhk_avg = bhk_df['rent'].mean()
                    stat_ans += f" Specifically for {bhk_val}s, the average is {self._fmt_inr(bhk_avg)}."
            return stat_ans

        # 2. Get Semantic context
        context = self.get_semantic_context(query)
        
        # 3. Filter intent
        if not context or "Relevant Property Data:\n" == context:
            return "I don't have enough data in my system to answer that specifically. However, generally Bangalore rentals range from ₹15k to ₹80k depending on the location like Whitefield or Bellandur."

        # 4. Generate with LLM (or Rules)
        if self.llm:
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are Rentora AI, an expert advisor for Bangalore real estate.
                 - Use ONLY the provided context and stats.
                 - Be concise (max 3 sentences).
                 - If accuracy is high, give specific numbers.
                 - Always mention 1-2 specific areas if relevant."""),
                ("human", "Context:\n{context}\n\nUser Question: {query}")
            ])
            try:
                response = self.llm.invoke(prompt.format_messages(context=context, query=query))
                return response.content
            except Exception as e:
                print(f"LLM Error: {e}")
                pass # Fallback to rules

        # Rule-based fallback
        lines = context.split('\n')
        if len(lines) > 1:
            return f"Based on our latest data: {lines[1].strip('- ')} Would you like to know more about this location?"
        return "Contact our experts for a personalized search."

# Export main function
def get_rag_response(query: str) -> str:
    # Ensure RAG is initialized
    try:
        instance = RentoraRAG()
        return instance.generate_response(query)
    except Exception as e:
        print(f"🔥 RAG CRASH: {e}")
        return "I'm experiencing a technical brain freeze. Ask me about Whitefield or average rents in 10 seconds!"
