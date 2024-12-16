import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useSocket } from "../apiServices/socket";

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  align-items: center;
  background-color: #1e1e1e;
  border-top: 1px solid #333;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
  background-color: #2c2c2c;
  color: white;

  &:focus {
    border: 1px solid #25d366;
  }

  &::placeholder {
    color: #888;
  }

  @media (max-width: 768px) {
    padding: 10px;
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
  transition: background-color 0.3s;

  &:hover {
    background-color: #20b957;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const TypingIndicator = styled.div`
  font-size: 14px;
  color: #888;
  padding: 8px 16px;
  font-style: italic;
  text-align: left;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const MessageInput = ({ onSend, roomId }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    socket.on("isTyping", (data) => {
      setIsTyping(data.isTyping);
    });
  }, [socket]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
      setIsTyping(false); // Stop typing animation after sending the message
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);
  };

  const onInputKeyUp = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      return handleSend();
    }
    if (!isTyping) {
      socket.emit("typing", { roomId, isTyping: true });
      setIsTyping(true); // Show typing indicator
    } else {
      // Reset typing timeout every time the user types
      // clearTimeout(typingTimeoutRef.current);
      debugger;
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { roomId, isTyping: false });
        // Hide typing indicator after 2 seconds of inactivity
      }, 1000);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      {isTyping && <TypingIndicator>Typing...</TypingIndicator>}
      <InputContainer>
        <Input
          type="text"
          ref={inputRef}
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          onKeyUp={onInputKeyUp}
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </InputContainer>
    </>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
};

export default MessageInput;
