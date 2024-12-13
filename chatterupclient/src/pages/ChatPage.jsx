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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onContactSelect = (value) => {
    navigate(`/${value._id}/${value.participants[0].name}`);
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
          <ChatWindow room={{ id, name }} openMenuFunction={toggleSidebar} />
        </>
      )}
    </ChatPageContainer>
  );
}

export default ChatPage;
