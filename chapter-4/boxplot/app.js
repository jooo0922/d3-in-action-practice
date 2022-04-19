"use strict";

async function loadData() {
  const data = await d3.csv("boxplot.csv");
  return data;
}

function scatterplot(data) {
  // 일단  1 ~ 8일 (즉, 7일) 범위를 20 ~ 470 사이의 x좌표값으로 매핑하는 함수 리턴
  const xScale = d3.scaleLinear().domain([1, 8]).range([20, 470]);
  // 또 0살 ~ 100살 나이 범위를 480 ~ 20 사이의 y좌표값으로 매핑하는 함수 리턴
  // -> 매핑 범위를 거꾸로 잡아준 이유는 낮은 나이값이 아래에 놓이게 하려고 거꾸로 매핑한 것.
  const yScale = d3.scaleLinear().domain([0, 100]).range([480, 20]);

  // 축을 그리는 함수를 리턴받음.
  // .tickSize(-470) 으로 잡아준 이유는, 각각 top, right 에 위치하게 될 축이므로,
  // 거기서 470만큼 위쪽방향(-) 또는 왼쪽방향(-)으로 눈금을 늘려줘서 grid 를 그려주려는 것.
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues([1, 2, 3, 4, 5, 6, 7]) // .ticks() 이 눈금의 개수만 정하는 거라면, .tickValues() 는 배열을 받아서 눈금의 값들을 명시할 수 있도록 함.
    .tickSize(-470); // 눈금을 위쪽으로 470만큼 늘림
  const yAxis = d3.axisRight().scale(yScale).ticks(8).tickSize(-470); // 눈금을 왼쪽으로 470만큼 늘림.

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(470, 0)") // 눈금을 왼쪽(-)으로 470 만큼 늘려줬으니, y축 요소 전체가 담긴 <g>를 오른쪽으로 470만큼 이동
    .attr("id", "yAxisG")
    .call(yAxis);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(0, 480)") // 눈금을 위쪽(-)으로 470만큼 늘려줬으니, x축 요소 전체가 담긴 <g>를 아래쪽으로 480만큼 이동
    .attr("id", "xAxisG")
    .call(xAxis);

  d3.select("svg")
    .selectAll("circle.medium")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "tweets")
    .attr("r", 5)
    .attr("cx", (d) => xScale(d.day)) // x좌표값 매핑 함수에 바인딩된 데이터의 day값(1 ~ 7)을 넣어서 값을 매핑받음
    .attr("cy", (d) => yScale(d.median)) // y좌표값 매핑 함수에 바인딩된 데이터의 median값(0 ~ 100살)을 넣어서 값을 매핑받음.
    .style("fill", "darkgray");
}

loadData().then((data) => scatterplot(data));
