import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { Wline, Wpie } from '@alife/aisc-widgets';

const data = [
  {
    name: '机房1',
    data: [[1483372800000, 1892], [1483459200000, 7292], [1483545600000, 5714], [1483632000000, 5354], [1483718400000, 2014], [1483804800000, 22], [1483891200000, 11023], [1483977600000, 5218], [1484064000000, 8759], [1484150400000, 9981], [1484236800000, 4533], [1484323200000, 11398], [1484409600000, 1064], [1484496000000, 6494]],
  }, {
    name: '机房2',
    data: [[1483372800000, 11751], [1483459200000, 4078], [1483545600000, 2175], [1483632000000, 12048], [1483718400000, 1748], [1483804800000, 10494], [1483891200000, 9597], [1483977600000, 4788], [1484064000000, 2085], [1484150400000, 492], [1484236800000, 2965], [1484323200000, 4246], [1484409600000, 2160], [1484496000000, 11877]],
  },
];

const options = {
  padding: [40, 5, 24, 44],
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD',
  },
};

class Wealth extends Component {
  static propTypes = {
  };

  static defaultProps = {
    breadcrumb: [],
  };

  componentDidMount() {}

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
                xAxis: {
                  type: 'time',
                  mask: 'YYYY-MM-DD',
                },
              }}
              data={data}
            />
            <div className="chart-title">资产总量</div>
            <Wline
              ref={line => this.line2 = line}
              event={this.event2}
              height="300"
              config={{
                padding: [40, 5, 24, 'auto'],
                xAxis: {
                  type: 'time',
                  mask: 'YYYY-MM-DD',
                },
              }}
              data={data}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <div className="chart-title">资产明细</div>
              <Wpie
                height="300"
                config={{}}
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
                config={{}}
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
