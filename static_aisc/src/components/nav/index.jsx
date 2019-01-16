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
        <Link to="/wealth">资产管理</Link>
        <a href="/login/logout">{`退出${window.WM_GLOBAL.user.nickname}的登录`}</a>
      </div>
    );
  }
}

export default Nav;
