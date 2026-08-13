import React from "react";

interface PrimaryButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  loading?: boolean;
  width?: string | number;
  height?: string | number;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  text,
  disabled = false,
  loading = false,
  width = "178px",
  height = "34px",
}) => {
  const buttonStyles: React.CSSProperties = {
    width,
    height,
    backgroundColor: "#182C9B",
    borderRadius: "15px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.45)",
    border: "none",
    fontSize: "14px",
    fontWeight: 400,
    color: "#FFFFFF",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.5 : 1,
    transition: "all 0.1s ease",
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.opacity = "0.9";
    }
  };

  const hadleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = disabled || loading ? "0.5" : "1";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.45)";
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = "translateY(1px)";
      e.currentTarget.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.45)";
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.45)";
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyles}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hadleMouseLeave}
    >
      {loading ? "Загрузка..." : text}
    </button>
  );
};
