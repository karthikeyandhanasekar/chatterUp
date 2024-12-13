import Avatar from "./Avatar";
import PropTypes from "prop-types";

const UserDisplay = ({ name, message }) => {  
  return (
    <>
      <Avatar />
      <span className="mx-4">
        <h5>{name}</h5>
        <p className="text-truncate">{message}</p>
      </span>
    </>
  );
};

UserDisplay.prototype = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default UserDisplay;
