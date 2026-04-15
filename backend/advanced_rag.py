import os
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Avg, Count, Q
from properties.models import Property, Location

try:
    from openai import OpenAI
except Exception:
    OpenAI = None

def _fmt_inr(x: float) -> str:
    if pd.isna(x):
        return "-"
    return f"₹{x:,.0f}"

def _top_table(series: pd.Series, k: int = 3, value_fmt=str) -> str:
    s = series.dropna().sort_values(ascending=False).head(k)
    if s.empty:
        return ""
    lines = []
    for i, (idx, val) in enumerate(s.items(), start=1):
        lines.append(f"{i}. {idx}: {value_fmt(val)}")
    return "\n".join(lines)

def get_property_dataframe():
    """Convert Django properties to pandas DataFrame"""
    properties = Property.objects.all().values(
        'property_id', 'type', 'rent', 'deposit', 'property_size', 'bathroom',
        'furnishing', 'gym', 'parking', 'lift', 'swimming_pool',
        'locality__name', 'building_type', 'pin_code'
    )
    
    df = pd.DataFrame(list(properties))
    
    if df.empty:
        return df
    
    # Add derived columns
    df['bhk'] = df['type'].str.extract(r'(\d+)BHK')[0].fillna('1')
    df['area_sqft'] = df['property_size']
    df['has_gym'] = df['gym'].astype(int)
    df['has_pool'] = df['swimming_pool'].astype(int)
    df['has_lift'] = df['lift'].astype(int)
    df['has_parking'] = df['parking'].astype(int)
    df['amenity_score'] = df[['has_gym', 'has_pool', 'has_lift', 'has_parking']].sum(axis=1) / 4.0
    
    # Calculate rent per sqft
    df['rent_per_sqft'] = df['rent'] / df['area_sqft'].replace(0, np.nan)
    
    # Bachelor/family friendly (simplified)
    df['bachelor_friendly'] = np.where(df['type'].str.contains('RK|1BHK', case=False, na=False), 1, 0)
    df['family_friendly'] = np.where(df['type'].str.contains('2BHK|3BHK', case=False, na=False), 1, 0)
    
    return df

def deterministic_answer(df: pd.DataFrame, query: str):
    """Direct numeric answers for frequent BI questions."""
    q = (query or "").strip().lower()
    if df.empty or not q:
        return None

    by_loc = df.groupby("locality__name")

    # Highest / lowest average rent
    if ("highest" in q or "max" in q) and ("rent" in q) and ("average" in q or "avg" in q):
        m = by_loc["rent"].mean().sort_values(ascending=False)
        ans = f"Highest average rent is in {m.index[0]}: {_fmt_inr(m.iloc[0])} per month."
        ev = "Top localities by average rent:\n" + _top_table(m, value_fmt=_fmt_inr)
        return ans, ev

    if ("lowest" in q or "cheapest" in q or "min" in q) and ("rent" in q) and ("average" in q or "avg" in q):
        m = by_loc["rent"].mean().sort_values(ascending=True)
        ans = f"Lowest average rent is in {m.index[0]}: {_fmt_inr(m.iloc[0])} per month."
        ev = "Bottom localities by average rent:\n" + "\n".join(
            [f"{i}. {idx}: {_fmt_inr(val)}" for i, (idx, val) in enumerate(m.head(3).items(), start=1)]
        )
        return ans, ev

    # Supply
    if ("highest" in q or "most" in q) and ("listing" in q or "supply" in q or "properties" in q):
        c = by_loc["property_id"].nunique().sort_values(ascending=False)
        ans = f"Most listings are in {c.index[0]}: {int(c.iloc[0])} listings."
        ev = "Top localities by listings:\n" + _top_table(c, value_fmt=lambda v: f"{int(v)}")
        return ans, ev

    # Amenities
    if ("most" in q or "highest" in q) and ("amenit" in q or "gym" in q or "pool" in q or "lift" in q or "parking" in q):
        a = (
            by_loc[["has_gym", "has_lift", "has_pool", "has_parking"]]
            .mean()
            .sum(axis=1)
            .sort_values(ascending=False)
        )
        ans = f"Most amenity-rich locality is {a.index[0]} (average amenity score {a.iloc[0]:.2f} out of 4)."
        ev = "Top localities by amenity score:\n" + _top_table(a, value_fmt=lambda v: f"{v:.2f}")
        return ans, ev

    # Bachelors / families
    if ("bachelor" in q or "bachelors" in q):
        b = by_loc["bachelor_friendly"].mean().sort_values(ascending=False)
        ans = f"Best for bachelors is {b.index[0]}: {b.iloc[0]*100:.0f}% of listings allow bachelor/anyone."
        ev = "Top localities by bachelor-friendly share:\n" + _top_table(
            b, value_fmt=lambda v: f"{v*100:.0f}%"
        )
        return ans, ev

    if ("family" in q or "families" in q):
        f = by_loc["family_friendly"].mean().sort_values(ascending=False)
        ans = f"Best for families is {f.index[0]}: {f.iloc[0]*100:.0f}% of listings are family lease-type."
        ev = "Top localities by family share:\n" + _top_table(f, value_fmt=lambda v: f"{v*100:.0f}%")
        return ans, ev

    # Investors: rent-to-deposit ratio
    if ("invest" in q or "roi" in q or "yield" in q) and ("deposit" in q or "ratio" in q or "rent-to-deposit" in q):
        r = (
            (df["rent"] / df["deposit"].replace(0, np.nan))
            .groupby(df["locality__name"])
            .mean()
            .sort_values(ascending=False)
        )
        ans = f"Best rent-to-deposit ratio is in {r.index[0]}: {r.iloc[0]:.3f}."
        ev = "Top localities by rent-to-deposit ratio:\n" + _top_table(r, value_fmt=lambda v: f"{v:.3f}")
        return ans, ev

    return None

