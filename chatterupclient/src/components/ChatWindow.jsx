// ChatWindow.js
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import UserDisplay from "./subComponents/UserDisplay";
import { ThreeDotIcon } from "../Icons/Icons";
import MessageInput from "../components/MessageInput";
const ChatWindowContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  background: #2a2f32;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #fafafa;
  max-height: calc(100vh - 130px); // Adjust for header/input bar
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${({ isSender }) => (isSender ? "#DCF8C6" : "#FFFFFF")};
  align-self: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
  text-align: ${({ isSender }) => (isSender ? "right" : "left")};
`;

function ChatWindow({ messages }) {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatWindowContainer>
      <div className="d-flex flex-row justify-content-between text-white">
        <div className="d-flex flex-start">
          <UserDisplay name={"name"} message="message" />
        </div>
        <span className="dropdown">
          <button
            className="btn btn-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <ThreeDotIcon />
          </button>
          <ul
            className="dropdown-menu dropdown-menu-dark"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <a className="dropdown-item" href="#">
                New group
              </a>
            </li>
          </ul>
        </span>
      </div>

      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message
            key={index}
            isSender={msg.isSender}
            className={msg.isSender ? "justify-content-end" : "flex-start"}
          >
            {msg.content}
          </Message>
        ))}
        <div ref={messageEndRef} />
      </MessagesContainer>
      <MessageInput onSend={null} />
    </ChatWindowContainer>
  );
}

ChatWindow.prototype = {
  messages: PropTypes.any.isRequired,
};

export default ChatWindow;
