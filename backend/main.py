from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router, get_current_user
from jobs import router as jobs_router
from applications import router as applications_router

from database import jobs_collection
from ai import calculate_match

app = FastAPI()

# ---------------- REGISTER ROUTERS ----------------

app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- HOME ----------------

@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }

# ---------------- MY PROFILE ----------------

@app.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }

# ---------------- RESUME MATCHING ----------------

@app.post("/resume-match")
async def resume_match(
    file: UploadFile = File(...)
):
    content = await file.read()

    try:
        resume_text = content.decode("utf-8")
    except:
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid text file"
        )

    jobs = list(jobs_collection.find())

    results = []

    for job in jobs:

        description = job.get("description", "")

        score = calculate_match(
            resume_text,
            description
        )

        results.append({
            "job_id": str(job["_id"]),
            "title": job.get("title"),
            "company": job.get("company"),
            "score": score
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results