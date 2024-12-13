import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { validSessionController } from "../pages/controllers/chatPageController";

const ChatPage = React.lazy(() => import("../pages/ChatPage"));
const LoginPage = React.lazy(() => import("../pages/Login"));

const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const checkSession = async () => {
      try {
        // const response = await validSessionController();
        const token = sessionStorage.getItem("employeeToken");
        if (token) {
          if (location.pathname === "/login") {
            navigate(-1);
          }
          navigate(location.pathname || "/");
        } else {
          navigate("/login"); // Navigate to login if session is invalid
        }
      } catch (error) {
        console.error("Error validating session:", error.errorMessage);
        navigate("/login"); // Navigate to login on error
      }
    };

    checkSession();
  }, [navigate]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" exact element={<LoginPage />} />

        <Route path="/" exact element={<ChatPage />} />
        <Route path="/:id/:name" element={<ChatPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
