"use strict";

function dataViz(incomingData) {
  d3.select("body") // <body> 요소 선택
    .selectAll("div.cities") // <body> 밑에 .cities 라는 클래스 이름을 갖는 div 하위셀렉셔 선택 (빈 페이지니까 셀렉션도 아무것도 못가져옴)
    .data(incomingData) // 비어있는 셀렉션에 비동기로 가져온 csv 데이터 바인딩함
    .enter() // 셀렉션 개수보다 바인딩된 데이터 개수가 많을 때, 새로 '들어올' 요소를 어떻게 처리할 지 이후 메서드에서 정의
    .append("div") // 일단 div 요소를 body에 추가해주고
    .attr("class", "cities") // 해당 div 요소의 class 를 cities 로 달아주고
    .html(function (data, idx) {
      // html contents 로 바인딩한 데이터 각각에서 label 속성값을 뽑아서 출력함.
      return data.label;
    });
}

async function loadData() {
  const data = await d3.csv("cities.csv");
  return data;
}

loadData().then(function (data) {
  // 프라미스 체이닝을 통해 비동기로 가져온 csv data를 넘겨받으면,
  // 이제 그걸 가져와서 dataViz() 함수를 통해 셀렉션과 데이터바인딩을 통해 화면에 요소를 생성함!
  dataViz(data);
});

/**
 * d3.csv(url, function(data, idx) {})
 *
 * d3 v5 이후 버전에서는
 * .csv() 메서드에 전달하는 콜백함수의
 * 인자가 책의 내용과 다름.
 *
 * 첫 번째 인자가 data고,
 * 두 번째 인자가 해당 data의 index임!
 *
 * function(error, data) {} 이거는 v4 이하 버전까지만 해당!
 */

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

/**
 * d3.html(function(data, index) {return data})
 *
 * 이 패턴은 메서드 안에서
 * '접근자' 라고 불리는 익명함수를 호출해서
 *
 * 바인딩된 데이터를 인자로 받아 html 요소에
 * 끼워넣어주는 역할을 함.
 *
 * 이외에도 .style(), .attr(), .html() 등의
 * 메서드 안에서 접근자 익명함수를 사용해
 * 바인딩된 데이터로 뭔가를 만들어서
 * 리턴해주는 패턴을 많이 사용함.
 *
 * 교재 p.60 참고!
 */
