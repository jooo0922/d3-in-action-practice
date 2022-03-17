"use strict";

// const someData = ["filler", "filler", "filler", "filler"];

// d3.select("body")
//   .selectAll("div")
//   .data(someData)
//   .enter() // 현재 html에는 div가 하나니까, smallData 는 그것보다 개수가 많으므로, 넘치는 개수만큼 enter 시킬 요소들을 이후에 정의함.
//   .append("div")
//   .html("Wow")
//   .append("span")
//   .html("Even More Wow")
//   .style("font-weight", "900");

const someNumbers = [17, 82, 9, 500, 40];
const smallNumbers = someNumbers.filter((el) => {
  return el <= 40;
});

d3.select("body") // body 태그 선택
  .selectAll("div") // 그 안에 모든 div 태그들 선택
  .data(smallNumbers) // filter 된 숫자들이 들어간 배열을 데이터로 바인딩
  .enter() // 현재 html에는 div가 하나니까, smallNumbers 는 그것보다 개수가 많으므로, 넘치는 개수만큼 enter 시킬 요소들을 이후에 정의함.
  .append("div") // 일단 div 요소들을 추가해주고
  .html(function (d, i) {
    return d; // 그 안에 html 요소를 d, 즉 data로 바인딩한 someNumbers 배열의 요소(40 이하의 숫자들)들을 리턴해서 덮어씀.
    // 이런 식으로, D3 셀렉션이 제공하는 html(), style(), attr(), property() 등의
    // 메서드 안에서 익명함수를 호출해 리턴받는 값으로 셀렉션 항목의 값을 설정하는 패턴이 자주 쓰임.
    // 이런 익명함수를 D3 에서는 '접근자(accessor)' 라고도 하나 봄.
    // 이런 익명함수는 일반적으로 파라미터를 2개 받는데, 첫번째는 바인딩된 데이터(여기서는 smallNumbers),
    // 두번째는 그 데이터의 index 를 의미함.
  });
