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
    .data(incomingData, (d) => {
      // 이런 식으로, 데이터 객체를 JSON.stringfy() 를 이용해 문자열로 변환하면,
      // 문자열을 바인딩 키로 직접 설정해서 사용할 수 있음.
      // 이렇게 하면 그냥 index 순으로 데이터가 바인딩되는 게 아니라,
      // 어떤 의미있는 바인딩 키값에 맞게 요소와 데이터를 바인딩시킴.
      // 일단 여기서는 딱히 고유한 의미는 없고, 전체 데이터 객체를 문자열화 시켜서
      // 각 요소의 __data__ 속성값에 바인딩 키를 할당해놨다고 보면 됨
      return JSON.stringify(d);
    })
    .enter() // 바인딩한 데이터보다 개수가 많으면 그만큼 요소들을 들여오고, 어떻게 들여올 지 이후에 정의함.
    .append("circle") // 산포도니까 <circle> 요소를 추가함.
    .attr("r", (d) => radiusScale(d.impact)) // 반지름값으로 정규화된 트윗 영향력값을 circle의 r값으로 지정
    .attr("cx", (d) => timeRamp(d.tweetTime)) // x축 좌표값으로 정규화된 트윗시각값을 circle의 x축 좌표값으로 지정
    .attr("cy", (d) => 480 - yScale(d.impact)) // y축 좌표값으로 정규화된 트윗 영향력값을 480(svg가 500이니까 바닥에 20px만큼 간격을 띄우겠지)에서 뺀 뒤 y축 값으로 지정
    .style("fill", (d) => colorScale(d.impact)) // 컬러코드로 정규화된 트윗 영향력값을 circle의 색상값으로 지정
    .style("stroke", "black")
    .style("stroke-width", "1px");

  // 이제 exit할 요소를 제외한 새로운 데이터 바인딩에 필요한
  // 바인딩 키 값을 커스텀으로 설정하기 위해,
  // 특정 의미를 갖는 데이터 객체들 (즉, 여기서는, el.impact(트윗 영향력값)이 0보다 큰 데이터 객체들)만
  // filter 해서 모아둠
  const filteredData = incomingData.filter((el) => el.impact > 0);

  d3.selectAll("circle")
    .data(filteredData, (d) => {
      // 이제 여기서 직접 만든 바인딩 키는 '어떤 의미를 갖는다' 고 보면 됨.
      // 즉, el.impact(트윗 영향력값)이 0보다 큰 데이터 객체들만 가져와서
      // 바인딩 키를 만들고, 그거를 circle의 __data__ 에 바인딩을 해준 것이기 때문에,
      // 지금 filteredData에서 만든 문자열 키값이 __data__ 에 저장되어있지 않은 <circle> 요소들,
      // 그러니까, 트윗 영향력값이 0인 바인딩 키값을 갖고 있는 <circle> 들이
      // 새로운 데이터 바인딩에서 제외되기 때문에, exit()의 대상이 되서 제거되는 것임!
      return JSON.stringify(d);
    })
    .exit()
    .remove();
}

d3.json("tweets.json").then((data) => {
  // 참고로, json으로 받은 데이터는 배열이 아니므로, .tweets 로 접근해야 배열 데이터값을 올바르게 전달할 수 있음.
  dataViz(data.tweets);
});

/**
 * 바인딩 키를 통해 선택적으로 새로운 데이터바인딩 및 요소 exit() 및 제거
 *
 * 이전 예제에서는
 * 새로운 데이터를 바인딩해서 exit() 할 때,
 * 그냥 index 순서대로 바인딩된 애들 제외한
 * 나머지 애들은 그냥 다 remove() 되었지.
 *
 * 그런데, 어떤 특정 조건의, 특정 의미를 갖는 애들만
 * 남기고 나머지를 다 제거하고 싶다면?
 *
 *
 * 이럴 때 사용하는 게 '바인딩 키' 임.
 *
 *
 * 바인딩 키는 data(바인딩할 데이터, 콜백함수) 메서드의
 * 두 번째 인자인 콜백함수에서 설정할 수 있음.
 *
 * 일단 요소를 enter() 하거나 추가시킬 때
 * 모든 요소에 JSON.stringfy(data) 를 이용해서
 * 문자열로 변경된 바인딩 키를 할당해 줌.
 *
 *
 * 그리고 나서, 나중에 exit() 이 필요한 상황이 오면,
 * 최초바인딩데이터.filter() 를 사용해서
 * 특정 조건에 부합하는 데이터만
 * const 새롭게바인딩할데이터 에 할당해 놓도록 함.
 *
 *
 * 그 다음, 데이터를 새롭게 바인딩하는 단계에서
 * .data(새롭게 바인딩할 데이터, 콜백함수) 의
 * 콜백함수에서 다시 JSON.stringfy(data) 를 이용해서
 * 조건에 부합하는 데이터들만 문자열로 변환해서 새롭게 바인딩함!
 *
 * 즉, 선택적인 바인딩이 가능해진 것!
 *
 * 따라서, 조건에 부합하지 않는 바인딩 키를 갖고 있던
 * DOM 요소들은 exit() 대상으로 넘어가서
 * remove() 호출하면 바로 제거되는 원리인 것!
 *
 *
 * 주의! 항상 accessor(접근자 함수) 내에서
 * stringify된 문자열을 'return' 해줘야 됨!
 * 리턴을 안해주면 아무 의미가 없음
 */
