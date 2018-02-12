import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Tooltip, Menu, Dropdown,
} from 'antd';
import numeral from 'numeral';
import { Chart, Geom, Axis, Legend, Tooltip as G2Tooltip } from 'bizcharts';

import {
  ChartCard,
  yuan,
  Field,
} from '../../components/Charts';
import styles from './Dashboard.less';

const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Analysis extends Component {
  state = {};

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  // 设置图表联动
  registerChartToConnect = (newChart) => {
    if (!window.chartList || !window.chartList.length || window.chartList.length === 0) {
      window.chartList = [newChart];
      return;
    }
    window.chartList.push(newChart);
    for (const chartSrc of window.chartList) {
      for (const chartDest of window.chartList) {
        if (chartSrc !== chartDest && !chartSrc.destroyed && !chartDest.destroyed) {
          chartSrc.on('plotmove', (e) => {
            chartSrc.showTooltip(e);
            chartDest.showTooltip(e);
          });
          chartSrc.on('plotleave', () => {
            chartDest.hideTooltip();
          });
        }
      }
    }
  }

  render() {
    const { loading } = this.props;

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item11111111111111111111111</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item222222222222222222222222</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item33333333</a>
        </Menu.Item>
      </Menu>
    );

    const dropDownMenu = (
      <Dropdown overlay={menu}>
        <span>基金名称 <Icon type="down" /></span>
      </Dropdown>
    );


    // 数据源
    const data = [
      { genre: 'Sports', sold: 275, income: 2300 },
      { genre: 'Strategy', sold: 115, income: 667 },
      { genre: 'Action', sold: 120, income: 982 },
      { genre: 'Shooter', sold: 350, income: 5271 },
      { genre: 'Other', sold: 150, income: 3710 },
    ];

    // 定义度量
    const cols = {
      sold: { alias: '销售量' },
      genre: { alias: '游戏种类' },
    };


    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="总市值"
              action={
                <Tooltip title="所有持仓基金市值之和">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={yuan(126560)}
              footer={<Field label="总成本" value={`￥${numeral(12423).format('0,0')}`} />}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="持仓利润"
              action={
                <Tooltip title="所有持仓基金的盈利之和">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`￥${numeral(8846).format('0,0')}`}
              footer={<Field label="持仓利润率" value={`${numeral(34).format('0,0')}%`} />}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="基金数量"
              action={
                <Tooltip title="所有持仓基金的数量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(12).format('0,0')}
              footer={<Field label="盈利基金数量" value="7" />}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="今日应投资总额"
              action={
                <Tooltip title="今日应投资总额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={`￥${numeral(18846).format('0,0')}`}
              footer={<Field label="其中亏损加仓总额" value={`￥${numeral(8846).format('0,0')}`} />}
              contentHeight={46}
            />
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs
              tabBarExtraContent={dropDownMenu}
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane tab="盈利趋势分析" key="sales">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Chart
                        forceFit="true"
                        height={400}
                        data={data}
                        scale={cols}
                        onGetG2Instance={(g2Chart) => {
                          this.registerChartToConnect(g2Chart);
                        }}
                      >
                        <Axis name="genre" />
                        <Axis name="sold" />
                        <Legend position="top" dy={-20} />
                        <G2Tooltip />
                        <Geom type="interval" position="genre*sold" color="genre" />
                      </Chart>
                      <Chart
                        forceFit="true"
                        height={400}
                        data={data}
                        scale={cols}
                        onGetG2Instance={(g2Chart) => {
                          this.registerChartToConnect(g2Chart);
                        }}
                      >
                        <Axis name="genre" />
                        <Axis name="sold" />
                        <Legend position="top" dy={-20} />
                        <G2Tooltip />
                        <Geom type="interval" position="genre*sold" color="genre" />
                      </Chart>
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <ul className={styles.rankingList}>
                        <li><span>最高收益率/年化收益率</span><span>{`${-12.1}% / ${-12.1}%`}</span></li>
                        <li><span>最低收益率/年化收益率</span><span>{`${-12.1}% / ${-12.1}%`}</span></li>
                        <li><span>当前收益率/年化收益率</span><span>{`${-12.1}% / ${-12.1}%`}</span></li>
                        <li><span>实时交易中</span><span>是</span></li>
                        <li><span>实时涨幅</span><span>{`${12}%`}</span></li>
                        <li><span>实时收益率/年化收益率</span><span>{`${-12.1}% / ${-12.1}%`}</span></li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    );
  }
}
