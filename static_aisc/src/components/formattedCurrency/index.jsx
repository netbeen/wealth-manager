import React, { } from 'react';
import './index.scss';

export const CURRENCY_COLOR = {
  NONE: Symbol('NONE'),
  STOCK: Symbol('STOCK'),
  WEALTH: Symbol('WEALTH'),
};

const toThousands = (numString) => {
  if (!numString || !parseFloat(numString)) {
    return null;
  }
  const [, sign, integer, decimal] = numString.match(/(-)?(.*)\.(.*)?$/);
  let integerResult = '';
  let integerRemain = integer;

  while (integerRemain.length > 3) {
    integerResult = `,${integerRemain.slice(-3)}${integerResult}`;
    integerRemain = integerRemain.slice(0, integerRemain.length - 3);
  }
  if (integerRemain) { integerResult = integerRemain + integerResult; }
  return `${sign === '-' ? '-' : ''}${integerResult}.${decimal}`;
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
  let displayValue = value;
  if (percentage) {
    displayValue = (displayValue * 100).toFixed(2);
  } else {
    displayValue = toThousands(displayValue.toFixed(2));
  }
  return (
    <span
      className="formatted-currency"
      style={style}
    >
      {displayValue}
      {percentage && '%'}
    </span>
  );
};
