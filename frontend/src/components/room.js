// Room.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Room() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    // Send a request to your Express API to create a room
    const response = await fetch("api/room/create", { method: "POST" });
    const data = await response.json();
    navigate(`/room/${data.roomId}`);
  };

  const handleJoinRoom = () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <h1>Video Chat Room</h1>

      {/* Room creation form */}
      <button onClick={handleCreateRoom}>Create Room</button>

      {/* Room joining form */}
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
}

export default Room;
