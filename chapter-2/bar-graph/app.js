"use strict";

/**
 * d3.scaleLinear()
 *
 * 데이터값의 편차가 큰 경우,
 * d3 스케일 함수를 이용해서 데이터를 정규화해줘야 함.
 *
 * 책에는 d3.scale.linear() 이런 식으로 나와있지만,
 * v4 이후에서는 d3.scaleLinear() 이런식으로 바뀌었음.
 */
// const yScale = d3.scaleLinear().domain([0, 24500]).range([0, 100]);
const yScale = d3
  .scaleLinear()
  .domain([0, 100, 500])
  .range([0, 50, 100])
  .clamp(true); // 다중선형 스케일(polylinear)을 사용해서 도메인과 레인지에 여러 지점을 설정함.
// 이걸 왜 해주냐면, 데이터값의 편차가 심하면 오밀조밀하게 작은 값들의 경우 차이를 구분하기가 어려우니
// 특정 구간의 값에서 유의미한 차이를 시각적으로 확인하기 어려움. -> 이걸 눈으로 확연히 보이게 해줄 때 사용함.

// .clamp(true) 로 활성화하면, domain 범위를 벗어나서
// 짤려야 되는 값을 최댓값인 100 으로 맵핑해주도록 함.
console.log(yScale(4500)); // 이렇게 500이 넘는 값을 찍어보면 최댓값보다 큰 값을 추정하지 않고, 그냥 최댓값인 100으로 Mapping 해버림.

d3.select("svg")
  .selectAll("rect")
  .data([14, 68, 24500, 430, 19, 1000, 5555])
  .enter() // 바인딩된 데이터 개수가 더 많으니, '들어올(enter)' 요소에 대해서 어떻게 처리할 지 정해줘야 함.
  .append("rect") // <rect> 요소를 enter 할 요소 개수만큼 추가해 줌.
  .attr("width", 10) // <rect> 의 너비를 10으로 동일하게 지정
  .attr("height", function (d) {
    // 인라인 접근자 함수(익명함수)를 통해 바인딩된 데이터 배열의 값들을
    // 각각 받아서 <rect>의 height 값으로 지정해 줌.
    return yScale(d); // 높이값으로 0 ~ 100 사이의 값으로 정규화된 데이터를 사용함.
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
    // return 100 - d;
    return 100 - yScale(d); // y좌표값으로 0 ~ 100 사이의 값으로 정규화된 데이터를 사용함.
  });
