import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="page-error-wrap" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100vw', height: '100vh' }}>
        <img width="400" height="400" alt="404" src="https://img.alicdn.com/tfs/TB1HFKaD1ySBuNjy1zdXXXPxFXa-700-700.png" />
        <div style={{ fontSize: 36, color: '#969ca8' }}>404 - 找不到对应的页面</div>
      </div>
    );
  }
}

export default Login;
