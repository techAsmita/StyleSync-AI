import os
import base64
import json
import anthropic
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="StyleSync AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL = "claude-sonnet-4-6"


def img_to_b64(data: bytes, content_type: str) -> dict:
    return {
        "type": "image",
        "source": {
            "type": "base64",
            "media_type": content_type,
            "data": base64.b64encode(data).decode("utf-8"),
        },
    }


def parse_json(raw: str) -> dict:
    cleaned = raw.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)


@app.get("/")
def root():
    return {"status": "StyleSync AI backend running"}


# ── REVENUE PILOT ──────────────────────────────────────────────────────────────
@app.post("/api/revenue-pilot")
async def revenue_pilot(
    occupancy: str = Form(...),
    day: str = Form(...),
    salon_type: str = Form(...),
):
    system = """You are RevenuePilot AI, a revenue intelligence engine for beauty salons in India.
Output ONLY valid JSON. No markdown, no preamble. Schema:
{
  "campaigns": [
    {
      "tag": "string",
      "name": "string",
      "desc": "string",
      "discount": "string",
      "bookings": number,
      "revenue_inr": number
    }
  ],
  "metrics": {
    "current_revenue_inr": number,
    "projected_revenue_inr": number,
    "increase_pct": number,
    "idle_slots": number
  }
}
Generate exactly 2 campaigns. Revenue realistic for Indian mid-tier salon (avg ticket 600 to 2000 rupees).
idle_slots = estimated empty appointment slots in the day."""

    prompt = f"Salon type: {salon_type}. Day: {day}. Current occupancy: {occupancy}. Generate revenue recovery campaigns."

    msg = client.messages.create(
        model=MODEL,
        max_tokens=800,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )

    try:
        data = parse_json(msg.content[0].text)
        return JSONResponse(content=data)
    except Exception as e:
        return JSONResponse(
            content={"error": "Parse error", "raw": msg.content[0].text},
            status_code=500,
        )


# ── STYLE MATCH ────────────────────────────────────────────────────────────────
@app.post("/api/style-match")
async def style_match(
    goals: str = Form(...),
    selfie: Optional[UploadFile] = File(None),
    inspiration: Optional[UploadFile] = File(None),
):
    system = """You are StyleMatch AI. Respond ONLY with valid JSON. No markdown.
Schema:
{
  "score": number,
  "style": "string",
  "face_shape": "string",
  "tags": ["string", "string", "string"],
  "recommendation": "string"
}
score = 0 to 100 compatibility.
recommendation = 2 to 3 sentences, specific and actionable.
tags = 3 short style descriptors."""

    content = []
    if selfie:
        data = await selfie.read()
        content.append(img_to_b64(data, selfie.content_type))
    if inspiration:
        data = await inspiration.read()
        content.append(img_to_b64(data, inspiration.content_type))

    content.append({
        "type": "text",
        "text": f"Hair goals: {goals}. Analyse face shape if selfie provided, recommend the best hairstyle, give compatibility score, and provide 3 short style tags. Output JSON only.",
    })

    msg = client.messages.create(
        model=MODEL,
        max_tokens=600,
        system=system,
        messages=[{"role": "user", "content": content}],
    )

    try:
        return JSONResponse(content=parse_json(msg.content[0].text))
    except Exception:
        return JSONResponse(
            content={"error": "Parse error", "raw": msg.content[0].text},
            status_code=500,
        )


# ── LOOK TRANSFER ──────────────────────────────────────────────────────────────
@app.post("/api/look-transfer")
async def look_transfer(
    image: Optional[UploadFile] = File(None),
):
    system = """You are Look Transfer Protocol AI. Respond ONLY with valid JSON. No markdown.
Schema:
{
  "length": "string",
  "cut": "string",
  "layers": "string",
  "color": "string",
  "texture": "string",
  "styling": "string",
  "notes": "string"
}
Use precise professional stylist terminology.
notes = 1 to 2 sentences of extra context for the stylist."""

    content = []
    if image:
        data = await image.read()
        content.append(img_to_b64(data, image.content_type))
        content.append({
            "type": "text",
            "text": "Analyse this hair inspiration image and output the stylist blueprint JSON.",
        })
    else:
        content.append({
            "type": "text",
            "text": "Generate a sample stylist blueprint for a warm brunette balayage with soft waves. Output JSON only.",
        })

    msg = client.messages.create(
        model=MODEL,
        max_tokens=600,
        system=system,
        messages=[{"role": "user", "content": content}],
    )

    try:
        return JSONResponse(content=parse_json(msg.content[0].text))
    except Exception:
        return JSONResponse(
            content={"error": "Parse error", "raw": msg.content[0].text},
            status_code=500,
        )


# ── BEAUTY INTELLIGENCE ────────────────────────────────────────────────────────
@app.post("/api/beauty-intel")
async def beauty_intel(
    image: Optional[UploadFile] = File(None),
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
treatment = 3 to 4 specific actionable recommendations in a single string."""

    content = []
    if image:
        data = await image.read()
        content.append(img_to_b64(data, image.content_type))
        content.append({
            "type": "text",
            "text": "Analyse hair health from this image. Output JSON only.",
        })
    else:
        content.append({
            "type": "text",
            "text": "Generate a realistic hair health analysis for a person with moderately dry, slightly frizzy Indian hair. Output JSON only.",
        })

    msg = client.messages.create(
        model=MODEL,
        max_tokens=500,
        system=system,
        messages=[{"role": "user", "content": content}],
    )

    try:
        return JSONResponse(content=parse_json(msg.content[0].text))
    except Exception:
        return JSONResponse(
            content={"error": "Parse error", "raw": msg.content[0].text},
            status_code=500,
        )