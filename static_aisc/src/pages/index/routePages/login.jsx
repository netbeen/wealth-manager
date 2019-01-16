import React, { Component } from 'react';
import { Button } from '@alife/aisc';

class Login extends Component {
  static propTypes = {
    // breadcrumb: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    breadcrumb: [],
  };

  componentDidMount() {}

  render() {
    return (
      <div className="page-login-wrap">
        <div className="text">你是谁？</div>
        <div className="button-area">
          <Button size="medium" onClick={() => { window.location.href = '/login/compete?uuid=7be2bc9e-06f6-4f92-8174-1061684ed368'; }}>歪歪</Button>
          <Button size="medium" onClick={() => { window.location.href = '/login/compete?uuid=af6893f8-c877-42fe-bb82-361273fcad56'; }}>周拉斯</Button>
        </div>
      </div>
    );
  }
}

export default Login;
