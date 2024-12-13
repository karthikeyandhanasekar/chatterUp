// ChatWindow.js
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import UserDisplay from "./subComponents/UserDisplay";
import { MenuIcon, ThreeDotIcon } from "../Icons/Icons";
import MessageInput from "../components/MessageInput";
import { handleNotifications } from "../generals/generals";
import { getRoomMessagesController } from "../pages/controllers/chatPageController";
const ChatWindowContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`;

const MessagesContainer = styled.div`
  position: relative;

  flex: 1;
  overflow-y: auto;
  padding: 10px;
  max-height: calc(100vh - 130px); // Adjust for header/input bar
`;

const ScrollButton = styled.div`
  position: absolute;
  right: 0;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
  color: #ffffff;
  align-self: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};
  text-align: ${({ isSender }) => (isSender ? "right" : "left")};
`;

function ChatWindow({ room, openMenuFunction }) {
  const messageEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const getRoomMessages = async () => {
    try {
      const response = await getRoomMessagesController(room.id);
      setMessages(response.messages);
    } catch (error) {}
  };

  useEffect(() => {getRoomMessages()},[]);
  return (
    <ChatWindowContainer>
      <div className="d-flex flex-row justify-content-between text-white">
        <div className="d-flex flex-start">
          <UserDisplay name={room.name} message="message" />
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
          <button
            className="btn btn-dark d-sm-inline-block d-md-none"
            type="button"
            aria-expanded="false"
            onClick={openMenuFunction}
          >
            <MenuIcon />
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
            key={msg._id}
            isSender={msg.isSender}
            className={msg.isSender ? "justify-content-end" : "flex-start"}
          >
            {msg.message}
          </Message>
        ))}
        <div ref={messageEndRef} />
        {/* <ScrollButton>
          <DownArrow />
        </ScrollButton> */}
      </MessagesContainer>
      <MessageInput onSend={null} />
    </ChatWindowContainer>
  );
}

ChatWindow.prototype = {
  room: PropTypes.object.isRequired,
  openMenuFunction: PropTypes.any.isRequired,
};

export default ChatWindow;
