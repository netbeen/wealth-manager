import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline, Wpie } from '@alife/aisc-widgets';
import exceed from 'utils/apimap';

const data = [
  {
    name: '机房1',
    data: [[1483459200000, 1892], [1483372800000, 7292], [1483545600000, 5714], [1483632000000, 5354], [1483718400000, 2014], [1483804800000, 22], [1483891200000, 11023], [1483977600000, 5218], [1484064000000, 8759], [1484150400000, 9981], [1484236800000, 4533], [1484323200000, 11398], [1484409600000, 1064], [1484496000000, 6494]],
  }, {
    name: '机房2',
    data: [[1483372800000, 11751], [1483459200000, 4078], [1483545600000, 2175], [1483632000000, 12048], [1483718400000, 1748], [1483804800000, 10494], [1483891200000, 9597], [1483977600000, 4788], [1484064000000, 2085], [1484150400000, 492], [1484236800000, 2965], [1484323200000, 4246], [1484409600000, 2160], [1484496000000, 11877]],
  },
];

class Wealth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wealthRecord: [],
      treeCategory: [],
      flatCategory: [],
    };
  }

  componentDidMount() {
    this.fetchWealthRecord();
    this.fetchWealthCategory();
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

  fetchWealthRecord = () => {
    exceed.fetch({
      api: 'getWealthRecord',
      data: {},
    }).then((res) => {
      console.log(res);
      this.setState({
        wealthRecord: res,
      });
    });
  }

  fetchWealthCategory = () => {
    exceed.fetch({
      api: 'getWealthCategory',
      data: {},
    }).then((res) => {
      this.setState({
        flatCategory: res,
      });
      const categoryWithChildren = res.map((item) => {
        return { ...item, children: [] };
      });
      categoryWithChildren.forEach((item) => {
        if (item.parentId !== -1) {
          // console.log(item);
          categoryWithChildren.filter(
            (searchParentItem) => { return searchParentItem.id === item.parentId; }
          )[0].children.push(item);
        }
      });
      this.setState({
        treeCategory: categoryWithChildren.filter(item => item.parentId === -1),
      });
    });
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

  breadthFirstTraversal = (treeCategory) => {
    const result = [];
    treeCategory.forEach((categoryLevel1) => {
      result.push(...categoryLevel1.children);
    });
    return result;
  }

  calcNetAsset = (wealthRecord) => {
    const { flatCategory } = this.state;
    const netAsset = wealthRecord.wealthRecordItems.reduce((sum, wealthRecordItems) => {
      if (flatCategory.filter((category) => { return category.id === wealthRecordItems.categoryId; })[0].type === 'asset') {
        return sum + parseFloat(wealthRecordItems.value);
      } else {
        return sum - parseFloat(wealthRecordItems.value);
      }
    }, 0);
    return netAsset;
  }

  calcTotalAsset = (wealthRecord) => {
    const { flatCategory } = this.state;
    const netAsset = wealthRecord.wealthRecordItems.reduce((sum, wealthRecordItems) => {
      if (flatCategory.filter((category) => { return category.id === wealthRecordItems.categoryId; })[0].type === 'asset') {
        return sum + parseFloat(wealthRecordItems.value);
      } else {
        return sum;
      }
    }, 0);
    return netAsset;
  }

  render() {
    const { wealthRecord, treeCategory } = this.state;

    const categoryOrder = this.breadthFirstTraversal(treeCategory);
    const categoryOrderIds = categoryOrder.map(item => item.id);
    console.log('categoryOrder', categoryOrder);
    console.log('categoryOrderIds', categoryOrderIds);

    const distributionData = [];

    wealthRecord.forEach((item) => {
      item.netAsset = this.calcNetAsset(item); // 净资产
      item.totalAsset = this.calcTotalAsset(item); // 总资产

      // 把出现过的类目放入数组
      item.wealthRecordItems.forEach((wealthRecordItem) => {
        if (!distributionData.map((distributionDataItem) => distributionDataItem.categoryId).includes(wealthRecordItem.categoryId)) {
          distributionData.push({
            categoryId: wealthRecordItem.categoryId,
            categoryType: categoryOrder.filter(categoryOrderItem => categoryOrderItem.id === wealthRecordItem.categoryId)[0].type,
            categoryName: categoryOrder.filter(categoryOrderItem => categoryOrderItem.id === wealthRecordItem.categoryId)[0].name,
            values: Array(wealthRecord.length).fill(0),
          });
        }
      });
    });

    wealthRecord.forEach((item, index) => {
      item.wealthRecordItems.forEach((wealthRecordItem) => {
        distributionData.filter(distributionDataItem => distributionDataItem.categoryId === wealthRecordItem.categoryId)[0].values[index] = parseFloat(wealthRecordItem.value);
      });
    });
    distributionData.sort((a, b) => { return categoryOrderIds.indexOf(a.categoryId) - categoryOrderIds.indexOf(b.categoryId); });
    console.log('render wealthRecord', wealthRecord);
    console.log('render distributionData', distributionData);


    return (
      <div>
        <Nav />
        <div className="page-wealth-wrap">
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
          <div>
            <div className="chart-title">资产分布</div>
            <Wline
              ref={line => this.line1 = line}
              event={this.event1}
              height="300"
              config={{
                padding: [40, 5, 24, 'auto'],
                spline: true,
                xAxis: {
                  type: 'time',
                  mask: 'YYYY-MM-DD',
                },
              }}
              data={distributionData.filter(item => item.categoryType === 'asset').map(distributionDataItem => ({
                name: `${distributionDataItem.categoryName}%`,
                data: distributionDataItem.values.map((value, index) => {
                  return [new Date(wealthRecord[index].date).valueOf(), (value / wealthRecord[index].totalAsset / 0.01).toFixed(2)];
                }),
              }))}
            />
            <div className="chart-title">资产总量</div>
            <Wline
              ref={line => this.line2 = line}
              event={this.event2}
              height="300"
              config={{
                padding: [40, 5, 24, 'auto'],
                spline: true,
                xAxis: {
                  type: 'time',
                  mask: 'YYYY-MM-DD',
                },
              }}
              data={[
                {
                  name: '总资产',
                  data: wealthRecord.map((item) => { return [new Date(item.date).valueOf(), item.totalAsset]; }),
                }, {
                  name: '净资产',
                  data: wealthRecord.map((item) => { return [new Date(item.date).valueOf(), item.netAsset]; }),
                },
              ]}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <div className="chart-title">资产明细</div>
              <Wpie
                height="300"
                config={{
                  cycle: true,
                }}
                data={[
                  {
                    name: '浏览器占比',
                    data: [
                      ['Firefox', 45.0],
                      ['IE', 26.8],
                      ['Chrome', 12.8],
                      ['Safari', 8.5],
                      ['Opera', 6.2],
                      ['Others', 0.7],
                    ],
                  },
                ]}
              />
            </div>
            <div style={{ width: '50%' }}>
              <div className="chart-title">负债明细</div>
              <Wpie
                height="300"
                config={{
                  cycle: true,
                }}
                data={[
                  {
                    name: '浏览器占比',
                    data: [
                      ['Firefox', 45.0],
                      ['IE', 26.8],
                      ['Chrome', 12.8],
                      ['Safari', 8.5],
                      ['Opera', 6.2],
                      ['Others', 0.7],
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Wealth);