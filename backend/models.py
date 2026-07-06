from pydantic import BaseModel, EmailStr,field_validator,BaseModel
import re
from typing import Literal

class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"   # ADD THI

    @field_validator("password")
    def validate_password(cls, value):
        pattern = r'^[A-Z][a-z]+[!@#$%^&*]\d{3,}$'
        
        if not re.match(pattern, value):
            raise ValueError(
                "Password must be like Abcd@123 (1st letter uppercase, lowercase name, special char, numbers)"
            )
        
        return value
    
class LoginUser(BaseModel):
    email: EmailStr
    password: str
    
class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    salary: str
    skills_required: str
    description: str
    experience_level: Literal["Fresher", "Junior", "Mid", "Senior"]
    job_type: Literal["Full-time", "Part-time", "Internship", "Remote"] = "Full-time"
        
class ApplicationCreate(BaseModel):
    job_id: str