"use strict";

function dataViz(incomingData) {
  // 각 트윗 객채별로 영향력과 시각 데이터를 계산한 뒤, .impact, .tweetTime 속성을 새로 만들어 넣어줌
  incomingData.forEach((el) => {
    // 각 트윗별 산포도의 y축 (트윗 영향력 = favorites + retweets) 계산
    el.impact = el.favorites.length + el.retweets.length;

    // 각 트윗별 산포도의 x축 (트윗 시각) 계산
    // ISO 8906 표준 날짜 문자열을 전달하여 Data 객체 생성
    el.tweetTime = new Date(el.timestamp);
  });

  // d3.max() 함수를 이용해서, 각 트윗객체.impact 값을 기준으로 최댓값을 찾아서 리턴해 줌.
  const maxImpact = d3.max(incomingData, (el) => el.impact);
  // d3.extent() 함수를 이용해서, 각 트윗객체.tweetTime 기준으로 [최솟값, 최댓값] 형태의 배열을 리턴해 줌.
  const startEnd = d3.extent(incomingData, (el) => el.tweetTime);

  // d3.scaleTime() 메서드를 이용해서, Date 객체의 [최솟값, 최댓값] 범위 내의 값(트윗시각)들을 x축 좌표값으로 정규화하는 함수 리턴.
  // 책에서는 d3.time().scale() 을 사용하지만, 버전 업데이트 이후 d3.scaleTime() 으로 변경되었음.
  const timeRamp = d3.scaleTime().domain(startEnd).range([20, 480]);
  // d3.scaleLinear() 메서드를 이용해서, 트윗 영향력 값들을 y축 좌표값으로 정규화하는 함수 리턴.
  const yScale = d3.scaleLinear().domain([0, maxImpact]).range([0, 460]);
  // d3.scaleLinear() 메서드를 이용해서, 트윗 영향력 값들을 원의 반지름값으로 정규화하는 함수 리턴.
  const radiusScale = d3.scaleLinear().domain([0, maxImpact]).range([1, 20]);
  // d3.scaleLinear() 메서드를 이용해서, 트윗 영향력 값들을 흰색 ~ 빨강색 사이의 Hex 컬러코드 값으로 정규화하는 함수 리턴.
  const colorScale = d3
    .scaleLinear()
    .domain([0, maxImpact])
    .range(["#ffffff", "#990000"]);

  d3.select("svg").attr(
    "style",
    "width: 500px; height: 500px; border: 1px solid gray"
  ); // svg 를 담는 화폭의 사이즈를 d3 로 조정함.
  d3.select("svg")
    .selectAll("circle") // 현재 <circle> 요소는 없으니 비어있는 셀렉션을 받음
    .data(incomingData)
    .enter() // 바인딩한 데이터보다 개수가 많으면 그만큼 요소들을 들여오고, 어떻게 들여올 지 이후에 정의함.
    .append("circle") // 산포도니까 <circle> 요소를 추가함.
    .attr("r", (d) => radiusScale(d.impact)) // 반지름값으로 정규화된 트윗 영향력값을 circle의 r값으로 지정
    .attr("cx", (d) => timeRamp(d.tweetTime)) // x축 좌표값으로 정규화된 트윗시각값을 circle의 x축 좌표값으로 지정
    .attr("cy", (d) => 480 - yScale(d.impact)) // y축 좌표값으로 정규화된 트윗 영향력값을 480(svg가 500이니까 바닥에 20px만큼 간격을 띄우겠지)에서 뺀 뒤 y축 값으로 지정
    .style("fill", (d) => colorScale(d.impact)) // 컬러코드로 정규화된 트윗 영향력값을 circle의 색상값으로 지정
    .style("stroke", "black")
    .style("stroke-width", "1px");
}

d3.json("tweets.json").then((data) => {
  // 참고로, json으로 받은 데이터는 배열이 아니므로, .tweets 로 접근해야 배열 데이터값을 올바르게 전달할 수 있음.
  dataViz(data.tweets);
});
