import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Room from "./components/room";
import VideoChat from "./components/videoChat";
import HomePage from "./components/home";
import Chat from "./components/chat";

function App() {
  return (
    
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Room />} />
        <Route path="/room/:roomId" element={<VideoChat />} />
      </Routes>
    
  );
}

export default App;
