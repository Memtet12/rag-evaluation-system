from pydantic import BaseModel
from typing import List, Optional, Dict

class MetricSelector(BaseModel):
    label: str
    value:int
    showInput: bool = True

class EvaluateRequest(BaseModel):
    """"Запрос на оценку RAG"""
    hit_rate_k: int = 5
    racall_k: int = 5
    precision_k: int = 5
    dataset_file: Optional[str] = None

class EvaluateResponse(BaseModel):
    """Ответ с метриками"""
    precision: float
    recall: float
    hit_rate: float
    mrr: float

class UploadResponse(BaseModel):
    filename: str
    size: int
    status: str