// SearchInput.js
import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 16px;
  background:transparent ;
  color:#fffff;
   &:focus {
    border-color: #25d366;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const SendButton = styled.button`
  background-color: #25d366;
  border: none;
  color: white;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #20b957;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;
const SearchInput = forwardRef(({ placeholder, onSend }, ref) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <InputContainer>
      <Input
        type="text"
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
      />
      <SendButton onClick={handleSend}>Create</SendButton>
    </InputContainer>
  );
});

SearchInput.prototype = {
  onSend: PropTypes.func.isRequired,
};

export default SearchInput;
