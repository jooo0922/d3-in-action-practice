"use strict";

/**
 * d3 v4 이하 버전에서 .csv 데이터를 배열로 로드하기
 *
 * async/await 를 이용해서 비동기로
 * 데이터를 모두 가져올 때까지 기다린 뒤,
 *
 * 다 가져오면 .then() 으로 프라미스 체이닝을
 * 연결하여 배열에 담긴 데이터를 전달받을 수 있음.
 */
async function loadData() {
  const data = await d3.csv("worldcup.csv");
  return data;
}

function createSoccerViz() {
  loadData().then((data) => overallTeamViz(data));

  function overallTeamViz(incomingData) {
    d3.select("svg")
      .append("g") // <svg> 화폭에 <g> 요소 하나 생성
      .attr("id", "teamsG") // teamsG 라는 id값을 갖는, 하위에 나라별 <g> 요소들을 포함하는 전체 <g> 요소를 만든 것임.
      .attr("transform", "translate(50, 300)") // 전체 <g> 요소를 화폭의 가운데 쪽으로 옮김
      .selectAll("g") // 이 teamsG 안에는 별도의 <g> 요소는 없으니 빈 셀렉션을 받게 됨.
      .data(incomingData) // 로드한 csv 데이터 바인딩
      .enter() // 로드한 csv 데이터가 당연히 빈 셀렉션보다 개수가 많으니, 그만큼 enter 할 요소를 어떻게 들여올 것인지 다음 메서드에서 정의함.
      .append("g") // 각 데이터별로 <g> 요소를 새로 만들고
      .attr("class", "overallG") // id값은 'overallG' 라고 붙임.
      .attr("transform", function (d, i) {
        return `translate(${i * 50}, 0)`;
      }); // i값은 바인딩된 데이터 배열의 인덱스이므로, <g> 요소마다 x축을 기준으로 50px 씩 이동함

    const teamG = d3.selectAll("g.overallG"); // 위에서 만든 데이터별 <g> 요소들(즉, teamsG 의 자식노드인 <g> 요소들)을 모두 셀렉션함.

    // 각각의 <g> 요소에 <circle> 생성해 줌.
    teamG
      .append("circle")
      .attr("r", 20)
      .style("fill", "pink")
      .style("stroke", "black")
      .style("stroke-width", "1px");

    // 각각의 <g> 요소에 label이 될 <text> 를 달아줌
    teamG
      .append("text")
      .style("text-anchor", "middle") // <text> 는 기본 anchor가 텍스트 시작위치(맨 왼쪽)에 놓이므로, 이 anchor값을 가운데('middle')로 변경한 것. p.113 참고.
      .attr("y", 30)
      .style("font-size", "10px")
      .text((d) => d.team);
  }
}
