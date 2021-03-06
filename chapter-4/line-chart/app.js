"use strict";

async function loadData() {
  const data = await d3.csv("tweetdata.csv");
  return data;
}

function lineChart(data) {
  // 일단 항상 d3.scaleLinear() 로 매핑함수부터 만들어놓는 것부터 시작할 것
  const xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]); // 얘는 1일부터 10일까지 날짜범위를 매핑하는 함수 (10.5로 한건 그래프 x축에 여유간격을 띄워주기 위함인 듯.)
  const yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]); // 얘는 최소데이터 0부터 최대데이터 35까지의 범위를 매핑하는 함수 (y축은 아래로 갈수록 값이 크니 거꾸로 매핑한 것.)

  // x축 그리는 함수 생성
  const xAxis = d3
    .axisBottom()
    .scale(xScale) // 이 매핑함수가 매핑해주는 범위만큼을 x축으로 표시함.
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) // 배열로 x축 눈금의 값들을 받아 명시
    .tickSize(480); // 눈금을 위쪽으로 480만큼 늘려서 grid 를 그려줌

  // y축 그리는 함수 생성
  const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480);

  // 위에서 만든 축 생성 함수를 호출해서 각각 x, y축 생성해서 <g> 요소에 달아줌.
  d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
  d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

  // 날짜별 트윗수 산포도 그리기
  d3.select("svg")
    .selectAll("circle.tweets")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "tweets")
    .attr("r", 5)
    .attr("cx", function (d) {
      return xScale(d.day);
    })
    .attr("cy", function (d) {
      return yScale(d.tweets); // y좌표값을 각 데이터의 트윗수를 매핑함수 yScale()에 돌려서 구함.
    })
    .style("fill", "black");

  // 날짜별 리트윗수 산포도 그리기
  d3.select("svg")
    .selectAll("circle.retweets")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "retweets")
    .attr("r", 5)
    .attr("cx", function (d) {
      return xScale(d.day);
    })
    .attr("cy", function (d) {
      return yScale(d.retweets); // y좌표값을 각 데이터의 리트윗수를 매핑함수 yScale()에 돌려서 구함.
    })
    .style("fill", "lightgray");

  // 날짜별 좋아요수 산포도 그리기
  d3.select("svg")
    .selectAll("circle.favorites")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "favorites")
    .attr("r", 5)
    .attr("cx", function (d) {
      return xScale(d.day);
    })
    .attr("cy", function (d) {
      return yScale(d.favorites); // y좌표값을 각 데이터의 리트윗수를 매핑함수 yScale()에 돌려서 구함.
    })
    .style("fill", "gray");

  // 트윗수 및 날짜를 받아 매핑된 좌표값으로 변환해서 선을 그리는 선 생성기 함수를 만듦.
  const tweetLine = d3
    .line()
    .x(function (d) {
      return xScale(d.day);
    })
    .y(function (d) {
      return yScale(d.tweets);
    }) // .x(), .y() 는 각각 선 생성기가 그리는 path의 d 속성을 정의할 때 사용할 x, y좌표값을 리턴해주는 접근자 함수를 인자로 받음.
    .curve(d3.curveCardinal);

  // 리트윗수 및 날짜를 받아 매핑된 좌표값으로 변환해서 선을 그리는 선 생성기 함수를 만듦.
  const retweetLine = d3
    .line()
    .x(function (d) {
      return xScale(d.day);
    })
    .y(function (d) {
      return yScale(d.retweets);
    }) // .x(), .y() 는 각각 선 생성기가 그리는 path의 d 속성을 정의할 때 사용할 x, y좌표값을 리턴해주는 접근자 함수를 인자로 받음.
    .curve(d3.curveBasis);

  // 좋아요수 및 날짜를 받아 매핑된 좌표값으로 변환해서 선을 그리는 선 생성기 함수를 만듦.
  const favLine = d3
    .line()
    .x(function (d) {
      return xScale(d.day);
    })
    .y(function (d) {
      return yScale(d.favorites);
    }) // .x(), .y() 는 각각 선 생성기가 그리는 path의 d 속성을 정의할 때 사용할 x, y좌표값을 리턴해주는 접근자 함수를 인자로 받음.
    .curve(d3.curveStepBefore);

  // 각 선마다 path 요소를 svg 에 추가하고, 위에서 만든 선 생성기 함수에 바인딩된 데이터를 넘겨줘서 path 요소의 d 속성값을 결정함.
  d3.select("svg")
    .append("path")
    .attr("d", tweetLine(data))
    .attr("fill", "none")
    .attr("stroke", "darkred")
    .attr("stroke-width", 2);

  d3.select("svg")
    .append("path")
    .attr("d", retweetLine(data))
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("stroke-width", 2);

  d3.select("svg")
    .append("path")
    .attr("d", favLine(data))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2);
}

loadData().then((data) => lineChart(data));

/**
 * 박스 플롯을 그릴때와 다르게,
 * 축 생성 함수 만들 때 tickSize 를 음수가 아닌 양수값으로 주고 있음.
 *
 * 왜냐하면, 박스플롯에서는 축 요소를 포함하는 <g> 요소를
 * transform: translate(470, 0) 이런 식으로
 * 반대방향으로 축을 눈금길이만큼 이동시켰던 것임.
 *
 * 반면, 여기서는 transform 을 안쓰고 있으니까
 * 그냥 양수값으로 tickSize() 를 넘겨줘도 grid 가 제대로 그려지는 것.
 */

/**
 * 사실 선 생성기를 3개 씩이나 만들지 않고,
 * 하나의 선 생성기를 만들어서 .y() 에 들어갈 y좌표값 접근자만
 * 바꿔서 돌려쓰면 더 효율적으로 구현이 가능함.
 *
 * 그러나, 이 예제에서는 각 선을 그리는 코드를 더 알아보기 쉽도록 하려고
 * 일부러 그리는 선마다 생성기 코드를 짜줬다고 함.
 */

/**
 * 선 보간법 사용 시 주의사항
 *
 * 메서드가 많이 바뀜.
 * .interpolate() -> .curve() 로 해줘야 하고,
 *
 * 'cardinal' -> d3.curveCardinal 로 해줘야 함.
 */
