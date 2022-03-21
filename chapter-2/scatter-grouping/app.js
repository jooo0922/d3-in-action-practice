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

  // 각 트윗 객체 데이터를 <circle> 대신 <g> 요소 셀렉션에 바인딩해서, circle과 label을 각각의 <g>의 자식노드로 달아줄거임.
  const tweetG = d3
    .select("svg")
    .selectAll("g") // 현재 <g> 요소는 없으니 비어있는 셀렉션을 받음
    .data(incomingData)
    .enter() // 바인딩한 데이터보다 개수가 많으면 그만큼 요소들을 들여오고, 어떻게 들여올 지 이후에 정의함.
    .append("g") // <g> 요소를 바인딩한 데이터 개수만큼 추가함.
    .attr(
      // <g> 요소를 움직이고 싶으면 transform 속성값을 변경해야 함. p.46 참고.
      "transform",
      (d) => `translate(${timeRamp(d.tweetTime)}, ${480 - yScale(d.impact)})`
      // x좌표값으로 정규화된 트윗시각값과 y좌표값으로 정규화된 트윗영향력값을 각각 translate(x, y) 에 대신 할당함.
    );

  // 이제 tweetG는 enter() 에 의해 새로 생성된 <g> 요소들 셀렉션이므로,
  // 별도로 셀렉션을 다시 지정할 필요 없이 바로 자식요소들을 append() 하면 됨.
  // 또한, 여기서부터 사용되는 accessor 함수의 d값은 부모요소인 <g> 에 바인딩된 데이터 incomingData 를 상속받아서 동일하게 가리킴
  tweetG
    .append("circle")
    .attr("r", (d) => radiusScale(d.impact)) // 반지름값으로 정규화된 트윗 영향력값을 circle의 r값으로 지정
    .style("fill", (d) => colorScale(d.impact)) // 컬러코드로 정규화된 트윗 영향력값을 circle의 색상값으로 지정
    .style("stroke", "black")
    .style("stroke-width", "1px");
  // <g> 요소를 transform 으로 움직여줬으니 circle은 별도로 좌표값을 지정해줄 필요가 없음.

  // 트윗객체 데이터의 user 속성값과 Date 객체에서 '시'에 해당하는 값만 빼와서 <text>에 입력하여 달아줌.
  tweetG.append("text").text((d) => `${d.user}-${d.tweetTime.getHours()}`);

  /**
   * exit()
   *
   * enter() 메서드와 반대로
   * DOM 요소가 바인딩된 데이터보다 개수가 많을 때
   * 남는 DOM 요소를 어떻게 없앨지 이후 메서드 체이닝에서 정의함.
   *
   * enter().append('추가할 요소') 이런식으로
   * DOM 요소를 추가하는 것처럼,
   *
   * exit().remove() 메서드를 통해 데이터 바인딩 후
   * 개수가 남는 DOM 요소를 제거함.
   */
  d3.selectAll("g").data([1, 2, 3, 4]).exit().remove();

  d3.selectAll("g")
    .select("text")
    .text((d) => d);

  // selection.each(콜백함수) 는
  // 선택된 모든 셀렉션 요소를 파라미터로 전달받아 콜백함수를 실행시키는 메서드
  d3.selectAll("g").each((d) => console.log(d)); // 얘는 데이터를 새로 바인딩했으므로, 새로 바인딩된 데이터가 출력됨
  d3.selectAll("text").each((d) => console.log(d)); // 얘도 새로 바인딩된 데이터를 부모 <g>에서 상속받아 사용했으므로, 새로 바인딩된 데이터가 출력됨.
  d3.selectAll("circle").each((d) => console.log(d)); // 얘는 새로 바인딩된 데이터로 뭘 갱신하지 않았으므로, 이전에 바인딩된 데이터가 출력됨.
}

d3.json("tweets.json").then((data) => {
  // 참고로, json으로 받은 데이터는 배열이 아니므로, .tweets 로 접근해야 배열 데이터값을 올바르게 전달할 수 있음.
  dataViz(data.tweets);
});

/**
 * 참고로 <text> 는 anchor 가
 * 텍스트 시작 위치에 놓임.
 *
 * 따라서, 텍스트 초기 위치는 오른쪽에 출력됨.
 *
 * 이걸 바꾸고 싶으면,
 * 'text-anchor' 스타일을 'end' 나 'middle' 로 변경할 것.
 *
 * p.113 참고!
 */
