const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 }
];
const chart = new G2.Chart({
  container: 'c1',
  width : 600,
  height : 300
});
chart.source(data);
chart.interval().position('genre*sold').color('genre')
chart.render();

const chart2 = new G2.Chart({
  container: 'c2',
  width : 600,
  height : 300
});
chart2.source(data);
chart2.interval().position('genre*sold').color('genre')
chart2.render();

// 线表联动
chart.on('plotmove', ev => {
  chart2.showTooltip(ev);
});

chart2.on('plotmove', ev => {
  chart.showTooltip(ev);
});
