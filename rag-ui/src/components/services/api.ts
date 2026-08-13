// src/components/services/api.ts
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export interface EvaluateResponse {
  precision: number;
  recall: number;
  hit_rate: number;
  mrr: number;
}

export interface UploadResponse {
  filename: string;
  size: number;
  status: string;
}

class RAGEvaluationApi {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async evaluate(params: {
    hitRateK: number;
    recallK: number;
    precisionK: number;
  }): Promise<EvaluateResponse> {
    const response = await this.api.post("/evaluate", {
      hit_rate_k: params.hitRateK,
      recall_k: params.recallK,
      precision_k: params.precisionK,
    });
    return response.data;
  }

  async evaluateStream(
    params: { hitRateK: number; recallK: number; precisionK: number },
    onProgress: (progress: number, current: number, total: number) => void,
    onComplete: (results: EvaluateResponse) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/evaluate-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hitRateK: params.hitRateK,
        recallK: params.recallK,
        precisionK: params.precisionK,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onError("Failed to connect to stream");
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "progress") {
              onProgress(data.progress, data.current, data.total);
            } else if (data.type === "complete") {
              onComplete(data.results);
            } else if (data.type === "error") {
              onError(data.message);
            }
          } catch (e) {
            console.error("Failed to parse SSE data:", e);
          }
        }
      }
    }
  }

  async getFiles(): Promise<{ files: string[] }> {
    const response = await this.api.get("/files");
    return response.data;
  }

  async deleteFile(filename: string): Promise<void> {
    await this.api.delete(`/files/${filename}`);
  }
}

export default new RAGEvaluationApi();
