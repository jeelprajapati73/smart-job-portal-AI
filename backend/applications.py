from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime

from auth import get_current_user
from database import (
    jobs_collection,
    applications_collection
)
from models import ApplicationCreate

router = APIRouter(tags=["Applications"])


# =========================
# APPLY JOB
# =========================

@router.post("/apply")
def apply_job(
    application: ApplicationCreate,
    current_user=Depends(get_current_user)
):

    try:
        job = jobs_collection.find_one(
            {"_id": ObjectId(application.job_id)}
        )

    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid Job ID"
        )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job Not Found"
        )

    existing = applications_collection.find_one({
        "user_email": current_user["email"],
        "job_id": application.job_id
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already Applied"
        )

    applications_collection.insert_one({
        "user_email": current_user["email"],
        "job_id": application.job_id,
        "applied_at": datetime.utcnow()
    })

    return {
        "message": "Application Submitted Successfully"
    }


# =========================
# MY APPLICATIONS
# =========================

@router.get("/my-applications")
def my_applications(
    current_user=Depends(get_current_user)
):

    applications = list(
        applications_collection.find(
            {
                "user_email": current_user["email"]
            }
        )
    )

    result = []

    for app in applications:

        job = jobs_collection.find_one(
            {
                "_id": ObjectId(app["job_id"])
            }
        )

        if job:

            result.append({
                "job_id": str(job["_id"]),
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "salary": job["salary"],
                "experience_level": job["experience_level"]
            })

    return result