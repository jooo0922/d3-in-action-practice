"use strict";

// 빈 html 페이지에 <div> 요소를 추가하는 코드
d3.select("body")
  .append("div")
  .style("border", "1px solid black")
  .html("hello world");

// d3의 on() 메서드를 이용해서 요소에 인터랙션(이벤트리스너) 추가하기
d3.select("div")
  .style("background-color", "pink")
  .style("font-size", "24px")
  .attr("id", "newDiv")
  .attr("class", "d3div")
  .on("click", function () {
    console.log("You clicked a div");
  }); // 이런 식으로 d3의 셀렉션 요소에 이벤트리스너를 등록할 수 있음.
