"use strict";

/**
 * d3.max(iterable[, accessor])
 *
 * 이 메서드는 반복가능한 이터러블 객체로부터
 * 최대값을 찾아 리턴해 줌.
 *
 * 이때, accessor 익명함수를 옵션으로 전달할 수 있는데,
 * 이거는 Array.from() 에서 사용하는 맵핑함수처럼
 * 이터러블의 요소들을 인자를 받아 가공하고, 가공된 값을 리턴하여
 * 새로운 이터러블 배열을 만들어 줌.
 *
 * 그러면 d3.max() 가 가공된 새로운 이터러블을 가지고
 * 그 안에서 최댓값을 찾아 리턴해 줌!
 */

function dataViz(incomingData) {
  const maxPopulation = d3.max(incomingData, function (el) {
    // cities.csv 에서 population 값은 string으로 되어있으니
    // 그거를 parseInt()를 이용해서 정수값으로 변환한 것!
    return parseInt(el.population);
  });

  // d3.max() 로 구한 데이터의 최댓값으로 도메인을 정의하고, d3.scaleLinear() 로 데이터를 정규화함.
  const yScale = d3.scaleLinear().domain([0, maxPopulation]).range([0, 460]);

  // svg가 담길 화폭의 사이즈를 css 말고 d3로 바로 지정해버림.
  // 데이터를 460까지 정규화하고, 바닥에서 20px, 천장에서 20px 정도 막대그래프들을 띄워두기 위해 500으로 높이값을 잡은 것.
  d3.select("svg").attr(
    "style",
    "height: 500px; width: 600px; border: 1px solid gray"
  );

  d3.select("svg")
    .selectAll("rect") // 현재 <svg> 는 비어있으므로 빈 셀렉션을 얻게 됨
    .data(incomingData)
    .enter() // 바인딩한 데이터 개수가 빈 셀렉션보다 많을테니 그만큼 새로 들어올 요소들에 대해 정의함
    .append("rect") // <rect> 추가
    .attr("width", 50) // width는 50px
    .attr("height", function (d) {
      return yScale(parseInt(d.population));
    }) // height은 바인딩한 데이터의 population 속성값(문자열)을 정수로 변환한 뒤, 0 ~ 460 사이의 값으로 정규화해서 적용!
    .attr("x", function (d, i) {
      return i * 60;
    }) // rect의 width는 50px 인데 60px 마다 새워두면 10px 의 간격이 생기겠지?
    .attr("y", function (d) {
      // svg 전체 높이는 500이고, 데이터값 정규화 범위는 0 ~ 460 이라면,
      // 바닥 20px을 뺀 480에서 정규화된 데이터를 빼줘야 천장에 20px 정도의 여유간격이 생김.
      return 480 - yScale(parseInt(d.population));
    })
    .style("fill", "blue")
    .style("stroke", "red")
    .style("stroke-width", "1px")
    .style("opacity", 0.25);
}

async function loadData() {
  const data = await d3.csv("cities.csv");
  return data;
}

loadData().then(function (data) {
  dataViz(data);
});

/**
 * csv 를 배열 형태로 가져오는 방법
 *
 * d3 v4 이하 버전에서 하는 것 처럼
 * csv를 배열 형태로 가져오고 싶다면,
 *
 * async/await 를 이용해서 비동기로
 * 데이터를 모두 가져올 때까지 기다린 뒤,
 * 다 가져오면 .then() 으로 프라미스 체이닝을
 * 연결하여 배열에 담긴 데이터를 전달받을 수 있음.
 *
 * 또는, d3-fetch 라고 하는
 * 별도의 라이브러리를 사용하는 방법도 있음!
 */
