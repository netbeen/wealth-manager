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

const MILLISECOND_PER_DAY = 1000 * 3600 * 24;

function FundDashboard(props) {
  const [fundName, setFundName] = useState('');
  const [fundIdentifier] = useState(props.match.params.identifier);
  const [fundType, setFundType] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitRate, setProfitRate] = useState(0);
  const [profitRatePerYear, setProfitRatePerYear] = useState(0);
  const [totalNetValue, setTotalNetValue] = useState(0);
  const [accumulatedNetValueArray, setAccumulatedNetValueArray] = useState([]);
  const [unitNetValueArray, setUnitNetValueArray] = useState([]);
  const [transactionArray, setTransactionArray] = useState([]);
  const [accumulatedNetValueArrayChartData, setAccumulatedNetValueArrayChartData] = useState([]);
  const [averageCostArrayChartData, setAverageCostArrayChartData] = useState([]);

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
      setUnitNetValueArray(JSON.parse(res.result.unitNetValue).map(item => [
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

  const calcChartData = () => {
    if (transactionArray.length !== 0 && accumulatedNetValueArray.length !== 0 && unitNetValueArray.length !== 0) {
      const _accumulatedNetValueArrayChartData = accumulatedNetValueArray.filter(item => item[0].valueOf() >= transactionArray[0].date.valueOf()).map(item => [item[0].valueOf(), item[1]]);
      setAccumulatedNetValueArrayChartData(_accumulatedNetValueArrayChartData);
      const _unitNetValueArrayFromFirstTransactionDay = unitNetValueArray.filter(item => item[0].valueOf() >= transactionArray[0].date.valueOf()).map(item => [item[0].valueOf(), item[1]]);

      const averageCostArray = [];
      let _totalCost = 0; // 总成本
      let _totalCount = 0; // 总份数
      _accumulatedNetValueArrayChartData.forEach((item, index) => {
        const transactionOnThatDay = transactionArray.filter(transaction => transaction.date.valueOf() === item[0].valueOf());
        const unitValueItemOnThatDay = _unitNetValueArrayFromFirstTransactionDay[index];

        if (transactionOnThatDay.length !== 0) {
          _totalCost += transactionOnThatDay[0].value * unitValueItemOnThatDay[1] + transactionOnThatDay[0].handlingFee;
          _totalCount += transactionOnThatDay[0].value;
        }
        averageCostArray.push([item[0], _totalCount === 0 ? 0 : _totalCost / _totalCount]);
      });

      const _totalNetValue = unitNetValueArray[unitNetValueArray.length - 1][1] * _totalCount;
      const investYears = (new Date() - new Date(transactionArray[0].date)) / MILLISECOND_PER_DAY / 365;

      setAverageCostArrayChartData(averageCostArray);
      setTotalCost(_totalCost);
      setTotalNetValue(_totalNetValue);
      setTotalProfit(_totalNetValue - _totalCost);
      setProfitRate((_totalNetValue - _totalCost) / _totalCost);
      setProfitRatePerYear((_totalNetValue - _totalCost) / _totalCost / investYears);
    }
  };

  useEffect(() => {
    initPage(fundIdentifier);
  }, []);

  useEffect(() => {
    calcChartData();
  }, [transactionArray, accumulatedNetValueArray, unitNetValueArray]);

  const lineChartConfig = {
    padding: [40, 30, 24, 35],
    spline: true,
    xAxis: {
      type: 'time',
      mask: 'YYYY-MM-DD',
    },
  };

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
                  {totalCost}
                </div>
                <div>
                    总净值：
                  {totalNetValue}
                </div>
                <div>
                    持仓收益：
                  {totalProfit}
                </div>
                <div>
                    持仓收益率：
                  {profitRate}
                </div>
                <div>
                    持仓年化收益率：
                  {profitRatePerYear}
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
              data={[
                {
                  name: '累计净值',
                  data: accumulatedNetValueArrayChartData,
                },
                {
                  name: '平均成本',
                  data: averageCostArrayChartData,
                },
              ]}
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
