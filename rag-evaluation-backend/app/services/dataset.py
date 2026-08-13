# app/services/dataset.py
import json
from typing import List
from app.models import Question


class TestDataset:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.questions: List[Question] = []
        self._load()
    
    def _load(self):
        print(f"[LOG] Загрузка датасета из файла: {self.file_path}")
        with open(self.file_path, 'r', encoding='utf-8') as f:
            dataset = json.load(f)
        
        for fragment in dataset.get("fragments", []):
            for q in fragment.get("questions", []):
                self.questions.append(Question(
                    text=q.get("text", ""),
                    ground_truth=q.get("ground_truth", ""),
                    relevant_documents=q.get("relevant_documents", [])
                ))
        
        print(f"[LOG] Загружено {len(self.questions)} вопросов")
    
    @property
    def total_questions(self) -> int:
        return len(self.questions)
    
    def get_questions(self) -> List[Question]:
        return self.questions