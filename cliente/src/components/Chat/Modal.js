import React, { useState } from 'react';
import Button from '../UI/Button';
import './Modal.css';

const SERVER = 'http://192.168.0.111:8080'

const Modal = (props) => {
  // create states
  let [username, setUsername] = useState('');
  let [invalid, setInvalid] = useState(false);
  let [available, setAvailable] = useState(true);

  // whenever username changes, invalid is false and we update state
  const usernameChangedHandler = (event) => {
    setInvalid(false);
    setUsername(event.target.value);
  };

  // handler for sumitting whenever enter is pressed
  const submitWhenEnterIsPressed = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      submit();
    }
  }

  const submit = async () => {
    if (!username) {
      setInvalid(true);
      return;
    }

    // send post request to server
    const response = await fetch(`${SERVER}/login`, {
      method: 'POST',
      body: JSON.stringify({ username: username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // validate response
    if (data.success) {
      props.onSuccessHandler(username);
    } else {
      setAvailable(false);
    }
  };

  return <div className='overlay'>
    <div className='modal'>
      <h1 className='title'>Webchat</h1>
      {/* <input placeholder="Room code"></input> */}
      <div className='username-input'>
        <input className={invalid || !available ? 'input-error' : ''} placeholder='Username' value={username} onChange={usernameChangedHandler} onKeyDown={submitWhenEnterIsPressed}></input>
        {invalid && <span className='error'>Please choose a valid username.</span>}
        {!invalid && !available && <span className='error'>Please choose a different username, the one you tried is already taken.</span>}
      </div>
      <Button onClick={submit}>Go</Button>
    </div>
  </div>;
}

export default Modal;