import React from "react";

interface MetricProps {
  label: string;
}

export const Metric: React.FC<MetricProps> = ({ label }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "194px",
        height: "38px",
        background:
          "linear-gradient(to right, rgba(71, 64, 207, 1), rgba(36, 33, 105, 1))",
        borderRadius: "5px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <span
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 500,
          color: "#FFFFFF",
          fontFamily: "inherit",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </span>
    </div>
  );
};
