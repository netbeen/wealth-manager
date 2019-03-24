import React, { useState, useEffect } from 'react';
import Nav from '../../../components/nav';
import FormattedCurrency, { CURRENCY_COLOR } from '../../../components/formattedCurrency';
import { Button, Grid, Card } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline } from '@alife/aisc-widgets';
import { toThousands } from 'utils';
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
  const [profitRatePerDay, setProfitRatePerDay] = useState([]);
  const [annualizedProfitRatePerDay, setAnnualizedProfitRatePerDay] = useState([]);

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
      let _accumulatedNetValueArray = [];
      let _unitNetValueArray = [];
      try {
        _accumulatedNetValueArray = JSON.parse(res.result.accumulatedNetValue);
      } catch (e) {
        console.error('JSON Parse Error', e, 'value=', res.result.accumulatedNetValue);
      }
      try {
        _unitNetValueArray = JSON.parse(res.result.unitNetValue);
      } catch (e) {
        console.error('JSON Parse Error', e, 'value=', res.result.unitNetValue);
      }
      setFundName(res.result.name);
      setFundType(res.result.type);
      setAccumulatedNetValueArray(_accumulatedNetValueArray.map(item => [
        new Date(`${item[0].slice(0, 4)}-${item[0].slice(4, 6)}-${item[0].slice(6, 8)}`),
        parseFloat(item[1]),
      ]));
      setUnitNetValueArray(_unitNetValueArray.map(item => [
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
    if (transactionArray.length !== 0
      && accumulatedNetValueArray.length !== 0
      && unitNetValueArray.length !== 0
    ) {
      const _accumulatedNetValueArrayChartData = accumulatedNetValueArray
        .filter(item => item[0].valueOf() >= transactionArray[0].date.valueOf())
        .map(item => [item[0].valueOf(), item[1]]);
      setAccumulatedNetValueArrayChartData(_accumulatedNetValueArrayChartData);

      // 从本次交易开始的单位净值列表
      const _unitNetValueArrayFromFirstTransactionDay = unitNetValueArray
        .filter(item => item[0].valueOf() >= transactionArray[0].date.valueOf())
        .map(item => [item[0].valueOf(), item[1]]);

      // 从本次交易开始的累计净值列表
      // const _accumulatedNetValueArrayFromFirstTransactionDay = accumulatedNetValueArray
      //   .filter(item => item[0].valueOf() >= transactionArray[0].date.valueOf())
      //   .map(item => [item[0].valueOf(), item[1]]);

      const averageCostArray = []; // 平均成本数组
      const _profitRatePerDay = []; // 收益率
      const _profitRateYearlyPerDay = []; // 年化收益率
      let _totalCost = 0; // 总成本
      let _totalCostWithAccumulatedNetValue = 0;
      let _totalCount = 0; // 总份数
      _accumulatedNetValueArrayChartData.forEach((item, index) => {
        const transactionOnThatDay = transactionArray
          .filter(transaction => transaction.date.valueOf() === item[0].valueOf());

        const unitValueItemOnThatDay = _unitNetValueArrayFromFirstTransactionDay[index][1];
        // const accumulatedValueItemOnThatDay = _accumulatedNetValueArrayFromFirstTransactionDay[index][1];

        if (transactionOnThatDay.length !== 0) {
          _totalCost += transactionOnThatDay[0].value * unitValueItemOnThatDay + transactionOnThatDay[0].handlingFee;
          _totalCostWithAccumulatedNetValue += transactionOnThatDay[0].value * item[1] + transactionOnThatDay[0].handlingFee;
          _totalCount += transactionOnThatDay[0].value;
        }
        const _profitRate = (unitValueItemOnThatDay * _totalCount - _totalCost) / _totalCost;
        const _investYearsOnThatDay = (new Date(item[0]) - new Date(transactionArray[0].date)) / MILLISECOND_PER_DAY / 365;
        averageCostArray.push([item[0], _totalCostWithAccumulatedNetValue / _totalCount]);
        _profitRatePerDay.push([item[0], _profitRate]);
        _profitRateYearlyPerDay.push([item[0], _profitRate / (_investYearsOnThatDay === 0 ? _investYearsOnThatDay + 0.0001 : _investYearsOnThatDay)]);
      });

      const _totalNetValue = unitNetValueArray[unitNetValueArray.length - 1][1] * _totalCount;
      const investYears = (new Date() - new Date(transactionArray[0].date)) / MILLISECOND_PER_DAY / 365;

      setAnnualizedProfitRatePerDay(_profitRateYearlyPerDay);
      setProfitRatePerDay(_profitRatePerDay);
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

  const handleMove = (key, e) => {
    if (key === '1' && window.line2) {
      window.line2.chart.showTooltip(e);
    } else if (key === '2' && window.line1) {
      window.line1.chart.showTooltip(e);
    }
  };
  const handleLeave = (key) => {
    if (key === '1' && window.line2) {
      window.line2.chart.hideTooltip();
    } else if (key === '2' && window.line1) {
      window.line1.chart.hideTooltip();
    }
  };

  const event1 = {
    plotmove: (e) => { handleMove('1', e); },
    plotleave: () => { handleLeave('1'); },
  };
  const event2 = {
    plotmove: (e) => { handleMove('2', e); },
    plotleave: () => { handleLeave('2'); },
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
                  <span>总成本：</span>
                  <FormattedCurrency
                    value={totalCost}
                  />
                </div>
                <div>
                  <span>总净值：</span>
                  <FormattedCurrency
                    value={totalNetValue}
                  />
                </div>
                <div>
                  <span>持仓收益：</span>
                  <FormattedCurrency
                    value={totalProfit}
                    color={CURRENCY_COLOR.STOCK}
                  />
                </div>
                <div>
                  <span>持仓收益率：</span>
                  <FormattedCurrency
                    value={profitRate}
                    color={CURRENCY_COLOR.STOCK}
                    percentage
                  />
                </div>
                <div>
                  <span>持仓年化收益率：</span>
                  <FormattedCurrency
                    value={profitRatePerYear}
                    color={CURRENCY_COLOR.STOCK}
                    percentage
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row type="wrap" >
          <Col span="24" >
            <Wline
              ref={line => window.line1 = line}
              event={event1}
              height="300"
              config={
                  {
                    ...lineChartConfig,
                    tooltip: {
                      valueFormatter: (value) => {
                        // tooltip中显示数据的格式化函数，传入参数：value, data, index, rawData，返回新的显示数据
                        return toThousands(parseFloat(value).toFixed(4));
                      },
                    },
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
        <Row type="wrap" >
          <Col span="24" >
            <Wline
              ref={line => window.line2 = line}
              event={event2}
              height="300"
              config={
                {
                  ...lineChartConfig,
                  tooltip: {
                    valueFormatter: (value) => {
                      // tooltip中显示数据的格式化函数，传入参数：value, data, index, rawData，返回新的显示数据
                      return `${parseFloat(value * 100).toFixed(2)}%`;
                    },
                  },
                  yAxis: {
                    min: -0.4,
                    max: 0.8,
                    labelFormatter: (value) => {
                      return `${Math.round(value * 100)}%`;
                    },
                  },
                }
              }
              data={[
                {
                  name: '收益率%',
                  data: profitRatePerDay,
                },
                {
                  name: '年化收益率',
                  data: annualizedProfitRatePerDay,
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
