// src/App.tsx
import React, { useState } from "react";
import { InputBlock } from "./components/InputBlock";
import { ResultsBlock } from "./components/ResultsBlock";
import { ProgressBar } from "./components/ProgressBar";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<{
    precision: number;
    recall: number;
    hitRate: number;
    mrr: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleAnalysisProgress = (
    newProgress: number,
    current: number,
    total: number,
  ) => {
    setProgress(newProgress);
    setCurrentQuestion(current);
    setTotalQuestions(total);
    if (newProgress > 0 && newProgress < 100) {
      setIsLoading(true);
    }
    if (newProgress === 100) {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = (newResults: {
    precision: number;
    recall: number;
    hitRate: number;
    mrr: number;
  }) => {
    setResults(newResults);
    setIsLoading(false);
    setProgress(100);
  };

  return (
    <div
      style={{
        padding: "2rem",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(to right, rgba(71, 64, 207, 1), rgba(36, 33, 105, 1))",
      }}
    >
      <div
        style={{
          background: "rgba(217, 217, 217, 1)",
          borderRadius: "15px",
          padding: "20px",
          paddingLeft: "150px",
          paddingRight: "150px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <InputBlock
          onFileSelected={handleFileSelected}
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisProgress={handleAnalysisProgress}
          selectedFile={selectedFile}
        />

        {(isLoading || progress > 0) && (
          <div style={{ width: "100%" }}>
            <ProgressBar value={progress} height={35} />
            {isLoading && totalQuestions > 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                Обработано вопросов: {currentQuestion} из {totalQuestions}
              </div>
            )}
          </div>
        )}

        {results && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ResultsBlock results={results} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
