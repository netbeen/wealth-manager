import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { Button } from '@alife/aisc';
import './index.scss';

class Nav extends Component {
  state = {};

  render() {
    // const { startDate, moveForward, moveBackward, move2ThisWeek } = this.props;
    return (
      <div
        className="nav-bar-top"
      >
        <Link className={`nav-button ${(window.location.pathname.includes('/wealth') || window.location.pathname === '/') && 'highlight'}`} to="/wealth">财务概览</Link>
        <Link className={`nav-button ${window.location.pathname.includes('/fund') && 'highlight'}`} to="/fund">基金投资</Link>
        <div className="placeholder" />
        <a className="nav-button-right" href="/login/logout">{`退出${window.WM_GLOBAL.user.nickname}的登录`}</a>
      </div>
    );
  }
}

export default Nav;
