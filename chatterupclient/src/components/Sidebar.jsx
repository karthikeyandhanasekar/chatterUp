import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { LogOutIcon, ThreeDotIcon } from "../Icons/Icons";
import { getRoomDetailsController } from "../pages/controllers/chatPageController";
import { decodeJWT, getContactName } from "../generals/generals";
import SearchInput from "./subComponents/SearchInput";
import UserDisplay from "./subComponents/UserDisplay";

const SidebarContainer = styled.div`
  width: 100%;
  max-width: 300px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: white;
  height: 100vh;
  background-color: #1e1e2f;
  @media (max-width: 768px) {
    width: 100vw;
    position: absolute;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease-in-out;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }
`;

const Contact = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  background-color: ${({ isActive }) => (isActive ? "#333" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#fff" : "#aaa")};

  &:hover {
    background-color: #444;
    color: white;
  }
`;

function Sidebar({ onContactSelect, isOpen }) {
  const [roomList, setRoomList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const token = sessionStorage.getItem("employeeToken");
  const fullMenu = useRef(null);

  const getRoomDetails = async () => {
    try {
      const response = await getRoomDetailsController();
      fullMenu.current = response?.rooms || [];
      setRoomList(response?.rooms || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  const handleChatSelect = (contact) => {
    setSelectedChat(contact._id);
    onContactSelect(contact);
  };

  // Function to search rooms by participant name
  const searchRoomByParticipantName = (rooms, participantName) => {
    return rooms.filter((room) =>
      room.participants.some((participant) =>
        participant.name.toLowerCase().includes(participantName.toLowerCase())
      )
    );
  };

  const handleSearchQuery = (query) => {
    if (!query) {
      setRoomList(fullMenu.current);
    } else {
      setRoomList(searchRoomByParticipantName(fullMenu.current, query));
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <Header>
        <h2>{decodeJWT(token)?.name} Chats</h2>
        <button
          className="btn btn-dark dropdown-toggle"
          onClick={handleLogOut}
          type="button"
        >
          <LogOutIcon />
        </button>
      </Header>

      <SearchInput onSend={handleSearchQuery} />

      <ChatList>
        {roomList.length === 0 ? (
          <p>No chats available</p>
        ) : (
          roomList.map((contact) => (
            <Contact
              key={contact._id}
              isActive={selectedChat === contact._id}
              onClick={() => handleChatSelect(contact)}
            >
              <UserDisplay name={getContactName(contact)} message="" />
            </Contact>
          ))
        )}
      </ChatList>
    </SidebarContainer>
  );
}

Sidebar.propTypes = {
  onContactSelect: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
