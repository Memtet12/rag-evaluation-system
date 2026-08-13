# app/services/evaluation.py
from typing import Dict, List, Callable
from app.models import Question
from app.clients import RAGAPIClient
from .metrics import MetricsCalculator


class EvaluationResult:
    def __init__(self):
        self.precisions = []
        self.recalls = []
        self.hit_rates = []
        self.mrrs = []
    
    def add(self, precision: float, recall: float, hit_rate: float, mrr: float):
        self.precisions.append(precision)
        self.recalls.append(recall)
        self.hit_rates.append(hit_rate)
        self.mrrs.append(mrr)
    
    @property
    def avg_precision(self) -> float:
        return sum(self.precisions) / len(self.precisions) if self.precisions else 0.0
    
    @property
    def avg_recall(self) -> float:
        return sum(self.recalls) / len(self.recalls) if self.recalls else 0.0
    
    @property
    def avg_hit_rate(self) -> float:
        return sum(self.hit_rates) / len(self.hit_rates) if self.hit_rates else 0.0
    
    @property
    def avg_mrr(self) -> float:
        return sum(self.mrrs) / len(self.mrrs) if self.mrrs else 0.0
    
    def to_dict(self) -> Dict[str, float]:
        return {
            "precision": round(self.avg_precision, 4),
            "recall": round(self.avg_recall, 4),
            "hit_rate": round(self.avg_hit_rate, 4),
            "mrr": round(self.avg_mrr, 4)
        }


class EvaluationPipeline:
    def __init__(self, rag_client: RAGAPIClient, dataset):
        self.rag_client = rag_client
        self.dataset = dataset
        self.result = EvaluationResult()
    
    async def run(self, precision_k: int, recall_k: int, hit_rate_k: int) -> EvaluationResult:
        questions = self.dataset.get_questions()
        total = len(questions)
        print(f"[LOG] Запуск оценки {total} вопросов")
        
        for idx, question in enumerate(questions):
            print(f"[LOG] Обработка вопроса {idx+1}/{total}: {question.text[:50]}...")
            
            if not question.text or not question.relevant_documents:
                print(f"[LOG] Пропуск вопроса {idx+1}: нет текста или релевантных документов")
                continue
            
            try:
                response = await self.rag_client.execute(question.text)
                retrieved_docs = response.get_retrieved_documents()
                
                metrics = MetricsCalculator.evaluate_single(
                    retrieved_docs=retrieved_docs,
                    relevant_docs=question.relevant_documents,
                    precision_k=precision_k,
                    recall_k=recall_k,
                    hit_rate_k=hit_rate_k
                )
                
                self.result.add(
                    precision=metrics["precision"],
                    recall=metrics["recall"],
                    hit_rate=metrics["hit_rate"],
                    mrr=metrics["mrr"]
                )
                
                print(f"[LOG] Найденные документы: {retrieved_docs}")
                print(f"[LOG] Ожидаемые документы: {question.relevant_documents}")
                print(f"[LOG] Совпали: {set(retrieved_docs) & set(question.relevant_documents)}")
                print(f"[LOG] Precision={metrics['precision']:.4f}, Recall={metrics['recall']:.4f}, Hit Rate={metrics['hit_rate']:.4f}, MRR={metrics['mrr']:.4f}")
                
            except Exception as e:
                print(f"[LOG] ОШИБКА при обработке вопроса {idx+1}: {e}")
                continue
        
        print(f"[LOG] Оценка завершена")
        return self.result
    
    async def run_with_progress(self, precision_k: int, recall_k: int, hit_rate_k: int, 
                                 on_progress: Callable[[int, int, int], None]) -> EvaluationResult:
        questions = self.dataset.get_questions()
        total = len(questions)
        print(f"[LOG] Запуск оценки {total} вопросов (с прогрессом)")
        
        for idx, question in enumerate(questions):
            print(f"[LOG] Обработка вопроса {idx+1}/{total}: {question.text[:50]}...")
            
            if not question.text or not question.relevant_documents:
                print(f"[LOG] Пропуск вопроса {idx+1}: нет текста или релевантных документов")
                continue
            
            try:
                response = await self.rag_client.execute(question.text)
                retrieved_docs = response.get_retrieved_documents()
                
                metrics = MetricsCalculator.evaluate_single(
                    retrieved_docs=retrieved_docs,
                    relevant_docs=question.relevant_documents,
                    precision_k=precision_k,
                    recall_k=recall_k,
                    hit_rate_k=hit_rate_k
                )
                
                self.result.add(
                    precision=metrics["precision"],
                    recall=metrics["recall"],
                    hit_rate=metrics["hit_rate"],
                    mrr=metrics["mrr"]
                )
                
                print(f"[LOG] Найденные документы: {retrieved_docs}")
                print(f"[LOG] Ожидаемые документы: {question.relevant_documents}")
                print(f"[LOG] Совпали: {set(retrieved_docs) & set(question.relevant_documents)}")
                
                progress = int((idx + 1) / total * 100)
                on_progress(progress, idx + 1, total)
                
            except Exception as e:
                print(f"[LOG] ОШИБКА при обработке вопроса {idx+1}: {e}")
                continue
        
        print(f"[LOG] Оценка завершена")
        return self.result