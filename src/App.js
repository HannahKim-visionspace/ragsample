import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([
    { sender: 'user', text: '넌 누구니?' },
    { sender: 'ai', text: "나는 vision-space의 RAG 선생님이다. 무엇이든 물어봐랏!" },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');

      try {
        // EC2 서버의 URL로 요청 보내기
        const response = await fetch(
          'http://ec2-15-164-241-6.ap-northeast-2.compute.amazonaws.com:5000/map_command',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: input }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ai', text: data.result },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ai', text: '오류가 발생했어요. 다시 시도해주세요.' },
          ]);
        }
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'ai', text: '서버와 연결할 수 없어요. 다시 시도해주세요.' },
        ]);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="messages" id="message-box">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user' : 'ai'}`}
            >
              <span className="sender">
                {message.sender === 'user' ? (
                  <img
                    src="./img/user.png" // 사용자 이미지 경로
                    alt=""
                    className="avatar-image"
                  />
                ) : (
                  <img
                    src="./img/robot.png" // AI 이미지 경로
                    alt=""
                    className="avatar-image"
                  />
                )}
              </span>
              <span className="text"> {message.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type to filter..."
            className="input-field"
          />
          <button onClick={handleSend} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
