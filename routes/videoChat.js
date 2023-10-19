import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io from "socket.io-client";

const serverURL = "http://localhost:5000"; // Update with your signaling server URL

const VideoChat = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = () => {
      const newSocket = io(serverURL);

      newSocket.on("connect", () => {
        console.log("Connected to signaling server");
      });

      setSocket(newSocket);
    };

    const startVideoChat = async () => {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = userMedia;
        setStream(userMedia);

        const peer = new Peer(undefined, {
          host: "localhost", // Update with your PeerJS server host
          port: 9000, // Update with your PeerJS server port
          path: "/myapp", // Update with your PeerJS server path
        });

        peerRef.current = peer;

        userMedia.getTracks().forEach((track) => {
          peer.addTrack(track, userMedia);
        });

        peer.on("open", () => {
          // Signal to the server that this peer is ready
          socket.emit("join-room", roomId, peer.id);
        });

        peer.on("call", (call) => {
          call.answer(userMedia);

          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
          });
        });
      } catch (error) {
        console.error("Error accessing camera and microphone:", error);
      }
    };

    initializeSocket();
    startVideoChat();

    // Cleanup when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (socket) {
        socket.close();
      }
    };
  }, [roomId, socket]);

  return (
    <div>
      <h1>Video Chat Room: {roomId}</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }}></video>
        <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }}></video>
      </div>
    </div>
  );
};

export default VideoChat;
