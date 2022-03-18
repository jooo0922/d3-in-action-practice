"use strict";

// d3의 select() 와 append() 로 다양한 svg 요소 추가하기

// <line> 요소 추가하기
d3.select("svg")
  .append("line")
  .attr("x1", 20)
  .attr("y1", 20)
  .attr("x2", 400)
  .attr("y2", 400) // attr() 로 <line> 요소의 시작점과 끝점 좌표값 관련 속성값 지정함. (p.44-45 참고)
  .style("stroke", "black")
  .style("stroke-width", "2px"); // <line> 요소의 style 지정

// <text> 요소 추가하기
// 참고로 .text('str') 은 <text> 요소에 넣어줄 텍스트를 출력하는 메서드.
d3.select("svg")
  .append("text")
  .attr("x", 20)
  .attr("y", 20) // attr() 로 <text> 요소의 좌표값 관련 속성값 지정함.
  .text("HELLO"); // 얘는 빨간색 원보다 먼저 그려졌으니 빨간색 원에 가려짐

// <circle> 요소 추가하기
d3.select("svg")
  .append("circle")
  .attr("r", 20)
  .attr("cx", 20)
  .attr("cy", 20) // attr() 로 <circle> 요소의 반지름 및 원 중심 좌표값 관련 속성값 지정함. (p.44-45 참고)
  .style("fill", "red");

// <circle> 요소 하나 더 만들기
d3.select("svg")
  .append("circle")
  .attr("r", 100)
  .attr("cx", 400)
  .attr("cy", 400)
  .style("fill", "lightblue");

// <text> 요소 하나 더 만들기 (하늘색 circle 위에)
d3.select("svg")
  .append("text")
  .attr("x", 400)
  .attr("y", 400) // attr() 로 <text> 요소의 위치를 하늘색 원 자리에 맞춤
  .text("WORLD"); // 얘는 하늘색 원보다 나중에 그려졌으니 하늘색 원 위에 그려짐
