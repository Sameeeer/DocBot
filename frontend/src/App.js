import React from "react";
import { Routes, Route } from "react-router-dom";
import Upload from "./components/upload";
import Chatbox from "./components/chatbox";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/chat" element={<Chatbox />} />
  </Routes>
  );
};

export default App;
