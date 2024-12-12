// Sidebar.js
import React, { useState } from "react";
import styled from "styled-components";
import UserDisplay from "./subComponents/UserDisplay";
import PropTypes from "prop-types";
import { ThreeDotIcon } from "../Icons/Icons";
import MessageInput from "./MessageInput";
import SearchInput from "./subComponents/SearchInput";

const SidebarContainer = styled.div`
  width: 100%;
  max-width: 30vw;
  border-right: 1px solid #ddd;
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  padding: 10px;
  transition: transform 0.3s ease-in-out;
  max-height: 100vh;
  @media (max-width: 768px) {
    min-width: 100vw;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

const Contact = styled.div`
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: left;
  color: #ffffff;
  display: flex;
  justify-content: flex-start;
  &:hover {
    background-color: #e9e9e9;
    color: #000000;
  }
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

function Sidebar({ contacts, onContactSelect, isOpen, toggleSidebar }) {
  const [newChatType, setNewChatType] = useState(null);
  return (
    <SidebarContainer isOpen={isOpen}>
      <div className="d-flex flex-row align-items-center justify-content-between  text-white ">
        <h2 className="">Chats</h2>
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
            <li onClick={() => setNewChatType("user")}>
              <p className="dropdown-item">New user</p>
            </li>
            <li onClick={() => setNewChatType("group")}>
              <p className="dropdown-item">New group</p>
            </li>
          </ul>
        </span>
      </div>
      <div className="">
        <SearchInput />
      </div>

      <div style={{ "overflow-y": "auto" }} className="flex-1">
        {contacts.map((contact, index) => (
          <Contact
            className="py-3 border-bottom "
            key={index}
            onClick={() => onContactSelect(contact)}
          >
            <UserDisplay name={contact.name} message="message" />
          </Contact>
        ))}
      </div>
    </SidebarContainer>
  );
}

Sidebar.propTypes = {
  contacts: PropTypes.string.isRequired,
  onContactSelect: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
