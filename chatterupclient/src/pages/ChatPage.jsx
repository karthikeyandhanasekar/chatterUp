// ChatPage.js
import React, { useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useNavigate, useParams } from "react-router-dom";
import useResponsive from "../customHooks/usResponsive";
import { getContactName } from "../generals/generals";
const ChatPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  flex-direction: row;
  padding: 5px;
  display: ${({ isSidebarOpen }) => (isSidebarOpen ? "none" : "flex")};

  @media (max-width: 768px) {
    display: flex;
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
  const { id, name, participantCount } = useParams();
  const isMobile = useResponsive();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const onContactSelect = (value) => {
    if (isMobile) {
      toggleSidebar();
    }

    navigate(
      `/${value._id}/${getContactName(value)}/${value.participantCount}`
    );
  };

  return (
    <ChatPageContainer>
      <Sidebar
        contacts={contacts}
        onContactSelect={onContactSelect}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      {id && (
        <ChatWindow
          isSidebarOpen={isSidebarOpen}
          room={{ id, name, participantCount }}
          openMenuFunction={toggleSidebar}
        />
      )}
    </ChatPageContainer>
  );
}

export default ChatPage;
