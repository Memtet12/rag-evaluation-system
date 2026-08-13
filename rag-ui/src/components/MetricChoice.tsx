// src/components/MetricChoice.tsx
import React, { useState } from "react";
import { PrimaryButton } from "./PrimaryButton";
import { MetricSelector } from "./MetricSelector";
import RAGEvaluationApi from "./services/api";

export interface MetricChoiceProps {
  onAnalysisComplete?: (results: {
    precision: number;
    recall: number;
    hitRate: number;
    mrr: number;
  }) => void;
  onAnalysisProgress?: (
    progress: number,
    current: number,
    total: number,
  ) => void;
  selectedFile?: File | null;
}

export const MetricChoice: React.FC<MetricChoiceProps> = ({
  onAnalysisComplete,
  onAnalysisProgress,
  selectedFile,
}) => {
  const [hitRateK, setHitRateK] = useState(5);
  const [recallK, setRecallK] = useState(5);
  const [precisionK, setPrecisionK] = useState(5);

  const [isHitRateSelected, setIsHitRateSelected] = useState(true);
  const [isRecallSelected, setIsRecallSelected] = useState(true);
  const [isPrecisionSelected, setIsPrecisionSelected] = useState(true);
  const [isMrrSelected, setIsMrrSelected] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleRunAnalysis = async () => {
    if (!selectedFile) {
      alert("Сначала выберите JSON файл с датасетом");
      return;
    }

    setIsLoading(true);

    try {
      await RAGEvaluationApi.uploadFile(selectedFile);

      await RAGEvaluationApi.evaluateStream(
        {
          hitRateK: isHitRateSelected ? hitRateK : 0,
          recallK: isRecallSelected ? recallK : 0,
          precisionK: isPrecisionSelected ? precisionK : 0,
        },
        (progress, current, total) => {
          if (onAnalysisProgress) {
            onAnalysisProgress(progress, current, total);
          }
        },
        (results) => {
          if (onAnalysisComplete) {
            onAnalysisComplete({
              precision: isPrecisionSelected ? results.precision : 0,
              recall: isRecallSelected ? results.recall : 0,
              hitRate: isHitRateSelected ? results.hit_rate : 0,
              mrr: isMrrSelected ? results.mrr : 0,
            });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("SSE Error:", error);
          alert("Ошибка при оценке: " + error);
          setIsLoading(false);
        },
      );
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка при оценке. Проверьте, запущен ли бэкенд.");
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        width: "445px",
        height: "350px",
        background: "rgb(217, 217, 217)",
        borderRadius: "15px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        paddingBottom: "0px",
      }}
    >
      <span
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: 500,
          color: "#000000",
          fontFamily: "inherit",
          letterSpacing: "0%",
          margin: "10px",
        }}
      >
        Метрики
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "414px",
          height: "100%",
          background: "rgb(255, 250, 250)",
          borderRadius: "15px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        <div style={{ margin: "20px" }}>
          <div style={{ margin: "10px" }}>
            <MetricSelector
              label="Hit Rate@k"
              value={hitRateK}
              onChange={setHitRateK}
              showInput={true}
              isSelected={isHitRateSelected}
              onSelectChange={setIsHitRateSelected}
              style={{ width: "250px", height: "45px" }}
            />
          </div>

          <div style={{ margin: "10px" }}>
            <MetricSelector
              label="Recall@k"
              value={recallK}
              onChange={setRecallK}
              showInput={true}
              isSelected={isRecallSelected}
              onSelectChange={setIsRecallSelected}
              style={{ width: "250px", height: "45px" }}
            />
          </div>
          <div style={{ margin: "10px" }}>
            <MetricSelector
              label="Precision@k"
              value={precisionK}
              onChange={setPrecisionK}
              showInput={true}
              isSelected={isPrecisionSelected}
              onSelectChange={setIsPrecisionSelected}
              style={{ width: "250px", height: "45px" }}
            />
          </div>
          <div style={{ margin: "10px" }}>
            <MetricSelector
              label="MRR"
              value={0}
              onChange={() => {}}
              showInput={false}
              isSelected={isMrrSelected}
              onSelectChange={setIsMrrSelected}
              style={{ width: "250px", height: "45px" }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "10px",
        }}
      >
        <PrimaryButton
          onClick={handleRunAnalysis}
          text="Запустить оценку"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
