"use strict";

d3.csv("cities.csv", function (data) {
  console.log(data);
});

// d3.json() v4 or lower
// d3.json("tweets.json", function (data) {
//   console.log(data);
// });

// d3.json() v5 or higher
d3.json("tweets.json").then(function (data) {
  console.log(data);
});

/**
 * d3.json() 메서드의 버전별 사용방법 차이 (매우 중요!)
 *
 *
 * 1. d3 v4 및 그 이하 버전에서 사용 시
 *
 * 구 버전의 d3 에서는 d3.json(url, 콜백함수) 를 통해서
 * 콜백함수에서 해당 url request 와 연관된 object 를 바로 리턴해 줌.
 * 그래서 콜백함수 내에서 data 인자를 바로 가져와서 사용할 수 있음.
 *
 * cdn을 v4 이하 버전으로 바꿔준 뒤 해보면 정상 작동할 것임.
 *
 *
 * 2. d3 v5 및 그 이상 버전에서 사용 시
 *
 * 최신 버전의 d3 에서는 d3.json(url) 을 실행하면
 * object 가 아니라 Promise 를 리턴함.
 *
 * 그래서 .json(url, 콜백함수) 이런 식으로
 * 콜백함수 안에서 data를 가져와서 쓰려고 하면,
 * data 로딩이 완료가 안된, Pending 상태이기 때문에
 * 어떠한 data도 넘겨줄 수 없음.
 *
 * 따라서, data를 받아서 쓰고 싶다면,
 * .then(콜백함수(data){}) 로 프라미스 체이닝을 연결하여
 * 비동기로 data를 받아오는 방법을 사용해야 함.
 *
 * 자세한 설명 아래 스택오버플로우 url 참고
 * https://stackoverflow.com/questions/47664292/d3-json-method-doesnt-return-my-data-array
 */

/**
 * d3.csv() 메서드 버전별 리턴 방식 차이
 *
 *
 * 1. d3 v4 및 그 이하 버전
 *
 * d3.csv() 의 경우에도,
 * 데이터를 리턴해주는 방식이 버전에 따라 약간 다름.
 *
 * v4 이하 버전에서는 csv 객체들을
 * 하나의 배열에 담아서 저장해 줌.
 *
 * 객체를 하나에 배열에 담아서
 * 한번에 전달해주기 때문에 콜백함수도 1번만 호출됨.
 *
 *
 * 2. d3 v5 및 그 이상 버전
 *
 * v5 이상 버전에서는 배열 안에 담겨있던 객체를
 * 따로따로 로드해서 가져옴.
 *
 * 그러니까 각각의 객체에 대해 각각 콜백함수를 호출하므로,
 * 콜백함수가 csv 객체의 개수와 동일하게 n번 호출됨.
 */
