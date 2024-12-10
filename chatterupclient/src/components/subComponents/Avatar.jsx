import React from "react";
import PropTypes from "prop-types";

const Avatar = ({
  imgUrl = "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-blue-default-avatar-png-image_2813123.jpg",
  onClick,
  size = 50,
  border = true,
}) => {
  const borderClass = border ? "border" : "";

  return (
    <div
      className={`rounded-circle overflow-hidden ${borderClass} d-inline-block`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: onClick ? "pointer" : "default",
        borderColor: "#fff", // Optional border color
      }}
      onClick={onClick}
    >
      <img
        src={imgUrl}
        alt="User Avatar"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

// PropTypes to validate props
Avatar.propTypes = {
  imgUrl: PropTypes.string.isRequired, // Image URL is required
  onClick: PropTypes.func, // Optional click event
  size: PropTypes.number, // Optional size
  border: PropTypes.bool, // Whether to show border or not
};

export default Avatar;
