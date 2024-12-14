import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { ThreeDotIcon } from "../Icons/Icons";
import { getRoomDetailsController } from "../pages/controllers/chatPageController";
import { decodeJWT } from "../generals/generals";
<<<<<<< HEAD
import SearchInput from "./subComponents/SearchInput";
import UserDisplay from "./subComponents/UserDisplay";

=======
>>>>>>> 9dcbb6e8e5bd74a96fca6e2daaf8f023468214a7
const SidebarContainer = styled.div`
  width: 100%;
  max-width: 300px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 10px;
  // background-color: #121212; /* Dark theme */
  color: white;
  max-height: 100vh;

  @media (max-width: 768px) {
    min-width: 100vw;
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

<<<<<<< HEAD
function Sidebar({ onContactSelect, isOpen }) {
  const [roomList, setRoomList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const token = sessionStorage.getItem("employeeToken");
  const fullMenu = useRef(null);

=======
function Sidebar({ onContactSelect, isOpen, toggleSidebar }) {
  const [newChatType, setNewChatType] = useState(null);
  const [roomList, setRoomList] = useState([]);
  const token = sessionStorage.getItem("employeeToken");
>>>>>>> 9dcbb6e8e5bd74a96fca6e2daaf8f023468214a7
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
      debugger;
      setRoomList(searchRoomByParticipantName(fullMenu.current, query));
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  };
<<<<<<< HEAD

  return (
    <SidebarContainer isOpen={isOpen}>
      <Header>
        <h2>{decodeJWT(token)?.name} Chats</h2>
        <button className="btn btn-dark dropdown-toggle" type="button">
          <ThreeDotIcon />
          <ul className="dropdown-menu">
            <li onClick={handleLogOut}>
=======
  return (
    <SidebarContainer isOpen={isOpen}>
      <div className="d-flex flex-row align-items-center justify-content-between  text-white ">
        <h2 className="">{decodeJWT(token)?.name} Chats</h2>
        <span className="dropdown ">
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
            <li onClick={() => handleLogOut()}>
>>>>>>> 9dcbb6e8e5bd74a96fca6e2daaf8f023468214a7
              <p className="dropdown-item">LogOut</p>
            </li>
          </ul>
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
              <UserDisplay
                name={contact.participants[0].name}
                message="Hello!"
              />
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
