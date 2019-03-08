import React, { useState, useEffect } from 'react';
import Nav from '../../../components/nav';
import { Button, Grid, Card } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline } from '@alife/aisc-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import exceed from 'utils/apimap';

import * as actions from '../actions/index';

const { Row, Col } = Grid;


function FundDashboard(props) {
  const [fundName, setFundName] = useState('');
  const [fundIdentifier, setFundIdentifier] = useState(props.match.params.identifier);
  const [fundType, setFundType] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [accumulatedNetValueArray, setAccumulatedNetValueArray] = useState([]);
  const [transactionArray, setTransactionArray] = useState([]);

  const initPage = (identifier) => {
    fetchFundData(identifier);
    fetchFundTransaction(identifier);
  };

  const fetchFundData = (identifier) => {
    exceed.fetch({
      api: 'getFundData',
      params: {
        identifier,
      },
    }).then((res) => {
      setFundName(res.result.name);
      setFundType(res.result.type);
      setAccumulatedNetValueArray(JSON.parse(res.result.accumulatedNetValue).map(item => [
        new Date(`${item[0].slice(0, 4)}-${item[0].slice(4, 6)}-${item[0].slice(6, 8)}`),
        parseFloat(item[1]),
      ]));
    });
  };

  const fetchFundTransaction = (identifier) => {
    exceed.fetch({
      api: 'getFundTransactionByIdentifier',
      params: {
        identifier,
      },
    }).then((res) => {
      setTransactionArray(res.result.map(item => {
        return {
          id: item.id,
          date: new Date(item.date),
          handlingFee: parseFloat(item.handlingFee),
          redemptionDate: item.redemptionDate ? new Date(item.redemptionDate) : null,
          value: item.value,
        };
      }).sort((a, b) => { return b.valueOf() - a.valueOf(); }));
    });
  };

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

    const averageCostArray = [];
    let _totalCost = 0; // 总成本
    let _totalCount = 0; // 总份数
    data[0].data.forEach(item => {
      const transactionOnThatDay = transactionArray.filter(transaction => transaction.date.valueOf() === item[0].valueOf());
      if (transactionOnThatDay.length !== 0) {
        console.log(transactionOnThatDay[0]);
        _totalCost += transactionOnThatDay[0].value * item[1] + transactionOnThatDay[0].handlingFee;
        _totalCount += transactionOnThatDay[0].value;
      }
      averageCostArray.push([item[0], _totalCount === 0 ? 0 : _totalCost / _totalCount]);
    });
    data.push({
      name: '平均成本',
      data: averageCostArray,
    });
  }

  useEffect(() => {
    initPage(fundIdentifier);
  }, []);

  return (
    <div>
      <Nav />
      <div className="page-fund-detail">
        <Row type="wrap" >
          <Col span="24">
            <Button
              type="primary"
              onClick={() => {
                props.history.push(`/fund/${fundIdentifier}/purchase`);
              }}
            >
                记录申购
            </Button>
          </Col>
        </Row>
        <Row type="wrap" >
          <Col span="24">
            <Card style={{ marginTop: 20, width: '100%' }} className="fund-detail-overview-card">
              <div className="basic-info">
                <div>{fundName}</div>
                <div>{fundType}</div>
              </div>
              <div className="benefit-relative-info">
                <div>
                    总成本：
                  {fundType}
                </div>
                <div>
                    总净值：
                  {fundType}
                </div>
                <div>
                    持仓收益：
                  {fundType}
                </div>
                <div>
                    持仓收益率：
                  {fundType}
                </div>
                <div>
                    持仓年化收益率：
                  {fundType}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row type="wrap" >
          <Col span="24" >
            <div className="chart-title">成本净值对比</div>
            <Wline
              // ref={line => this.line1 = line}
              // event={this.event1}
              height="300"
              config={
                  {
                    ...lineChartConfig,
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

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(FundDashboard));
