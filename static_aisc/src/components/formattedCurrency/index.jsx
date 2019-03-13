import React, { } from 'react';
import { toThousands } from 'utils';
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
      style.color = '#f54545';
    } else if (value < 0) {
      style.color = '#0f990f';
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
