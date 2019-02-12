import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Card, Grid, Dropdown, Menu } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline, Wpie } from '@alife/aisc-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wealthUtils } from 'utils';

import * as actions from '../actions/index';


// import { datePlus } from 'utils';
const { Row, Col } = Grid;


class FundDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillMount() {
    // this.event1 = {
    //   plotmove: this.handleMove.bind(this, '1'),
    //   plotleave: this.handleLeave.bind(this, '1'),
    // };
    // this.event2 = {
    //   plotmove: this.handleMove.bind(this, '2'),
    //   plotleave: this.handleLeave.bind(this, '2'),
    // };
  }

  // handleMove(key, e) {
  //   if (key === '1' && this.line2) {
  //     this.line2.chart.showTooltip(e);
  //   } else if (key === '2' && this.line1) {
  //     this.line1.chart.showTooltip(e);
  //   }
  // }
  //
  // handleLeave(key) {
  //   if (key === '1' && this.line2) {
  //     this.line2.chart.hideTooltip();
  //   } else if (key === '2' && this.line1) {
  //     this.line1.chart.hideTooltip();
  //   }
  // }

  render() {
    return (
      <div>
        <Nav />
        <div className="page-wealth-wrap">
          <Row type="wrap" >
            <Col span="24">
              <Button
                // style={{ marginRight: 12 }}
                type="primary"
                onClick={() => {
                  this.props.history.push('/fund/purchase');
                }}
              >
                记录申购
              </Button>
              <span>切换视角</span>
              <Dropdown triggerButton={<Button type="normal">下拉菜单</Button>} triggerType="click">
                <Menu>
                  <Menu.Item key="1">基金投资概览</Menu.Item>
                  <Menu.Item disabled key="2">选项 2</Menu.Item>
                  <Menu.Item >选项 3</Menu.Item>
                  <Menu.Item >选项 4</Menu.Item>
                </Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(FundDashboard));
