from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os

from database import users_collection
from models import RegisterUser

router = APIRouter()

# ---------------- PASSWORD HASHING ----------------

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

# ---------------- JWT SETTINGS ----------------

SECRET_KEY = "smartjobportalkey"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

# ---------------- REGISTER ----------------

@router.post("/register")
def register(user: RegisterUser):

    existing = users_collection.find_one(
        {"email": user.email}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = pwd_context.hash(
        user.password
    )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "resume": None
    })

    return {
        "message": "User Registered Successfully"
    }
    
    # ---------------- LOGIN ----------------

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    db_user = users_collection.find_one(
        {"email": form_data.username}
    )

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid Email"
        )

    if not pwd_context.verify(
        form_data.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid Password"
        )

    token_data = {
        "sub": db_user["email"],
        "role": db_user["role"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }

    token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
    
    # ---------------- CURRENT USER ----------------

def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = users_collection.find_one(
        {"email": email}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    return user


# ---------------- ADMIN CHECK ----------------

def admin_required(
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin Access Required"
        )

    return current_user

# ---------------- MY PROFILE ----------------

@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return {
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"]
    }
    
    
    # ---------------- UPLOAD RESUME ----------------

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    upload_dir = "uploads/resumes"

    os.makedirs(upload_dir, exist_ok=True)

    filename = f"{current_user['email']}_{file.filename}"

    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    users_collection.update_one(
        {"email": current_user["email"]},
        {
            "$set": {
                "resume": file_path
            }
        }
    )

    return {
        "message": "Resume Uploaded Successfully",
        "resume_path": file_path
    }