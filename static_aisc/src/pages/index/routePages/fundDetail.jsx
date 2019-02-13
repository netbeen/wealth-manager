import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Card, Grid, Dropdown, Menu } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline, Wpie } from '@alife/aisc-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wealthUtils } from 'utils';
import exceed from 'utils/apimap';

import * as actions from '../actions/index';
import { SET_WEALTH_RECORD_ARRAY } from '../actions/index';


// import { datePlus } from 'utils';
const { Row, Col } = Grid;


class FundDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initPage(this.props.match.params.identifier);
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

  initPage = (identifier) => {
    this.fetchFundData(identifier);
    this.fetchFundTransaction(identifier);
  }

  fetchFundData = (identifier) => {
    exceed.fetch({
      api: 'getFundData',
      params: {
        identifier,
      },
    }).then((res) => {
      console.log('res', res);
    });
  }

  fetchFundTransaction = (identifier) => {
    exceed.fetch({
      api: 'getFundTransaction',
      params: {
        identifier,
      },
    }).then((res) => {
      console.log('res', res);
    });
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
    const lineChartConfig = {
      padding: [40, 30, 24, 35],
      spline: true,
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
      },
      // guide: {
      //   area: guideAreas,
      // },
    };

    const data = [
      {
        name: '机房1',
        data: [[1483372800000, 1892], [1483459200000, 7292], [1483545600000, 5714], [1483632000000, 5354], [1483718400000, 2014], [1483804800000, 22], [1483891200000, 11023], [1483977600000, 5218], [1484064000000, 8759], [1484150400000, 9981], [1484236800000, 4533], [1484323200000, 11398], [1484409600000, 1064], [1484496000000, 6494]],
      }, {
        name: '机房2',
        data: [[1483372800000, 11751], [1483459200000, 4078], [1483545600000, 2175], [1483632000000, 12048], [1483718400000, 1748], [1483804800000, 10494], [1483891200000, 9597], [1483977600000, 4788], [1484064000000, 2085], [1484150400000, 492], [1484236800000, 2965], [1484323200000, 4246], [1484409600000, 2160], [1484496000000, 11877]],
      },
    ];

    return (
      <div>
        <Nav />
        <div className="page-wealth-wrap">
          <Row type="wrap" >
            <Col span="24">
              <Button
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
          <Row type="wrap" >
            <Col span="24" >
              <div className="chart-title">资产分布</div>
              <Wline
                ref={line => this.line1 = line}
                event={this.event1}
                height="300"
                config={
                  {
                    ...lineChartConfig,
                    // yAxis: {
                    //   min: 0,
                    //   labelFormatter: (input) => {
                    //     return `${Math.round(input)}%`;
                    //   },
                    // },
                  }
                }
                data={data}
              />
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
