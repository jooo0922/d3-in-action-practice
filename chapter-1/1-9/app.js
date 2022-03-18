"use strict";

// d3로 요소에 transition 추가해서 동적인 데이터 시각화 구현하기

// 작은 원 그리기
d3.select("svg")
  .append("circle")
  .attr("r", 20)
  .attr("cx", 20)
  .attr("cy", 20)
  .style("fill", "red");

// 작은 원 위에 텍스트 그리기
d3.select("svg")
  .append("text")
  .attr("id", "a") // 'a' 라는 id값을 달아놓음.
  .attr("x", 20)
  .attr("y", 20) // 작은 원과 동일한 위치에 그려줌.
  .style("opacity", 0) // 이번에는 처음 렌더링할 때, 투명도를 0으로 떨궈서 안보이게 함.
  .text("HELLO WORLD"); // .text() 는 <text> 요소에 텍스트 출력하는 메서드라고 했지?

// 큰 원 그리기
d3.select("svg")
  .append("circle")
  .attr("r", 100)
  .attr("cx", 400)
  .attr("cy", 400)
  .style("fill", "lightblue");

// 큰 원 위에 텍스트 그리기
d3.select("svg")
  .append("text")
  .attr("id", "b") // 'b' 라는 id값을 달아놓음
  .attr("x", 400)
  .attr("y", 400) // 큰 원과 동일한 위치에 그려줌.
  .style("opacity", 0) // 투명도 0으로 떨궈서 안보이게 함.
  .text("Uh, hi.");

// .transition() 과 .delay() 로 텍스트가 서서히 fade in 하는 애니메이션 적용하기
d3.select("#a")
  .transition() // .transition() 을 써주면, 이후 체이닝된 메서드 호출에 의한 변환(전환)을 부드럽게 이어줌.
  .delay(1000) // .delay() 을 써주면, 이후 체이닝된 메서드 호출을 지정된 시간만큼 지연시킴.
  .style("opacity", 1); // 투명도를 1로 끌어올려서 fade in 시킴

d3.select("#b")
  .transition() // 뒤에 .style() 에 의한 전환을 부드럽게 이어줌.
  .delay(3000) // 3000 밀리초가 지나야 이후 체이닝된 메서드를 호출함.
  .style("opacity", 0.75); // 투명도를 0.75로 끌어올려서 fade in 시킴

// .duration() 으로 .transition() 으로 적용한 전환의 지속시간을 정의할 수 있음.
d3.selectAll("circle")
  .transition()
  .duration(2000) // .style(), .attr() 이런거로 변환하기 전에 호출해주면 transition 지속시간을 정의함.
  .attr("cy", 200);
