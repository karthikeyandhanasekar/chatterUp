import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const ChatPage = React.lazy(() => import("../pages/ChatPage"));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" exact element={<ChatPage />} />
        <Route path="/:id" element={<ChatPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
