from pydantic import BaseModel


class EvaluateRequest(BaseModel):
    hitRateK: int = 5
    recallK: int = 5
    precisionK: int = 5


class EvaluateResponse(BaseModel):
    precision: float
    recall: float
    hit_rate: float
    mrr: float