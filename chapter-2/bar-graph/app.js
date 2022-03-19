"use strict";

d3.select("svg")
  .selectAll("rect")
  .data([15, 50, 22, 8, 100, 10])
  .enter() // 바인딩된 데이터 개수가 더 많으니, '들어올(enter)' 요소에 대해서 어떻게 처리할 지 정해줘야 함.
  .append("rect") // <rect> 요소를 enter 할 요소 개수만큼 추가해 줌.
  .attr("width", 10) // <rect> 의 너비를 10으로 동일하게 지정
  .attr("height", function (d) {
    // 인라인 접근자 함수(익명함수)를 통해 바인딩된 데이터 배열의 값들을
    // 각각 받아서 <rect>의 height 값으로 지정해 줌.
    return d;
  })
  .style("fill", "blue")
  .style("stroke", "red")
  .style("stroke-width", "1px")
  .style("opacity", 0.25) // 막대가 같은 x, y 좌표상에 있어서 겹치므로 구분이 어려웠음. 그래서 색상, stroke, 투명도를 조절해서 각 막대를 보이게 해줌.
  .attr("x", function (d, i) {
    // 접근자 함수의 두번째 인자인 index 값을 활용해서
    // 각 막대그래프의 x좌표값을 구해, 막대그래프를 옆으로 이동시킴
    return i * 10;
  })
  .attr("y", function (d) {
    // 막대의 최대높이 100에서 각 막대의 높이값을 빼준 뒤,
    // 그 값을 막대 <rect>의 y좌표값으로 지정하면 위에서 아래로 향하던 막대들을
    // 아래에서 위로 향하도록 위치를 조정할 수 있음.
    return 100 - d;
  });
