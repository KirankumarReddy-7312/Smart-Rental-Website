import os
import json
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
from django.db.models import Avg, Count
from properties.models import Property, Location
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage
from langchain.prompts import ChatPromptTemplate
from typing import List, Dict, Any
import re

class RAGSystem:
    def __init__(self):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.documents = []
        self.property_data = {}
        self.llm = None
        self.initialize_system()
    
    def initialize_system(self):
        """Initialize the RAG system with property data"""
        print("Initializing RAG system...")
        
        # Load property data from database
        properties = Property.objects.all().values(
            'id', 'property_id', 'type', 'rent', 'deposit', 
            'property_size', 'bathroom', 'furnishing',
            'gym', 'parking', 'lift', 'swimming_pool',
            'locality__name', 'building_type', 'pin_code'
        )
        
        # Create documents for embedding
        self.documents = []
        self.property_data = {}
        
        for prop in properties:
            # Create rich text descriptions
            description = f"""
            Property ID: {prop['property_id']}
            Type: {prop['type']} ({prop['building_type']})
            Location: {prop['locality__name']}
            Rent: ₹{prop['rent']}/month
            Deposit: ₹{prop['deposit']}
            Size: {prop['property_size']} sqft
            Bathrooms: {prop['bathroom']}
            Furnishing: {prop['furnishing']}
            Amenities: Gym={prop['gym']}, Parking={prop['parking']}, Lift={prop['lift']}, Pool={prop['swimming_pool']}
            """.strip()
            
            self.documents.append(description)
            self.property_data[len(self.documents) - 1] = prop
        
        # Create embeddings
        print("Creating embeddings...")
        embeddings = self.embedder.encode(self.documents)
        
        # Create FAISS index
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings))
        
        print(f"RAG system initialized with {len(self.documents)} properties")
        
        # Initialize LLM
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if openai_api_key:
            self.llm = ChatOpenAI(
                model_name="gpt-3.5-turbo",
                temperature=0.1,
                openai_api_key=openai_api_key
            )
        else:
            print("Warning: OPENAI_API_KEY not found. Using rule-based responses.")
    
    def search_similar_properties(self, query: str, k: int = 5) -> List[Dict]:
        """Search for similar properties using vector similarity"""
        if self.index is None:
            return []
        
        # Create query embedding
        query_embedding = self.embedder.encode([query])
        
        # Search
        distances, indices = self.index.search(np.array(query_embedding), k)
        
        # Get similar properties
        results = []
        for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
            if idx < len(self.documents):
                prop_data = self.property_data[idx]
                results.append({
                    'property': prop_data,
                    'similarity_score': 1 / (1 + dist),  # Convert distance to similarity
                    'description': self.documents[idx]
                })
        
        return results
    
    def extract_query_intent(self, query: str) -> Dict[str, Any]:
        """Extract intent and entities from user query"""
        query_lower = query.lower()
        
        intent = {
            'type': 'general',
            'entities': {},
            'budget': None,
            'locality': None,
            'bhk': None,
            'amenities': [],
            'comparison': False
        }
        
        # Extract budget
        budget_patterns = [
            r'under\s*(\d+)',
            r'below\s*(\d+)',
            r'less than\s*(\d+)',
            r'₹?(\d+)',
            r'budget\s*(\d+)'
        ]
        
        for pattern in budget_patterns:
            match = re.search(pattern, query_lower)
            if match:
                intent['budget'] = int(match.group(1))
                break
        
        # Extract locality
        localities = ['Whitefield', 'Bellandur', 'Electronic City', 'Brookefield', 'Varthur', 'Kaggadasapura', 'K.R Puram', 'Yelahanka']
        for locality in localities:
            if locality.lower() in query_lower:
                intent['locality'] = locality
                break
        
        # Extract BHK
        bhk_match = re.search(r'(\d+)\s*bhk', query_lower)
        if bhk_match:
            intent['bhk'] = f"{bhk_match.group(1)}BHK"
        
        # Extract amenities
        amenity_keywords = {
            'gym': ['gym', 'fitness', 'workout'],
            'parking': ['parking', 'car parking', 'vehicle'],
            'lift': ['lift', 'elevator'],
            'pool': ['pool', 'swimming', 'swimming pool']
        }
        
        for amenity, keywords in amenity_keywords.items():
            if any(keyword in query_lower for keyword in keywords):
                intent['amenities'].append(amenity)
        
        # Detect comparison queries
        if any(word in query_lower for word in ['better', 'compare', 'vs', 'versus']):
            intent['type'] = 'comparison'
            intent['comparison'] = True
        
        # Detect specific query types
        if any(word in query_lower for word in ['cheapest', 'lowest', 'minimum']):
            intent['type'] = 'price_analysis'
        elif any(word in query_lower for word in ['highest', 'most expensive', 'maximum']):
            intent['type'] = 'price_analysis'
        elif any(word in query_lower for word in ['average', 'avg', 'mean']):
            intent['type'] = 'statistical'
        elif any(word in query_lower for word in ['recommend', 'suggest', 'should']):
            intent['type'] = 'recommendation'
        elif any(word in query_lower for word in ['invest', 'investment', 'roi']):
            intent['type'] = 'investment'
        elif any(word in query_lower for word in ['family', 'children', 'school']):
            intent['type'] = 'family_advice'
        
        return intent
    
    def generate_contextual_response(self, query: str, intent: Dict[str, Any], similar_properties: List[Dict]) -> str:
        """Generate response using RAG with context"""
        if not self.llm:
            return self.generate_rule_based_response(query, intent, similar_properties)
        
        # Create context from similar properties
        context = ""
        if similar_properties:
            context = "Relevant Properties:\n"
            for i, result in enumerate(similar_properties[:3]):
                prop = result['property']
                context += f"""
{i+1}. {prop['building_type']} in {prop['locality__name']}
   - Rent: ₹{prop['rent']}/month, Size: {prop['property_size']} sqft
   - Amenities: Gym={prop['gym']}, Parking={prop['parking']}, Lift={prop['lift']}, Pool={prop['swimming_pool']}
"""
        
        # Create prompt
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are a knowledgeable real estate assistant for Bangalore rental properties. 
Use the provided context to answer user queries accurately. Be conversational and helpful.
If context doesn't contain relevant information, say so politely and provide general advice.
Always format currency as ₹X,XXX/month for rents."""),
            ("human", """Context: {context}
