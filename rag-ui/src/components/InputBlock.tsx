// src/components/InputBlock.tsx
import React from "react";
import { DataSetBlock } from "./DataSetBlock";
import { MetricChoice } from "./MetricChoice";

interface InputBlockProps {
  onFileSelected?: (file: File | null) => void;
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

export const InputBlock: React.FC<InputBlockProps> = ({
  onFileSelected,
  onAnalysisComplete,
  onAnalysisProgress,
  selectedFile,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        width: "100%",
        background:
          "linear-gradient(to right, rgba(92, 97, 233, 1), rgba(52, 54, 131, 1))",
        borderRadius: "15px",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <DataSetBlock onFileSelected={onFileSelected} />
      <MetricChoice
        onAnalysisComplete={onAnalysisComplete}
        onAnalysisProgress={onAnalysisProgress}
        selectedFile={selectedFile}
      />
    </div>
  );
};
