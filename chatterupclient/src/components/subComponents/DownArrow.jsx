import React from "react";
import { DownArrowIcon } from "../../Icons/Icons";

const DownArrow = ({ onClick, size = 40, border = true }) => {
  const borderClass = border ? "border" : "";

  return (
    <div
      className={`rounded-circle overflow-hidden ${borderClass} d-inline-block`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: onClick ? "pointer" : "default",
        borderColor: "#fff", // Optional border color
        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for hover and active states
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for modern look
        display: "flex",
        justifyContent: "center", // Horizontally centers the SVG
        alignItems: "center", // Vertically centers the SVG
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        // Scale up and add shadow on hover
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        // Revert scale and shadow on mouse leave
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
      onMouseDown={(e) => {
        // Slight scale down and shadow change on click
        e.currentTarget.style.transform = "scale(0.98)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
      }}
      onMouseUp={(e) => {
        // Revert scale and shadow after click
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
      }}
    >
      {/* Inline SVG for Down Arrow */}
      <DownArrowIcon />
    </div>
  );
};

export default DownArrow;