def build_rag_documents(df: pd.DataFrame) -> list[str]:
    """Richer text chunks for retrieval: locality, BHK, amenity impact."""
    docs: list[str] = []
    if df.empty:
        return docs

    # Locality level
    loc = (
        df.groupby("locality__name")
        .agg(
            listings=("property_id", "nunique"),
            avg_rent=("rent", "mean"),
            min_rent=("rent", "min"),
            max_rent=("rent", "max"),
            avg_size=("area_sqft", "mean"),
            avg_rent_psf=("rent_per_sqft", "mean"),
            amenity_score=("amenity_score", "mean"),
            bachelor_share=("bachelor_friendly", "mean"),
            family_share=("family_friendly", "mean"),
        )
        .reset_index()
    )
    for _, r in loc.iterrows():
        docs.append(
            f"[LOCALITY] {r['locality__name']} | listings={int(r['listings'])} | "
            f"avg_rent={_fmt_inr(r['avg_rent'])} | min_rent={_fmt_inr(r['min_rent'])} | max_rent={_fmt_inr(r['max_rent'])} | "
            f"avg_size={r['avg_size']:.0f} sqft | rent_psf=₹{r['avg_rent_psf']:.1f} | "
            f"amenity_score={r['amenity_score']:.2f}/4 | bachelor_share={r['bachelor_share']*100:.0f}% | "
            f"family_share={r['family_share']*100:.0f}%"
        )

    # Locality × BHK
    lb = (
        df.groupby(["locality__name", "bhk"])
        .agg(
            listings=("property_id", "nunique"),
            avg_rent=("rent", "mean"),
            avg_size=("area_sqft", "mean"),
        )
        .reset_index()
    )
    for _, r in lb.iterrows():
        docs.append(
            f"[LOCALITY_BHK] {r['locality__name']} | bhk={r['bhk']} | listings={int(r['listings'])} | "
            f"avg_rent={_fmt_inr(r['avg_rent'])} | avg_size={r['avg_size']:.0f} sqft"
        )

    # Amenity impact
    for amen_col, label in [
        ("has_gym", "gym"),
        ("has_pool", "swimming_pool"),
        ("has_lift", "lift"),
        ("has_parking", "parking"),
    ]:
        with_amen = df[df[amen_col] == 1]["rent"].mean()
        without_amen = df[df[amen_col] == 0]["rent"].mean()
        if pd.notna(with_amen) and pd.notna(without_amen):
            delta = with_amen - without_amen
            docs.append(
                f"[AMENITY_IMPACT] amenity={label} | avg_rent_with={_fmt_inr(with_amen)} | "
                f"avg_rent_without={_fmt_inr(without_amen)} | delta={_fmt_inr(delta)}"
            )

    return docs

def llm_answer(query: str, context: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if OpenAI is None or not api_key:
        return (
            "Here is what the data shows based on your question:\n\n"
            f"{context}\n\n"
            "This answer is generated directly from the dataset without an external LLM."
        )
    client = OpenAI(api_key=api_key)
    system_prompt = (
        "You are an AI assistant for a Bengaluru real estate BI dashboard. "
        "Answer strictly using numerical evidence in CONTEXT from rental dataset. "
        "Be concise (3–6 sentences) and include key numbers such as average rent, size, and counts."
    )
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"CONTEXT:\n{context}\n\nQUESTION: {query}"},
    ]
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2,
    )
    return completion.choices[0].message.content

def answer_question(df: pd.DataFrame, query: str) -> tuple[str, str]:
    # 1) Deterministic answers for common project questions
    det = deterministic_answer(df, query)
    if det is not None:
        return det

    # 2) RAG over richer documents for everything else
    docs = build_rag_documents(df)
    if not docs:
        return "No data available to answer this question.", ""
    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(docs)
    q_vec = vectorizer.transform([query])
    sims = cosine_similarity(q_vec, matrix)[0]
    top_idx = np.argsort(sims)[::-1][:6]
    retrieved = [docs[i] for i in top_idx]
    context = "\n".join(retrieved)
    answer = llm_answer(query, context)
    return answer, context

def get_advanced_rag_response(query: str) -> str:
    """Main function to get RAG response"""
    try:
        df = get_property_dataframe()
        answer, evidence = answer_question(df, query)
        return answer
    except Exception as e:
        print(f"Advanced RAG Error: {e}")
        return "I'm having trouble processing your request. Please try asking about specific locations, rents, or amenities."
