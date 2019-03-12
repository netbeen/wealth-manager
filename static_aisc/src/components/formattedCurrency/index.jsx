import React, { } from 'react';
import './index.scss';

export const CURRENCY_COLOR = {
  NONE: Symbol('NONE'),
  STOCK: Symbol('STOCK'),
  WEALTH: Symbol('WEALTH'),
};

export default ({
  value = 0,
  color = CURRENCY_COLOR.NONE,
  percentage = false,
}) => {
  const style = {};
  if (color === CURRENCY_COLOR.STOCK) {
    if (value > 0) {
      style.color = 'red';
    } else if (value < 0) {
      style.color = 'green';
    }
  } else if (color === CURRENCY_COLOR.WEALTH) {
    //
  }
  return (
    <span
      className="formatted-currency"
      style={style}
    >
      {(percentage ? value * 100 : value).toFixed(2)}
      {percentage && '%'}
    </span>
  );
};
