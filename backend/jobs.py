from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId

from database import jobs_collection
from models import JobCreate
from auth import admin_required

router = APIRouter(tags=["Jobs"])


# =========================
# GET ALL JOBS (WITH FILTERS + PAGINATION)
# =========================
@router.get("/jobs")
def get_jobs(
    title: str = None,
    company: str = None,
    location: str = None,
    experience: str = None,
    type: str = None,
    min_salary: int = None,
    max_salary: int = None,
    page: int = 1,
    limit: int = 5
):

    query = {}

    if title:
        query["title"] = {"$regex": title, "$options": "i"}

    if company:
        query["company"] = {"$regex": company, "$options": "i"}

    if location:
        query["location"] = {"$regex": location, "$options": "i"}

    if experience:
        query["experience_level"] = experience

    if type:
        query["job_type"] = type

    if min_salary is not None and max_salary is not None:
        query["salary"] = {
            "$gte": min_salary,
            "$lte": max_salary
        }

    skip = (page - 1) * limit

    jobs = []

    for job in jobs_collection.find(query).skip(skip).limit(limit):
        job["_id"] = str(job["_id"])
        jobs.append(job)

    total = jobs_collection.count_documents(query)

    return {
        "jobs": jobs,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }


# =========================
# GET SINGLE JOB
# =========================
@router.get("/jobs/{job_id}")
def get_job(job_id: str):

    try:
        job = jobs_collection.find_one(
            {"_id": ObjectId(job_id)}
        )

    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid Job ID"
        )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    job["_id"] = str(job["_id"])

    return job


# =========================
# CREATE JOB
# =========================
@router.post("/jobs")
def create_job(
    job: JobCreate,
    current_user=Depends(admin_required)
):

    result = jobs_collection.insert_one({
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "salary": job.salary,
        "skills_required": job.skills_required,
        "description": job.description,
        "experience_level": job.experience_level,
        "job_type": job.job_type
    })

    return {
        "message": "Job created successfully",
        "job_id": str(result.inserted_id)
    }


# =========================
# UPDATE JOB
# =========================
@router.put("/jobs/{job_id}")
def update_job(
    job_id: str,
    job: JobCreate,
    current_user=Depends(admin_required)
):

    result = jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {
            "$set": {
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "salary": job.salary,
                "skills_required": job.skills_required,
                "description": job.description,
                "experience_level": job.experience_level,
                "job_type": job.job_type
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {"message": "Job updated successfully"}


# =========================
# DELETE JOB
# =========================
@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: str,
    current_user=Depends(admin_required)
):

    result = jobs_collection.delete_one(
        {"_id": ObjectId(job_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {"message": "Job deleted successfully"}