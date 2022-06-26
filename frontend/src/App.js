import React, { useEffect } from 'react';
import { useState } from 'react';
import uuid from 'react-uuid'

import './App.css';
import Modal from './components/Modal';
import socketClient from 'socket.io-client';

const SERVER = 'http://192.168.0.115:8080';

const App = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);

  const assignUsername = (username) => {
    setUsername(username);
  };

  const changeMessageHandler = (event) => {
    setMessageText(event.target.value);
  }

  const addMessageHandler = (message, className) => {
    setMessages((prevMessages) => {
      return [...prevMessages, { ...message, key: uuid(), className}];
    });
  };
  
  useEffect(() => {
    const newSocket = socketClient(SERVER);
    newSocket.on('connection', (socket) => {
      console.log('socket connected', socket);
    });

    newSocket.on('message', (receivedMessage) => {
      if (receivedMessage.author !== username) {
        addMessageHandler(receivedMessage, 'sent-by-others');
      }
    });
    
    setSocket(newSocket);
    return () => newSocket.close();
  }, [username]); 

  const submitWhenEnterIsPressed = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    console.log(message);
    if (!messageText) return;

    const message = { author: username, text: messageText };
    console.log(message);
    socket.emit('message', message);
    addMessageHandler(message, 'sent-by-me');
    setMessageText('');
  }

  return (
    <div className='App'>
      {!username && <Modal onSuccessHandler={assignUsername} socket={socket}></Modal>}
      <h1 className='title extra-padding'>Chatroom</h1>
      <div className='chat'>
        {messages.map((message) => (
          <div
            className={`${message.className} message-container`}
            key={message.key}
          >
            <div className='message'>
              <p className='message-author'>{message.author}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='new-message'>
        <input
          value={messageText}
          onChange={changeMessageHandler}
          onKeyDown={submitWhenEnterIsPressed}
        ></input>
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default App;
