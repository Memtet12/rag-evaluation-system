import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio
from app.models import EvaluateRequest, EvaluateResponse
from app.services import TestDataset, EvaluationPipeline, FileStorage
from app.clients import RAGAPIClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="RAG Evaluation API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

file_storage = FileStorage()
rag_client = RAGAPIClient(
    base_url= os.getenv("RAG_API_URL"),
    config_id= os.getenv("RAG_CONFIG_ID"),
    username= os.getenv("RAG_USERNAME"),
    password= os.getenv("RAG_PASSWORD")
)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"[LOG] POST /upload - получен файл: {file.filename}")
    
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="Only JSON files are allowed")
    
    content = await file.read()
    try:
        json.loads(content)
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    
    file_storage.save(file.filename, content)
    return {"filename": file.filename, "size": len(content), "status": "uploaded"}


@app.post("/evaluate-stream")
async def evaluate_stream(request: EvaluateRequest):
    print(f"[LOG] POST /evaluate-stream - получен запрос")
    
    async def event_generator():
        file_path = file_storage.get_latest_file()
        if not file_path:
            yield f"data: {json.dumps({'type': 'error', 'message': 'No dataset file uploaded'})}\n\n"
            return
        
        dataset = TestDataset(file_path)
        print(f"[LOG] Всего вопросов в датасете: {dataset.total_questions}")
        
        pipeline = EvaluationPipeline(rag_client, dataset)
        total = dataset.total_questions
        
        questions = dataset.get_questions()
        
        all_precisions = []
        all_recalls = []
        all_hit_rates = []
        all_mrrs = []
        
        for idx, question in enumerate(questions):
            if not question.text or not question.relevant_documents:
                continue
            
            try:
                response = await rag_client.execute(question.text)
                retrieved_docs = response.get_retrieved_documents()
                
                from app.services.metrics import MetricsCalculator
                metrics = MetricsCalculator.evaluate_single(
                    retrieved_docs=retrieved_docs,
                    relevant_docs=question.relevant_documents,
                    precision_k=request.precisionK,
                    recall_k=request.recallK,
                    hit_rate_k=request.hitRateK
                )
                
                all_precisions.append(metrics["precision"])
                all_recalls.append(metrics["recall"])
                all_hit_rates.append(metrics["hit_rate"])
                all_mrrs.append(metrics["mrr"])
                
                progress = int((idx + 1) / total * 100)
                
                print(f"[LOG] Прогресс: {progress}% ({idx+1}/{total})")
                
                # Отправляем прогресс в реальном времени
                yield f"data: {json.dumps({'type': 'progress', 'progress': progress, 'current': idx + 1, 'total': total})}\n\n"
                
                # Небольшая задержка для плавности
                await asyncio.sleep(0.01)
                
            except Exception as e:
                print(f"Ошибка: {e}")
                continue
        

        if all_precisions:
            avg_precision = sum(all_precisions) / len(all_precisions)
            avg_recall = sum(all_recalls) / len(all_recalls)
            avg_hit_rate = sum(all_hit_rates) / len(all_hit_rates)
            avg_mrr = sum(all_mrrs) / len(all_mrrs)
            
            result = {
                "precision": round(avg_precision, 4),
                "recall": round(avg_recall, 4),
                "hit_rate": round(avg_hit_rate, 4),
                "mrr": round(avg_mrr, 4)
            }
            
            print(f"[LOG] Финальные результаты: {result}")
            yield f"data: {json.dumps({'type': 'complete', 'results': result})}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'error', 'message': 'No questions were processed'})}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/evaluate", response_model=EvaluateResponse)
async def evaluate(request: EvaluateRequest):
    file_path = file_storage.get_latest_file()
    if not file_path:
        raise HTTPException(status_code=400, detail="No dataset file uploaded")
    
    dataset = TestDataset(file_path)
    print(f"\n📊 Всего вопросов в датасете: {dataset.total_questions}")
    
    pipeline = EvaluationPipeline(rag_client, dataset)
    result = await pipeline.run(
        precision_k=request.precisionK,
        recall_k=request.recallK,
        hit_rate_k=request.hitRateK
    )
    
    print(f"\n{'='*60}")
    print(f"✅ Precision@{request.precisionK}: {result.avg_precision:.4f}")
    print(f"✅ Recall@{request.recallK}: {result.avg_recall:.4f}")
    print(f"✅ Hit Rate@{request.hitRateK}: {result.avg_hit_rate:.4f}")
    print(f"✅ MRR: {result.avg_mrr:.4f}")
    print(f"{'='*60}")
    
    return EvaluateResponse(**result.to_dict())


@app.get("/")
async def root():
    return {"message": "RAG Evaluation API", "status": "running"}


@app.get("/files")
async def list_files():
    return {"files": file_storage.list_files()}


@app.delete("/files/{filename}")
async def delete_file(filename: str):
    if file_storage.delete(filename):
        return {"status": "deleted", "filename": filename}
    raise HTTPException(status_code=404, detail="File not found")