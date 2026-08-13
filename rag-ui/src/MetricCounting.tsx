import React from "react";
import { Metric } from "./components/Metric";

export interface MetricCoutingProps {
  label: string;
  count: number;
}

export const MetricCouting: React.FC<MetricCoutingProps> = ({
  label,
  count = 0,
}) => {
  return (
    <div>
      <div style={{ marginBottom: "6px" }}>
        <Metric label={label}></Metric>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "194px",
          height: "38px",
          border: "1px solid rgba(169, 169, 169, 0.5)",
          background: "rgb(255, 255, 255)",
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
            color: "#000000",
            fontFamily: "inherit",
            letterSpacing: "0.3px",
          }}
        >
          {count}
        </span>
      </div>
    </div>
  );
};
