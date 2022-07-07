import React from 'react';

import classes from './Button.module.css';

const Button = ({onClick, children, type='primary'}) => {
  const btnType = classes[`button--${type}`];
  return (
    <button 
      className={`${classes.button} ${btnType} no-select`}
      type='button'
      onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;