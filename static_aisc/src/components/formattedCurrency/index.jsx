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
    let wealthColor = '#969696';
    if (value >= 1000 && value < 10000) {
      wealthColor = '#ffffff';
    } else if (value >= 10000 && value < 100000) {
      wealthColor = '#4AD051';
    } else if (value >= 100000 && value < 1000000) {
      wealthColor = '#52D7FF';
    } else if (value >= 1000000 && value < 10000000) {
      wealthColor = '#FAB34F';
    } else if (value >= 10000000 && value < 100000000) {
      wealthColor = '#FF656B';
    }
    style.color = wealthColor;
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
