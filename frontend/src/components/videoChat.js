import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const serverURL = "http://localhost:5000"; // Update with your signaling server URL

const VideoChat = ({ roomId, userName }) => {
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const socket = useRef(null);
  const peerConnections = useRef({});
  const [isConnected, setIsConnected] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [ringingPeer, setRingingPeer] = useState(null);
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    socket.current = io(serverURL);

    const startVideoChat = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localVideoRef.current.srcObject = stream;
        peerConnections.current = createPeerConnections(stream);

        socket.current.emit("join-room", { roomId, userName });

        setIsConnected(true);
      } catch (error) {
        console.error("Error accessing camera and microphone:", error);
      }
    };

    startVideoChat();

    socket.current.on("user-joined", (user) => {
      console.log(`${user.userName} joined the room.`);
      createPeerConnection(user.id);
    });

    socket.current.on("user-left", (user) => {
      console.log(`${user.userName} left the room.`);
      removePeerConnection(user.id);
    });

    socket.current.on("call-request", ({ fromUserId, offer }) => {
      console.log(`${fromUserId} is calling you.`);
      setRingingPeer(fromUserId);
      setOffer(offer); // Set the offer received from the calling user
    });

    socket.current.on("call-answered", ({ fromUserId, answer }) => {
      console.log(`${fromUserId} answered your call.`);
      if (peerConnections.current[fromUserId]) {
        peerConnections.current[fromUserId]
          .setRemoteDescription(answer)
          .then(() => {
            // Handle call answered, you can update UI or take further actions
          })
          .catch((error) => console.error("Error answering call:", error));
      }
    });

    return () => {
      socket.current.emit("leave-room", { roomId, userName });
      socket.current.disconnect();

      for (const peerId in peerConnections.current) {
        if (peerConnections.current.hasOwnProperty(peerId)) {
          peerConnections.current[peerId].close();
        }
      }
    };
  }, [roomId, userName]);

  const createPeerConnections = (stream) => {
    const connections = {};
    connections[socket.current.id] = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    stream.getTracks().forEach((track) => {
      connections[socket.current.id].addTrack(track, stream);
    });

    connections[socket.current.id].ontrack = (event) => {
      remoteVideosRef.current[socket.current.id] = createRemoteVideoElement(event.streams[0]);
    };

    return connections;
  };

  const createPeerConnection = (peerId) => {
    peerConnections.current[peerId] = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    const stream = localVideoRef.current.srcObject;
    stream.getTracks().forEach((track) => {
      peerConnections.current[peerId].addTrack(track, stream);
    });

    peerConnections.current[peerId].ontrack = (event) => {
      remoteVideosRef.current[peerId] = createRemoteVideoElement(event.streams[0]);
    };
  };

  const removePeerConnection = (peerId) => {
    if (remoteVideosRef.current[peerId]) {
      remoteVideosRef.current[peerId].remove();
      delete remoteVideosRef.current[peerId];
      peerConnections.current[peerId].close();
      delete peerConnections.current[peerId];
    }
  };

  const createRemoteVideoElement = (stream) => {
    const remoteVideo = document.createElement("video");
    remoteVideo.srcObject = stream;
    remoteVideo.autoPlay = true;
    remoteVideo.style.width = "300px";
    remoteVideo.style.margin = "5px";
    document.getElementById("remote-videos").appendChild(remoteVideo);
    return remoteVideo;
  };

  const initiateCall = (targetUserId) => {
    if (peerConnections.current[targetUserId]) {
      const localStream = localVideoRef.current.srcObject;
      localStream.getTracks().forEach((track) => {
        peerConnections.current[targetUserId].addTrack(track, localStream);
      });
  
      peerConnections.current[targetUserId]
        .createOffer()
        .then((offer) => {
          return peerConnections.current[targetUserId].setLocalDescription(offer);
        })
        .then(() => {
          socket.current.emit("call-request", {
            targetUserId,
            offer: peerConnections.current[targetUserId].localDescription,
          });
        })
        .catch((error) => console.error("Error initiating call:", error));
    }
  };
  
  

const answerCall = (fromUserId, offer) => {
  if (peerConnections.current[fromUserId]) {
    const localStream = localVideoRef.current.srcObject;
    localStream.getTracks().forEach((track) => {
      peerConnections.current[fromUserId].addTrack(track, localStream);
    });

    peerConnections.current[fromUserId]
      .setRemoteDescription(offer)
      .then(() => {
        return peerConnections.current[fromUserId].createAnswer();
      })
      .then((answer) => {
        return peerConnections.current[fromUserId].setLocalDescription(answer);
      })
      .then(() => {
        socket.current.emit("call-answered", {
          targetUserId: fromUserId,
          answer: peerConnections.current[fromUserId].localDescription,
        });
      })
      .catch((error) => console.error("Error answering call:", error));
  }
};





  

  const leaveRoom = () => {
    socket.current.emit("leave-room", { roomId, userName });
    window.location.reload(); // For simplicity, just reload the page to exit the room
  };

  const callUser = (targetUserId) => {
    if (peerConnections.current[targetUserId]) {
      initiateCall(targetUserId);
    } else {
      socket.current.emit("call-request", { targetUserId });
    }
  };

  const answerIncomingCall = () => {
    if (ringingPeer) {
      answerCall(ringingPeer);
      setRingingPeer(null);
    }
  };

  return (
    <div>
      <h1>Video Chat Room: {roomId}</h1>
      <div>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          style={{ width: "300px", display: isConnected ? "block" : "none" }}
        ></video>
        <div id="remote-videos"></div>
      </div>
      {ringingPeer && (
        <div>
          <p>{ringingPeer} is calling you...</p>
          <button onClick={answerIncomingCall}>Answer</button>
        </div>
      )}
      <button onClick={leaveRoom}>Leave Room</button>
      {!isCalling ? (
        <button onClick={() => callUser("targetUserId")}>Call</button>
      ) : (
        <p>Calling...</p>
      )}
    </div>
  );
};

export default VideoChat;
