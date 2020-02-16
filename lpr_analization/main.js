console.log('loanBaseRate1Y',window.loanBaseRate1Y);
const dom = document.getElementById('container');
const myChart = echarts.init(dom);
const app = {};
option = null;
option = {
  title: {
    text: '折线图堆叠',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['贷款基准利率1Y', '贷款基准利率5Y'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'time',
    boundaryGap: false,
    // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '贷款基准利率1Y',
      type: 'line',
      smooth: true,
      data: window.loanBaseRate1Y,
    }, {
      name: '贷款基准利率5Y',
      type: 'line',
      smooth: true,
      data: window.loanBaseRate5Y,
    },
    {
      name: 'FED利率',
      type: 'line',
      smooth: true,
      data: window.fedRate,
    },
  ],
};

if (option && typeof option === 'object') {
  myChart.setOption(option, true);
}
