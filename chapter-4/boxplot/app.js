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

  // 박스 플롯 생성
  d3.select("svg")
    .selectAll("g.box")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "box")
    .attr("transform", function (d) {
      return `translate(${xScale(d.day)}, ${yScale(d.median)})`;
    })
    .each(function (d, i) {
      // console.log(this); 현재 box 클래스를 갖는 <g> 요소에 대해 .each() 를 해주는거니까 this 는 'g.box' 로 받겠지.
      // 이런 식으로 선택된 각 요소들에 대해 복잡한 연산을 추가수행해야 하는 경우 .selecrAll() 대신 .each() 를 쓰는 게 좋음.
      d3.select(this)
        .append("rect")
        .attr("width", 20)
        .attr("x", -10) // 직사각형을 <circle> 의 가운데에 넣으려면 직사각형 width 의 절반만큼 x좌표값을 왼쪽으로 이동시켜줘야 함
        .attr("height", yScale(d.q1) - yScale(d.q3))
        .attr("y", yScale(d.q3) - yScale(d.median)) // 높이값이 1사분위수와 3사분위수의 차이값이므로, 'g.box' 를 <circle> 이 가운데에 있도록 맞추려면 높이값의 절반길이인 '3사분위 - 중앙값' 만큼 올려줘야 함.
        .style("fill", "white")
        .style("stroke", "black");
    });
}

loadData().then((data) => scatterplot(data));
