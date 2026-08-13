import React, { useState } from "react";

interface MetricSelectorProps {
  /**Название метрики */
  label: string;
  /**Значение k в метрике */
  value: number;
  /**Функция для изменения значения k */
  onChange: (value: number) => void;
  /**Показывать ли ввод k */
  showInput: boolean;
  /**Выбрана ли метрика */
  isSelected?: boolean;
  /**Функция при изменении состояния выбора */
  onSelectChange?: (selected: boolean) => void;
  min?: number;
  max?: number;
  /**Дополнительные стили */
  style?: React.CSSProperties;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  label,
  value,
  onChange,
  showInput,
  isSelected: externalIsSelected,
  onSelectChange,
  min = 1,
  max = 20,
  style = {},
}) => {
  const [internalIsSelected, setInternalIsSelected] = useState(false);

  const isSelected =
    externalIsSelected !== undefined ? externalIsSelected : internalIsSelected;

  const handleClick = () => {
    const newSelectedState = !isSelected;

    if (externalIsSelected === undefined) {
      setInternalIsSelected(newSelectedState);
    }

    if (onSelectChange) {
      onSelectChange(newSelectedState);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) {
      onChange(0);
    } else if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%", // ← на всю ширину родителя
        height: "100%", // ← на всю высоту родителя
        background: isSelected
          ? "linear-gradient(to right, rgba(71, 64, 207, 1), rgba(36, 33, 105, 1))"
          : "linear-gradient(to right, rgba(71, 64, 207, 0.8), rgba(36, 33, 105, 0.8))",
        borderRadius: "15px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        transition: "all 0.1s ease",
        cursor: "pointer",
        ...style, // ← возможность переопределить стили
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
      {showInput && (
        <div
          style={{
            width: "42px",
            height: "100%", // ← на всю высоту
            background: isSelected
              ? "linear-gradient(to right, rgba(92, 97, 233, 0.75), rgba(52, 54, 131, 0.75))"
              : "linear-gradient(to right, rgba(92, 97, 233, 0.5), rgba(52, 54, 131, 0.5))",
            borderRadius: "0px 15px 15px 0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            transition: "all 0.1s ease",
          }}
        >
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 500,
              color: "#FFFFFF",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              padding: 0,
              lineHeight: "38px",
              cursor: "pointer",
            }}
          />
        </div>
      )}
    </div>
  );
};
