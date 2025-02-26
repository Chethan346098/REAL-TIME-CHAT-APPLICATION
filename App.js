import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true); // Add loading state

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnecting(false); // Connection established
    };

    newSocket.onmessage = (event) => {
      const message = event.data.toString();
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnecting(true); // Connection lost
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnecting(true); // Connection error
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div className="App">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} disabled={!input.trim() || isConnecting}>
        Send
      </button>
      {isConnecting && <p>Connecting to server...</p>} {/* Show loading state */}
    </div>
  );
}

export default App;