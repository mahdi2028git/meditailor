"""
MediTailor — Hospital Clothing Factory
Python (FastAPI) backend: API + multi-language website in one process.
"""

from datetime import datetime
from pathlib import Path
from typing import Optional
from enum import Enum

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field

# Project root (parent of backend/)
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR  # index.html, css/, js/ live here

app = FastAPI(
    title="MediTailor",
    description="Hospital clothing factory — website + API (Python/FastAPI)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Models ----------

class ProductCategory(str, Enum):
    scrubs = "scrubs"
    lab_coats = "lab_coats"
    surgical_gowns = "surgical_gowns"
    protective = "protective"
    patient_gowns = "patient_gowns"
    accessories = "accessories"


class Product(BaseModel):
    id: str
    category: ProductCategory
    name: dict[str, str]
    description: dict[str, str]
    tags: dict[str, list[str]]
    emoji: str
    colors: Optional[list[str]] = None
    sizes: Optional[list[str]] = None


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    company: Optional[str] = Field(None, max_length=150)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=30)
    product: Optional[str] = None
    message: str = Field(..., min_length=5, max_length=2000)
    language: Optional[str] = "en"


class ContactResponse(BaseModel):
    success: bool
    message: str
    id: str
    timestamp: str


class SiteStats(BaseModel):
    years_experience: int
    hospital_clients: int
    units_per_month: int
