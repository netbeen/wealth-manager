import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Grid } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline } from '@alife/aisc-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { wealthUtils } from 'utils';
import exceed from 'utils/apimap';

import * as actions from '../actions/index';


// import { datePlus } from 'utils';
const { Row, Col } = Grid;


class FundDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accumulatedNetValueArray: [],
      transactionArray: [],
    };
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
      this.setState({
        accumulatedNetValueArray: JSON.parse(res.result.accumulatedNetValue).map(item => [
          new Date(`${item[0].slice(0, 4)}-${item[0].slice(4, 6)}-${item[0].slice(6, 8)}`),
          parseFloat(item[1]),
        ]),
      });
    });
  }

  fetchFundTransaction = (identifier) => {
    exceed.fetch({
      api: 'getFundTransactionByIdentifier',
      params: {
        identifier,
      },
    }).then((res) => {
      console.log('res', res);
      this.setState({
        transactionArray: res.result.map(item => {
          return {
            id: item.id,
            date: new Date(item.date),
            handlingFee: parseFloat(item.handlingFee),
            redemptionDate: item.redemptionDate ? new Date(item.redemptionDate) : null,
            value: item.value,
          };
        }).sort((a, b) => { return b.valueOf() - a.valueOf(); }),
      });
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
    const { accumulatedNetValueArray, transactionArray } = this.state;
    console.log('accumulatedNetValueArray', accumulatedNetValueArray);
    console.log('transactionArray', transactionArray);

    const lineChartConfig = {
      padding: [40, 30, 24, 35],
      spline: true,
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
      },
    };

    let data = [];
    if (transactionArray.length !== 0 && accumulatedNetValueArray.length !== 0) {
      data = [
        {
          name: '累计净值',
          data: accumulatedNetValueArray.filter(item => item[0].valueOf() >= transactionArray[0].date.valueOf()).map(item => [item[0].valueOf(), item[1]]),
        },
      ];

      console.log('data', data);
      const averageCostArray = [];
      let totalCost = 0; // 总成本
      let totalCount = 0; // 总份数
      data[0].data.forEach(item => {
        const transactionOnThatDay = transactionArray.filter(transaction => transaction.date.valueOf() === item[0].valueOf());
        if (transactionOnThatDay.length !== 0) {
          console.log(transactionOnThatDay[0]);
          totalCost += transactionOnThatDay[0].value * item[1] + transactionOnThatDay[0].handlingFee;
          totalCount += transactionOnThatDay[0].value;
        }
        averageCostArray.push([item[0], totalCount === 0 ? 0 : totalCost / totalCount]);
      });
      data.push({
        name: '平均成本',
        data: averageCostArray,
      });
    }

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
