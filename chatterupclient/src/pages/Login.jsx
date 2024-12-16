import React, { useState, useEffect, useRef } from "react";
import { createUser } from "./controllers/chatPageController";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../apiServices/socket";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const socket = useSocket();
  // Focus on the input field when the page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Validate input
      if (!username.trim()) {
        setError("Username is required to enter the chat.");
        return;
      }

      const response = await createUser(username);

      if (response.success) {
        setError("");
        if (response.isNewlyJoined) {
          debugger;
          const data = {
            roomIds: response.roomIds,
            message: `${response.userName} joins this chat `,
            userId: response.userId,
          };
          socket.emit("welcomeRoom", data);
          debugger;
        }
        sessionStorage.setItem("employeeToken", response.token);
        setTimeout(() => {
          navigate("/");
        }, 100);
      }

      // Proceed to chat
    } catch (error) {
      console.error(error);
      setError(error?.errorMessage || "Internal Sever Error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg"
        style={{
          width: "400px",
          backgroundColor: "#292b3a",
          border: "none",
        }}
      >
        <div className="card-body">
          <h3 className="text-center mb-4" style={{ color: "#ffffff" }}>
            Enter Chat
          </h3>
          <p className="text-center mb-4" style={{ color: "#bbbbbb" }}>
            Please provide your username to join the chat.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="form-group mb-3">
              <label
                htmlFor="username"
                className="form-label"
                style={{ color: "#ffffff" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={inputRef}
                style={{
                  backgroundColor: "#1e1e2f",
                  border: "1px solid #444",
                  color: "#ffffff",
                }}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#007bff",
                color: "#ffffff",
                border: "none",
                padding: "10px",
              }}
            >
              Enter Chat
            </button>
          </form>
        </div>
        <div
          className="card-footer text-center mt-3"
          style={{ backgroundColor: "#292b3a", border: "none" }}
        >
          <p className="text-muted mb-0" style={{ color: "#bbbbbb" }}>
            Ready to chat? Provide a username and dive in!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
