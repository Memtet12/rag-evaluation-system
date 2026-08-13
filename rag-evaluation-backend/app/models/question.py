from typing import List


class Question:
    """Модель тестового вопроса"""
    
    def __init__(self, text: str, ground_truth: str, relevant_documents: List[str]):
        self.text = text
        self.ground_truth = ground_truth
        self.relevant_documents = relevant_documents