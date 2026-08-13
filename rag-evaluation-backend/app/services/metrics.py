# app/services/metrics.py
from typing import List, Dict


class MetricsCalculator:
    @staticmethod
    def precision(retrieved_docs: List[str], relevant_docs: List[str], k: int) -> float:
        if k <= 0:
            return 0.0
        retrieved_at_k = retrieved_docs[:k]
        relevant_retrieved = [d for d in retrieved_at_k if d in relevant_docs]
        return len(relevant_retrieved) / k
    
    @staticmethod
    def recall(retrieved_docs: List[str], relevant_docs: List[str], k: int) -> float:
        if not relevant_docs:
            return 0.0
        retrieved_at_k = retrieved_docs[:k]
        relevant_retrieved = [d for d in retrieved_at_k if d in relevant_docs]
        return min(len(relevant_retrieved) / len(relevant_docs), 1.0)
    
    @staticmethod
    def hit_rate(retrieved_docs: List[str], relevant_docs: List[str], k: int) -> float:
        retrieved_at_k = retrieved_docs[:k]
        return 1.0 if any(d in retrieved_at_k for d in relevant_docs) else 0.0
    
    @staticmethod
    def mrr(retrieved_docs: List[str], relevant_docs: List[str]) -> float:
        for rank, doc_name in enumerate(retrieved_docs, start=1):
            if doc_name in relevant_docs:
                return 1.0 / rank
        return 0.0
    
    @classmethod
    def evaluate_single(cls, retrieved_docs: List[str], relevant_docs: List[str], 
                        precision_k: int, recall_k: int, hit_rate_k: int) -> Dict[str, float]:
        return {
            "precision": cls.precision(retrieved_docs, relevant_docs, precision_k),
            "recall": cls.recall(retrieved_docs, relevant_docs, recall_k),
            "hit_rate": cls.hit_rate(retrieved_docs, relevant_docs, hit_rate_k),
            "mrr": cls.mrr(retrieved_docs, relevant_docs)
        }