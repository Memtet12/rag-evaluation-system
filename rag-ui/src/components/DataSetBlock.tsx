import React, { useRef, useState } from "react";
import FileUploader, { FileUploaderRef } from "./common/FileUploader";
import { PrimaryButton } from "./PrimaryButton";

interface DataSetBlockProps {
  onFileSelected?: (file: File | null) => void;
}

interface SelectedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export const DataSetBlock: React.FC<DataSetBlockProps> = ({
  onFileSelected,
}) => {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const uploaderRef = useRef<FileUploaderRef>(null);

  const handleFileSelected = (file: File) => {
    console.log("Файл выбран:", file.name);
    setSelectedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    });
    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const displayFileName = (name: string) => {
    if (name.length <= 30) return name;
    return name.slice(0, 29) + "...";
  };

  const handleTriggerUpload = () => {
    uploaderRef.current?.triggerFileSelect();
  };

  const handleResetFileName = () => {
    uploaderRef.current?.resetFileName();
    setSelectedFile(null);
    if (onFileSelected) {
      onFileSelected(null as unknown as File);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
          margin: "14px",
        }}
      >
        Тестовый датасет (JSON)
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          width: "414px",
          height: "100%",
          background: "rgb(255, 250, 250)",
          borderRadius: "15px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "414px",
            height: "38px",
            background:
              "linear-gradient(to right, rgba(71, 64, 207, 1), rgba(36, 33, 105, 1))",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              color: "white",
              fontFamily: "inherit",
              letterSpacing: "0.3px",
            }}
          >
            Файл с вопросами и эталонными ответами
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "12px",
            gap: "12px",
          }}
        >
          <FileUploader
            ref={uploaderRef}
            onFileSelected={handleFileSelected}
            accept=".json"
          />

          {selectedFile && (
            <div
              style={{
                padding: "0.5rem 1rem",
                background: "#e8f5e9",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            >
              ✅ Выбран файл:{" "}
              <strong>{displayFileName(selectedFile.name)}</strong>
              <br />
              Размер: {(selectedFile.size / 1024).toFixed(2)} KB
            </div>
          )}
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
          onClick={handleTriggerUpload}
          text="Добавить"
          disabled={false}
        />
        {selectedFile && (
          <PrimaryButton
            onClick={handleResetFileName}
            text="Сбросить"
            disabled={!selectedFile}
          />
        )}
      </div>
    </div>
  );
};
