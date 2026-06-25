from groq import Groq
from dotenv import load_dotenv
import os
import json
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

app = FastAPI(title="StyleSync AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "StyleSync AI backend running"}


# ─────────────────────────────────────────────────────────────
# REVENUE PILOT
# ─────────────────────────────────────────────────────────────
@app.post("/api/revenue-pilot")
async def revenue_pilot(
    occupancy: str = Form(...),
    day: str = Form(...),
    salon_type: str = Form(...),
):
    try:
        occ = int(occupancy)
    except:
        occ = 50

    current_revenue = occ * 120

    prompt = f"""
You are RevenuePilot AI.

Salon Type: {salon_type}
Day: {day}
Occupancy: {occ}%

Return ONLY valid JSON.

Schema:

{{
  "campaigns":[
    {{
      "tag":"string",
      "name":"string",
      "desc":"string",
      "discount":"string",
      "bookings":number,
      "revenue_inr":number
    }},
    {{
      "tag":"string",
      "name":"string",
      "desc":"string",
      "discount":"string",
      "bookings":number,
      "revenue_inr":number
    }}
  ],
  "metrics": {{
      "projected_revenue_inr": number,
      "increase_pct": number,
      "idle_slots": number
  }}
}}

Generate realistic salon business recommendations for India.
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.8,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        raw = response.choices[0].message.content

        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)

        data["metrics"]["current_revenue_inr"] = current_revenue

        return JSONResponse(content=data)

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e)
            }
        )


# ─────────────────────────────────────────────────────────────
# STYLE MATCH
# ─────────────────────────────────────────────────────────────
# ─────────────────────────────────────────────────────────────
# STYLE MATCH
# ─────────────────────────────────────────────────────────────
@app.post("/api/style-match")
async def style_match(
    goals: str = Form(...),
    selfie: Optional[UploadFile] = File(None),
    inspiration: Optional[UploadFile] = File(None),
):

    prompt = f"""
You are StyleMatch AI.

Hair Goals:
{goals}

Return ONLY valid JSON.

Schema:

{{
  "score": number,
  "style": "string",
  "face_shape": "string",
  "tags": ["string","string","string"],
  "recommendation": "string"
}}

Act like a premium beauty stylist.

Generate:
- hairstyle recommendation
- face shape
- compatibility score
- 3 style tags
- recommendation paragraph

Output JSON only.
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.9,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        raw = response.choices[0].message.content

        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)

        if data["score"] <= 1:
            data["score"] = int(data["score"] * 100)

        return JSONResponse(content=data)

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e)
            }
        )


# ─────────────────────────────────────────────────────────────
# LOOK TRANSFER
# ─────────────────────────────────────────────────────────────
@app.post("/api/look-transfer")
async def look_transfer(
    image: Optional[UploadFile] = File(None),
):

    prompt = """
You are LookTransfer AI.

Return ONLY valid JSON.

Schema:

{
  "length":"string",
  "cut":"string",
  "layers":"string",
  "color":"string",
  "texture":"string",
  "styling":"string",
  "notes":"string"
}

Act like a professional salon stylist.

Generate a realistic hairstyle blueprint.

Output JSON only.
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.9,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        raw = response.choices[0].message.content

        raw = raw.replace("```json", "").replace("```", "").strip()

        data = json.loads(raw)

        return JSONResponse(content=data)

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e)
            }
        )


# ─────────────────────────────────────────────────────────────
# BEAUTY INTEL
# ─────────────────────────────────────────────────────────────
@app.post("/api/beauty-intel")
async def beauty_intel(
    image: Optional[UploadFile] = File(None),
    demo_case: Optional[str] = Form(None),
):
    system = """You are Beauty Intelligence AI. Output ONLY valid JSON. No markdown.
Schema:
{
  "dryness": number,
  "frizz": number,
  "split_ends": number,
  "scalp_health": number,
  "overall_score": number,
  "treatment": "string"
}
All scores 1 to 10 where 10 is healthiest.
Be CRITICAL and realistic. Most real hair has problems.
Score distribution guide:
- Severely damaged: 2-4
- Below average: 4-5  
- Average: 5-6
- Good: 6-8
- Excellent: 8-9.5
Never give 10 unless hair is absolutely perfect.
The overall_score must logically match the individual metrics.
treatment = 3 to 4 specific actionable recommendations."""

    # Predefined demo scenarios
    DEMO_CASES = {
        "healthy": {
            "dryness": 9, "frizz": 8, "split_ends": 9, "scalp_health": 9,
            "overall_score": 9,
            "treatment": "Your hair is in excellent condition. Use a silk pillowcase to reduce friction overnight. Apply a lightweight leave-in conditioner weekly to maintain moisture balance. Trim every 10 to 12 weeks to keep ends fresh. Protect hair from UV exposure with a heat protectant spray when outdoors."
        },
        "dry": {
            "dryness": 3, "frizz": 4, "split_ends": 4, "scalp_health": 5,
            "overall_score": 4,
            "treatment": "Hair shows significant dryness and moisture loss. Begin a weekly deep conditioning treatment with a protein-moisture balance mask. Switch to a sulfate-free shampoo immediately. Apply argan or jojoba oil to ends before bed. Reduce heat styling to maximum twice per week and always use a heat protectant."
        },
        "colour_damage": {
            "dryness": 4, "frizz": 5, "split_ends": 3, "scalp_health": 6,
            "overall_score": 4,
            "treatment": "Colour-treated hair shows porosity damage and split ends. Use a bond-repair treatment such as Olaplex or K18 every two weeks. Avoid overlapping colour on previously treated hair. Deep condition with a purple toning mask to neutralise brassiness. Trim at least two centimetres to remove severely split ends."
        },
        "average": {
            "dryness": 6, "frizz": 6, "split_ends": 6, "scalp_health": 7,
            "overall_score": 6,
            "treatment": "Hair condition is average with room for improvement. Introduce a bi-weekly hydrating hair mask into your routine. Use a wide-tooth comb on wet hair to reduce breakage. Limit heat styling to three times per week. Consider a scalp massage with coconut oil once a week to improve circulation."
        },
    }

    # Demo mode — return predefined case
    if not image:
        import random
        case_key = demo_case if demo_case in DEMO_CASES else random.choice(list(DEMO_CASES.keys()))
        return JSONResponse(content=DEMO_CASES[case_key])

    # Real image — call Groq
    try:
        prompt = system + "\n\nAnalyse this hair image critically and realistically. Look for actual signs of damage, dryness, frizz, split ends. Do not default to average scores. Output JSON only."
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = response.choices[0].message.content
        raw = raw.replace("```json", "").replace("```", "").strip()
        data = json.loads(raw)
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})