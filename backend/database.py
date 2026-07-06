from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client.smart_job_portal

users_collection = db.users
jobs_collection = db.jobs
applications_collection = db.applications