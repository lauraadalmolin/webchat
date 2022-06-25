import React, { useState } from 'react';
import './Modal.css';

const SERVER = 'http://192.168.0.115:8080'

const Modal = (props) => {
  let [username, setUsername] = useState('');
  let [available, setAvailable] = useState(true);

  const usernameChangedHandler = (event) => {
    setUsername(event.target.value);
    console.log(event);
  };

  const submitWhenEnterIsPressed = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === 13) {
      submit();
    }
  }

  const submit = async () => {
    const response = await fetch(`${SERVER}/login`, {
      method: 'POST',
      body: JSON.stringify({ username: username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      props.onSuccessHandler(username);
    } else {
      setAvailable(false);
    }
  };

  return <div className='overlay'>
    <div className='modal'>
      <h1 className='title'>Pick a username</h1>
      <div className='input-div'>
        <input value={username} onChange={usernameChangedHandler} onKeyDown={submitWhenEnterIsPressed}></input>
        {!available && <span className='error'>Please choose a different username, the one you tried is already taken.</span>}
        <button onClick={submit}>Enviar</button>
      </div>
    </div>
  </div>;
}

export default Modal;