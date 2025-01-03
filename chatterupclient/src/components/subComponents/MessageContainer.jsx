import { useEffect, useRef } from "react";
import styled from "styled-components";
import { decodeJWT } from "../../generals/generals";

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isSender }) => (isSender ? "flex-start" : "flex-end")};
  margin-bottom: 10px;
  padding: 0 10px; /* Prevent text from touching the screen edges */
`;

const UserName = styled.span`
  font-size: 0.8rem;
  color: #ccc; /* Subtle color for sender/receiver name */
  margin-bottom: 4px;
  text-align: ${({ isSender }) => (isSender ? "left" : "right")};
  width: 100%; /* Ensure the name aligns with the bubble */
`;

const MessageBubble = styled.div`
  background-color: ${({ isSender }) => (isSender ? "#333" : "#007bff")};
  color: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-align: ${({ isSender }) => (isSender ? "left" : "right")};
  max-width: 90%; /* Adjust bubble width to fit the container */
  word-wrap: break-word;
  overflow-wrap: break-word; /* Handle large or unbreakable text */
  white-space: pre-wrap; /* Maintain spacing and line breaks */

  &:hover {
    background-color: ${({ isSender }) => (isSender ? "#444" : "#0056b3")};
  }

  @media (max-width: 768px) {
    max-width: 85%; /* Slightly narrower for smaller devices */
    font-size: 0.9rem; /* Adjust text size for readability */
  }

  @media (max-width: 480px) {
    max-width: 80%; /* Even narrower for small mobile devices */
  }
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 4px;
  text-align: ${({ isSender }) => (isSender ? "left" : "right")};
  width: 100%; /* Align timestamp with the bubble */
  @media (max-width: 768px) {
    font-size: 0.7rem; /* Adjust timestamp font size for mobile */
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    padding: 8px; /* Reduce padding for small screens */
  }
`;
const Banner = styled.div`
  display: inline-block; /* Adjust width to match text length */
  text-align: center;
  padding: 10px 15px; /* Padding around the text */
  margin: 10px auto; /* Center horizontally */
  background: #ffeb3b; /* Yellow background */
  color: #000; /* Text color */
  font-size: 14px;
  font-weight: bold;
  border-radius: 20px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer; /* Add pointer cursor */
  transition: background-color 0.3s ease, transform 0.2s ease;

  /* Hover effect for interactivity */
  &:hover {
    background: #fbc02d; /* Darker yellow on hover */
    transform: scale(1.05); /* Slight zoom effect */
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px; /* Reduce padding for smaller devices */
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 6px 10px; /* Further reduce padding */
  }
`;

// Main Component
const MessagesContainerComponent = ({ messages }) => {
  const messageEndRef = useRef(null);
  const token = sessionStorage.getItem("employeeToken");
  const currentUserId = decodeJWT(token)?._id;

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isSender = (userId) => userId === currentUserId;
  return (
    messages.length !== 0 && (
      <MessagesContainer>
        {messages.map((msg) =>
          msg.messageType === "banner" ? (
            <>
              <Banner>{msg.message}</Banner>
              <br />
            </>
          ) : (
            <MessageWrapper key={msg._id} isSender={isSender(msg.userId._id)}>
              <UserName isSender={isSender(msg.userId._id)}>
                {isSender(msg.userId._id) ? "You" : msg.userId.name}
              </UserName>
              <MessageBubble isSender={isSender(msg.userId._id)}>
                {msg.message}
              </MessageBubble>
              <Timestamp isSender={isSender(msg.userId._id)}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Timestamp>
            </MessageWrapper>
          )
        )}
        <div ref={messageEndRef} />
      </MessagesContainer>
    )
  );
};

export default MessagesContainerComponent;