User Query: {query}
Intent Analysis: {intent}

Please provide a helpful, conversational response based on the context and intent.""")
        ])
        
        try:
            # Generate response
            response = self.llm.invoke(prompt_template.format_messages(
                context=context,
                query=query,
                intent=json.dumps(intent, indent=2)
            ))
            
            return response.content
        except Exception as e:
            print(f"LLM Error: {e}")
            return self.generate_rule_based_response(query, intent, similar_properties)
    
    def generate_rule_based_response(self, query: str, intent: Dict[str, Any], similar_properties: List[Dict]) -> str:
        """Generate rule-based response when LLM is not available"""
        query_type = intent['type']
        
        if query_type == 'price_analysis':
            if intent['budget']:
                affordable = [p['property'] for p in similar_properties if p['property']['rent'] <= intent['budget']]
                if affordable:
                    areas = list(set(p['locality__name'] for p in affordable))
                    return f"For ₹{intent['budget']:,}/month, you can find properties in: {', '.join(areas)}. These areas offer good value within your budget!"
                else:
                    cheapest = min(similar_properties, key=lambda x: x['property']['rent'])
                    return f"The most affordable option I found is ₹{cheapest['property']['rent']:,}/month in {cheapest['property']['locality__name']}. For your budget of ₹{intent['budget']:,}, consider looking at smaller properties or different areas."
        
        elif query_type == 'statistical' and intent['locality']:
            props_in_locality = [p['property'] for p in similar_properties if p['property']['locality__name'] == intent['locality']]
            if props_in_locality:
                avg_rent = sum(p['rent'] for p in props_in_locality) / len(props_in_locality)
                return f"The average rent in {intent['locality']} is ₹{int(avg_rent):,}/month based on {len(props_in_locality)} available properties."
        
        elif query_type == 'recommendation':
            if intent['amenities']:
                filtered = [p for p in similar_properties if all(p['property'][amen] for amen in intent['amenities'])]
                if filtered:
                    areas = list(set(p['property']['locality__name'] for p in filtered[:5]))
                    return f"For properties with {', '.join(intent['amenities'])}, consider these areas: {', '.join(areas)}. These locations offer the amenities you're looking for."
            
            if intent['bhk']:
                bhk_props = [p['property'] for p in similar_properties if intent['bhk'].lower() in p['property']['type'].lower()]
                if bhk_props:
                    avg_rent = sum(p['rent'] for p in bhk_props) / len(bhk_props)
                    return f"{intent['bhk']} properties are available across most areas. Average rent is around ₹{int(avg_rent):,}/month with sizes ranging from 800-1200 sqft."
        
        elif query_type == 'investment':
            # Find high-demand areas
            area_stats = {}
            for p in similar_properties:
                locality = p['property']['locality__name']
                if locality not in area_stats:
                    area_stats[locality] = {'count': 0, 'avg_rent': 0, 'premium_amenities': 0}
                
                area_stats[locality]['count'] += 1
                area_stats[locality]['avg_rent'] += p['property']['rent']
                if p['property']['gym'] or p['property']['swimming_pool']:
                    area_stats[locality]['premium_amenities'] += 1
            
            # Calculate averages
            for area in area_stats:
                area_stats[area]['avg_rent'] = area_stats[area]['avg_rent'] / area_stats[area]['count']
            
            # Sort by investment potential
            investment_areas = sorted(
                area_stats.items(),
                key=lambda x: (x[1]['premium_amenities'], x[1]['count']),
                reverse=True
            )[:3]
            
            recommendations = [f"{area} (₹{int(stats['avg_rent']):,})" for area, stats in investment_areas]
            return f"Top investment areas: {', '.join(recommendations)}. These show strong rental demand and good appreciation potential."
        
        elif query_type == 'family_advice':
            family_friendly = [p for p in similar_properties if p['property']['parking'] and p['property']['lift']]
            if family_friendly:
                areas = list(set(p['property']['locality__name'] for p in family_friendly[:5]))
                return f"For families, I recommend: {', '.join(areas)}. These areas offer essential amenities like parking and lifts that families typically need."
        
        # Default response
        if similar_properties:
            sample_props = similar_properties[:3]
            response = "I found some relevant properties for you:\n\n"
            for i, result in enumerate(sample_props):
                prop = result['property']
                response += f"{i+1}. {prop['building_type']} in {prop['locality__name']} - ₹{prop['rent']:,}/month\n"
            
            response += "\nWould you like more specific information about any of these areas or property types?"
            return response
        
        return "I can help you with Bangalore rental properties! Ask me about specific locations, average rents, amenities, or budget requirements."
    
    def query(self, user_query: str) -> str:
        """Main query method"""
        # Extract intent
        intent = self.extract_query_intent(user_query)
        
        # Search for similar properties
        similar_properties = self.search_similar_properties(user_query, k=10)
        
        # Generate contextual response
        response = self.generate_contextual_response(user_query, intent, similar_properties)
        
        return response

# Global RAG instance
rag_system = RAGSystem()

def get_rag_response(query: str) -> str:
    """Get response from RAG system"""
    try:
        return rag_system.query(query)
    except Exception as e:
        print(f"RAG Error: {e}")
        return "I'm having trouble processing your request right now. Please try again or ask about specific locations, rents, or amenities."

# Initialize RAG system on import
try:
    rag_system.initialize_system()
except Exception as e:
    print(f"Failed to initialize RAG system: {e}")
