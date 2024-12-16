import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
// Define the context
const SocketContext = createContext();

// Provide the context
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    // Connect to the socket server
    let socketInstance;
    if (!socket?.connected) {
      socketInstance = io("http://localhost:5000"); // Replace with your server URL
      setSocket(socketInstance);
    }

    console.log("Socket connected:", socketInstance);

    return () => {
      // Clean up on component unmount
      if (socketInstance) {
        // socket.current.disconnect();
        // console.log("Socket disconnected");
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.prototype = {
  children: PropTypes.element.isRequired,
};

// Custom hook to access the socket instance
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
