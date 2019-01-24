import React, { Component } from 'react';
import { Button } from '@alife/aisc';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="page-index-wrap">
        <div className="text">周拉斯的专属财务小站</div>
        <div className="button-area">
          <Button
            size="medium"
            onClick={() => { window.location.href = '/wealth'; }}
          >
            开始使用
          </Button>
        </div>
      </div>
    );
  }
}

export default Login;
