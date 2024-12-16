import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { ThreeDotIcon, MenuIcon } from "../Icons/Icons";
import UserDisplay from "./subComponents/UserDisplay";
import MessageInput from "./MessageInput";
import MessagesContainerComponent from "./subComponents/MessageContainer";
import {
  createMessageController,
  getRoomMessagesController,
} from "../pages/controllers/chatPageController";
import { useSocket } from "../apiServices/socket";
import { decodeJWT, handleNotifications } from "../generals/generals";
const ChatWindowContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: white;
  padding: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  h5 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
const ChatWindow = ({ room, openMenuFunction }) => {
  const messageEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const token = sessionStorage.getItem("employeeToken");
  const currentUserId = decodeJWT(token)?._id;
  useEffect(() => {
    socket.emit("joinRoom", {
      roomId: room.id,
      userId: decodeJWT(token).name,
    });
    socket.on("roomJoined", (message) => {
      // alert(message);
    });
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const getRoomMessages = async () => {
    try {
      const response = await getRoomMessagesController(room.id);
      setMessages(response.messages);
    } catch (error) {}
  };

  useEffect(() => {
    const handleMessage = (newMessage) => {
      const { message } = newMessage;
      // handleNotifications({
      //   title: message.userId.name,
      //   body: message.message,
      // });
      setMessages((prev) => [...prev, message]);
    };
    socket.on("newMessageSuccess", handleMessage);

    socket.on("newMessageError", (error) => {
      alert(error.errorMessage);
    });
  }, [socket]);

  const onSendMessage = async (message) => {
    try {
      socket.emit("newMessage", {
        roomId: room.id,
        message: message,
        userId: currentUserId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoomMessages();
  }, [room.id]);

  return (
    <ChatWindowContainer>
      {/* Header */}
      <Header>
        <div>
          <UserDisplay name={room.name} message="Active now" />
        </div>
        <div>
          {/* <button
            className="btn btn-dark dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <ThreeDotIcon />
          </button> */}
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
        </div>
      </Header>

      <MessagesContainerComponent messages={messages} />
      {/* Message Input */}
      <MessageInput roomId={room.id} onSend={onSendMessage} />
    </ChatWindowContainer>
  );
};

ChatWindow.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onSendMessage: PropTypes.func.isRequired,
};

export default ChatWindow;
