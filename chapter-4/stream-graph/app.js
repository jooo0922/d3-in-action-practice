"use strict";

async function loadData() {
  const data = await d3.csv("movies.csv");
  return data;
}

function streamGraph(data) {
  // 일단 항상 d3.scaleLinear() 로 매핑함수부터 만들어놓는 것부터 시작할 것
  const xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
  const yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);

  // x축 그리는 함수 생성
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .tickSize(480);

  // y축 그리는 함수 생성
  const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480);

  // 위에서 만든 축 생성 함수를 호출해서 각각 x, y축 생성해서 <g> 요소에 달아줌.
  d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
  d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

  // data[0] 에 존재하는 각각의 데이터 열을 for...in 루프로 돌림
  // console.log(data[0]) // 얘는 csv 데이터의 첫 번째 행. 즉, 첫째날의 영화별 매출액 데이터가 담겨있겠지
  // 이거는 굳이 첫째날 데이터로 안해도 되고 둘째날, 셋째날 등 다 됨. 중요한 건
  // for in 루프에서 사용할 key값(즉, 각 영화 key값들) 을 가져오기 위해 사용하고 있는 객체인 것!
  for (const key in data[0]) {
    // key 값이 'day' 인 데이터열을 제외한 나머지 데이터열, 즉 각 6개의 영화에 대한 데이터열에 대해서만 선 생성기를 만듦.
    if (key !== "day") {
      // 각 영화의 매출액 및 날짜를 받아 매핑된 좌표값으로 변환해서 선을 그리는 선 생성기 함수를 만듦.
      const movieArea = d3
        .line()
        .x(function (d) {
          return xScale(d.day);
        })
        .y(function (d) {
          return yScale(d[key]); // 각 영화별 선 생성기의 y좌표값 접근자는 각 영화별 매출액 데이터 d[key]를 매핑해서 리턴해 줌.
        })
        .curve(d3.curveCardinal); // 선을 cardinal 모드로 보간시킴 -> 곡선으로 나오겠군

      d3.select("svg")
        .append("path")
        .attr("id", `${key}Area`)
        .attr("d", movieArea(data))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .style("opacity", 0.75);
    }
  }
}

loadData().then((data) => {
  streamGraph(data);
});
