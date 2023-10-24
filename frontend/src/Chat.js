import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/chat/messages?room=${room}`);
        if (response.ok) {
          const messages = await response.json();
          setMessageList(messages);
        } else {
          window.alert('Failed to fetch messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        window.alert('Failed to fetch messages');
      }
    }
  
    fetchMessages();
  }, [room]);
  

  const sendMessage = async () => {
    const min = new Date(Date.now()).getMinutes();
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + min,
      };
  
      try {
        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });
  
        if (response.ok) {
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage('');
        } else {
          window.alert('Failed to save message');
        }
      } catch (err) {
        console.error('Error sending message:', err);
        window.alert('Failed to save message');
      }
    }
  };
  

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
