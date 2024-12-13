import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #555;
`;

const TextContainer = styled.div`
  flex: 1;

  h5 {
    margin: 0;
    color: white;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: #aaa;
    font-size: 0.875rem;
  }
`;

const UserDisplay = ({ name, message }) => {
  return (
    <Container>
      <Avatar />
      <TextContainer>
        <h5>{name}</h5>
        <p>{message}</p>
      </TextContainer>
    </Container>
  );
};

UserDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default UserDisplay;
