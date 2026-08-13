import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  DragEvent,
  ChangeEvent,
} from "react";
import styles from "./FileUploader.module.css";

export interface FileUploaderRef {
  triggerFileSelect: () => void;
  resetFileName: () => void;
}

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ onFileSelected, accept = ".json", disabled = false }, ref) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      triggerFileSelect: () => {
        if (!disabled) fileInputRef.current?.click();
      },
      resetFileName: () => setFileName(null),
    }));

    const handleFile = (file: File) => {
      if (!file) return;
      setFileName(file.name);
      onFileSelected(file);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFile(file);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile && droppedFile.type === "application/json") {
        handleFile(droppedFile);
      } else {
        alert("Пожалуйста, загрузите JSON файл.");
      }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    };

    const displayFileName = (name: string) => {
      if (name.length <= 30) return name;
      return name.slice(0, 29) + "...";
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    return (
      <div
        className={`${styles.uploaderArea} ${isDragging ? styles.dragging : ""} ${
          disabled ? styles.disabled : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className={styles.hiddenInput}
          disabled={disabled}
        />
        <div className={styles.content}>
          {fileName ? (
            <p className={styles.fileName}>📄 {displayFileName(fileName)}</p>
          ) : (
            <>
              <p className={styles.icon} style={{ marginBottom: "4px" }}>
                📁
              </p>
              <p style={{ margin: "4px 0" }}>Перетащите JSON файл сюда</p>
              <p className={styles.hint} style={{ marginTop: "4px" }}>
                или нажмите для выбора
              </p>
            </>
          )}
        </div>
      </div>
    );
  },
);

FileUploader.displayName = "FileUploader";
export default FileUploader;
