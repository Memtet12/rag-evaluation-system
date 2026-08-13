import React from "react";
import { MetricCouting } from "../MetricCounting";

export interface ResultsBlockProps {
  results: {
    // ← добавляем results в интерфейс
    precision: number;
    recall: number;
    hitRate: number;
    mrr: number;
  };
}

export const ResultsBlock: React.FC<ResultsBlockProps> = ({ results }) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(to right,rgba(92, 97, 233, 1), rgba(52, 54, 131, 1))",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        border: "rgba(0, 0, 0, 0.5)",
        width: "650px",
        height: "270px",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(217, 217, 217, 1)",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          width: "90%",
          height: " 80%",
          borderRadius: "15px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <MetricCouting
          label="Precision@k"
          count={results.precision}
        ></MetricCouting>
        <MetricCouting
          label="Hit Rate@k"
          count={results.hitRate}
        ></MetricCouting>
        <MetricCouting label="Recall@k" count={results.recall}></MetricCouting>
        <MetricCouting label="MRR" count={results.mrr}></MetricCouting>
      </div>
    </div>
  );
};
