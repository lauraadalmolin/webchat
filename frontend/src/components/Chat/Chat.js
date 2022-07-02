import React, { useEffect } from 'react';
import { useState } from 'react';
import uuid from 'react-uuid';

import './Chat.css';
import Modal from './Modal';
import socketClient from 'socket.io-client';
import Card from '../UI/Card';
import Button from '../UI/Button';

const SERVER = 'http://192.168.0.111:8080';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState(null);

  const assignUsername = (username) => {
    setUsername(username);
  };

  const changeMessageHandler = (event) => {
    setMessageText(event.target.value);
  };

  const addMessageHandler = (message, className) => {
    setMessages((prevMessages) => {
      return [...prevMessages, { ...message, key: uuid(), className }];
    });
  };

  useEffect(() => {
    const newSocket = socketClient(SERVER);
    if (!username) {
      newSocket.on('connection', (socket) => {
        console.log('socket connected', socket);
      });
    }

    setSocket(newSocket);
    return () => newSocket.disconnect({username});
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('username_defined', { username });

    socket.on('message', (receivedMessage) => {
      if (receivedMessage.author !== username) {
        console.log(receivedMessage.color)
        addMessageHandler(receivedMessage, 'sent-by-others');
      }
    });
  }, [username]);

  const submitWhenEnterIsPressed = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!messageText) return;

    const message = { author: username, text: messageText };
    socket.emit('message', message);
    addMessageHandler(message, 'sent-by-me');
    setMessageText('');
  };

  return (
    <Card>
      {!username && (
        <Modal onSuccessHandler={assignUsername} socket={socket}></Modal>
      )}
      <h1 className='title extra-padding'>Chat</h1>
      <div className='chat'>
        <span className='scroll-start-at-top'></span>
        {messages.map((message) => (
          <div
            className={`${message.className} message-container`}
            key={message.key}
          >
            <div className={`message message--${message.className}`}>
              {message.author !== username && (
                <p
                  className='message-author'
                  style={{ color: message.color || 'black' }}
                >
                  {message.author}
                </p>
              )}
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
        <Button onClick={sendMessage}>Enviar</Button>
      </div>
    </Card>
  );
};

export default Chat;
