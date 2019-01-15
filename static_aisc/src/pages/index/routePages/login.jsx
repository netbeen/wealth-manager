import React, { Component } from 'react';
// import Nav from '../../../components/nav';
// import { Section, Card, Breadcrumb, Button, Search, Select, Dropdown, Menu, Notice } from '@alife/aisc';

// const ButtonGroup = Button.Group;
// const { Option } = Select;

class Login extends Component {
  static propTypes = {
    // breadcrumb: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    breadcrumb: [],
  };

  componentDidMount() {}

  onSearch = (searchParams) => {
    console.log(searchParams);
  }

  onSelectChange = (value, data) => {
    console.log(value, data);
  }

  onMenuClick = (selectedKeys, menuItem, meta) => {
    console.log(selectedKeys, menuItem, meta);
  }

  render() {
    // const { breadcrumb } = this.props;

    return (
      <div>
        <div>你是谁？</div>
        <a href={'/login/compete?uuid=7be2bc9e-06f6-4f92-8174-1061684ed368'}>歪歪</a>
        <a href={'/login/compete?uuid=af6893f8-c877-42fe-bb82-361273fcad56'}>周拉斯</a>
      </div>
    );
  }
}

export default Login;
