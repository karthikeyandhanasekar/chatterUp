// ChatPage.js
import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const ChatPageContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
  padding: 5px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ToggleSidebarButton = styled.button`
  display: none;
  background-color: #25d366;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 50%;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 100;
  }
`;

function ChatPage() {
  const [contacts] = useState([{ name: "Alice" }, { name: "Bob" }]);
  const navigate = useNavigate();
  const { id, name } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hey Alice, how are you?",
      senderId: 1,
      timestamp: "2024-12-10T10:00:00Z",
      isSender: false,
    },
    {
      id: 2,
      content: "I'm good, thanks! How about you?",
      senderId: 2,
      timestamp: "2024-12-10T10:01:00Z",
      isSender: true,
    },
    {
      id: 3,
      content: "I'm doing well too, just working on a project.",
      senderId: 1,
      timestamp: "2024-12-10T10:05:00Z",
      isSender: false,
    },
    {
      id: 4,
      content: "That's awesome! What project are you working on?",
      senderId: 2,
      timestamp: "2024-12-10T10:10:00Z",
      isSender: true,
    },
    {
      id: 5,
      content:
        "It's a chat app like WhatsApp. You should check it out when it's done!",
      senderId: 1,
      timestamp: "2024-12-10T10:15:00Z",
      isSender: false,
    },
    {
      id: 6,
      content: "Sounds interesting! Looking forward to it.",
      senderId: 2,
      timestamp: "2024-12-10T10:20:00Z",
      isSender: true,
    },
    {
      id: 7,
      content: "I'll share it with you once it's ready!",
      senderId: 1,
      timestamp: "2024-12-10T10:25:00Z",
      isSender: false,
    },
    {
      id: 7,
      content: "I'll share it with you once it's ready!",
      senderId: 1,
      timestamp: "2024-12-10T10:25:00Z",
      isSender: false,
    },
    {
      id: 7,
      content: "I'll share it with you once it's ready!",
      senderId: 1,
      timestamp: "2024-12-10T10:25:00Z",
      isSender: false,
    },
    {
      id: 7,
      content: "I'll share it with you once it's ready!",
      senderId: 1,
      timestamp: "2024-12-10T10:25:00Z",
      isSender: false,
    },
    {
      id: 7,
      content: "I'll share it with you once it's ready!",
      senderId: 1,
      timestamp: "2024-12-10T10:25:00Z",
      isSender: false,
    },
    {
      id: 7,
      content: "I'll share it with you once it's ready!",
      senderId: 1,
      timestamp: "2024-12-10T10:25:00Z",
      isSender: false,
    },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = (content) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content, isSender: true },
    ]);
  };

  const onContactSelect = (value) => {
    navigate(`/${value._id}/${value.room}`);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <ChatPageContainer>
      <Sidebar
        contacts={contacts}
        onContactSelect={onContactSelect}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {id && (
        <>
          <ChatWindow
            id={name}
            messages={messages}
            openMenuFunction={toggleSidebar}
          />
        </>
      )}
    </ChatPageContainer>
  );
}

export default ChatPage;
