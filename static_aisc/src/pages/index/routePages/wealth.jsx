import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Card, Grid } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline, Wpie } from '@alife/aisc-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toThousands, wealthUtils } from 'utils';

import * as actions from '../actions/index';


// import { datePlus } from 'utils';
const { Row, Col } = Grid;


class Wealth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchWealthRecordArray();
    this.props.fetchWealthCategoryArray();
  }

  componentWillMount() {
    this.event1 = {
      plotmove: this.handleMove.bind(this, '1'),
      plotleave: this.handleLeave.bind(this, '1'),
    };
    this.event2 = {
      plotmove: this.handleMove.bind(this, '2'),
      plotleave: this.handleLeave.bind(this, '2'),
    };
  }

  handleMove(key, e) {
    if (key === '1' && this.line2) {
      this.line2.chart.showTooltip(e);
    } else if (key === '2' && this.line1) {
      this.line1.chart.showTooltip(e);
    }
  }

  handleLeave(key) {
    if (key === '1' && this.line2) {
      this.line2.chart.hideTooltip();
    } else if (key === '2' && this.line1) {
      this.line1.chart.hideTooltip();
    }
  }

  render() {
    const { wealthRecordArray, wealthCategoryOrderArray, wealthCategoryFlatArray } = this.props;

    const categoryOrderIds = wealthCategoryOrderArray.map(item => item.id);
    const distributionData = [];

    wealthRecordArray.forEach((item) => {
      item.netAsset = wealthUtils.sumAsset(item, wealthCategoryFlatArray, wealthUtils.SUM_TYPE.NET_ASSET);
      item.totalAsset = wealthUtils.sumAsset(item, wealthCategoryFlatArray, wealthUtils.SUM_TYPE.TOTAL_ASSET);

      // 把出现过的类目放入数组
      item.wealthRecordItems.forEach((wealthRecordItem) => {
        if (!distributionData.map((distributionDataItem) => distributionDataItem.categoryId).includes(wealthRecordItem.categoryId)) {
          const categoryInfo = wealthCategoryOrderArray.filter(categoryOrderItem => categoryOrderItem.id === wealthRecordItem.categoryId);
          if (categoryInfo.length > 0) {
            distributionData.push({
              categoryId: wealthRecordItem.categoryId,
              categoryType: categoryInfo[0].type,
              categoryName: categoryInfo[0].name,
              values: Array(wealthRecordArray.length).fill(0),
            });
          }
        }
      });
    });

    wealthRecordArray.forEach((item, index) => {
      item.wealthRecordItems.forEach((wealthRecordItem) => {
        const searchTarget = distributionData.filter(distributionDataItem => distributionDataItem.categoryId === wealthRecordItem.categoryId);
        if (searchTarget.length > 0) {
          searchTarget[0].values[index] = parseFloat(wealthRecordItem.value).toFixed(2);
        }
      });
    });
    distributionData.sort((a, b) => {
      return categoryOrderIds.indexOf(a.categoryId) - categoryOrderIds.indexOf(b.categoryId);
    });


    const guideAreas = [];
    const earliestDateValue = Math.min(...(wealthRecordArray.map(item => new Date(item.date).valueOf()) || [0]));
    if (Number.isSafeInteger(earliestDateValue)) {
      const currentDate = new Date(earliestDateValue);
      while (currentDate < new Date()) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        guideAreas.push({
          status: 'normal',
          axis: 'x',
          value: [new Date(`${currentDate.getFullYear()}-01-01`).valueOf(), new Date(`${currentDate.getFullYear()}-12-31`).valueOf()],
        });
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }

    const lineChartConfig = {
      padding: [40, 30, 24, 35],
      spline: true,
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
      },
      guide: {
        area: guideAreas,
      },
    };

    const debtDistributionData = [];
    const assetDistributionData = [];

    distributionData
      .filter(item => item.categoryType === 'asset')
      .forEach(categoryWithValues => {
        if (parseFloat(categoryWithValues.values[categoryWithValues.values.length - 1]) !== 0) {
          assetDistributionData.push([categoryWithValues.categoryName, parseFloat(categoryWithValues.values[categoryWithValues.values.length - 1])]);
        }
      });

    distributionData
      .filter(item => item.categoryType === 'debt')
      .forEach(categoryWithValues => {
        if (parseFloat(categoryWithValues.values[categoryWithValues.values.length - 1]) !== 0) {
          debtDistributionData.push([categoryWithValues.categoryName, parseFloat(categoryWithValues.values[categoryWithValues.values.length - 1])]);
        }
      });


    return (
      <div>
        <Nav />
        <div className="page-wealth-wrap">
          <Row type="wrap">
            <div className="top-area">
              <Button
                style={{ marginRight: 12 }}
                type="primary"
                onClick={() => {
                  this.props.history.push('/wealth/record/create');
                }}
              >
                财务盘点
              </Button>

              <Button
                type="normal"
                onClick={() => {
                  this.props.history.push('/wealth/record');
                }}
              >
                历史明细
              </Button>
            </div>
          </Row>
          <Row type="wrap">
            <Col span="24">
              <div className="chart-title">资产分布</div>
              <Wline
                ref={line => this.line1 = line}
                event={this.event1}
                height="300"
                config={
                  {
                    ...lineChartConfig,
                    yAxis: {
                      min: 0,
                      labelFormatter: (input) => {
                        return `${Math.round(input)}%`;
                      },
                    },
                  }
                }
                data={distributionData.filter(item => item.categoryType === 'asset').map(distributionDataItem => ({
                  name: `${distributionDataItem.categoryName}%`,
                  data: distributionDataItem.values.map((value, index) => {
                    return [new Date(wealthRecordArray[index].date).valueOf(), (value / wealthRecordArray[index].totalAsset / 0.01).toFixed(2)];
                  }),
                }))}
              />
            </Col>
          </Row>
          <Row type="wrap">
            <Col span="24">
              <div className="chart-title">资产总量</div>
              <Wline
                ref={line => this.line2 = line}
                event={this.event2}
                height="300"
                config={
                  {
                    ...lineChartConfig,
                    yAxis: {
                      min: 0,
                      labelFormatter: (input) => {
                        return `${Math.round(input / 1000)}K`;
                      },
                    },
                    tooltip: {
                      valueFormatter: (value) => {
                        // tooltip中显示数据的格式化函数，传入参数：value, data, index, rawData，返回新的显示数据
                        return toThousands(parseFloat(value).toFixed(2));
                      },
                    }
                  }
                }
                data={[
                  {
                    name: '总资产',
                    data: wealthRecordArray.map((item) => {
                      return [new Date(item.date).valueOf(), item.totalAsset.toFixed(2)];
                    }),
                  }, {
                    name: '净资产',
                    data: wealthRecordArray.map((item) => {
                      return [new Date(item.date).valueOf(), item.netAsset.toFixed(2)];
                    }),
                  },
                ]}
              />
            </Col>
          </Row>
          <Row type="wrap">
            <Col xl="12" l="12" m="12" s="24" xs="24" xxs="24">
              <Card style={{ display: 'block', margin: '20px 10px 0 0' }}>
                <div style={{ fontSize: 14 }}>资产比例</div>
                <Wpie
                  height="300"
                  config={{
                    cycle: true,
                  }}
                  data={[
                    {
                      name: '浏览器占比',
                      data: assetDistributionData,
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col xl="12" l="12" m="12" s="24" xs="24" xxs="24">
              <Card style={{ display: 'block', margin: '20px 10px 0 0' }}>
                <div style={{ fontSize: 14 }}>负债比例</div>
                <Wpie
                  height="300"
                  config={{
                    cycle: true,
                  }}
                  data={[
                    {
                      name: '浏览器占比',
                      data: debtDistributionData,
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }} />
            <div style={{ width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(Wealth));
