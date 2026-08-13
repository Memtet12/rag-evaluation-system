import React from "react";

interface ProgressBarProps {
  /** Прогресс в процентах (0-100) */
  value: number;
  /** Высота прогресс-бара (по умолчанию 20px) */
  height?: number;
  /** Анимировать ли изменения */
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 20,
  animated = true,
}) => {
  const clampedValue = Math.min(99.5, Math.max(0, value));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <span
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "500",
          color: "rgb(0,0,0,1)",
          fontFamily: "inherit",
          letterSpacing: "0.3px",
          paddingBottom: "5px",
        }}
      >
        Загрузка
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "95%",
            height: `${height}px`,
            background: "transparent",
            border: `4px solid rgba(154, 154, 154, 1)`,
            borderRadius: "30px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            paddingLeft: "0.5%",
          }}
        >
          <div
            style={{
              width: `${clampedValue}%`,
              height: "80%",
              background:
                "linear-gradient(to right, rgba(71, 64, 207, 1), rgba(36, 33, 105, 1))",
              borderRadius: "30px",
              transition: animated ? "width 0.3s ease-out" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
