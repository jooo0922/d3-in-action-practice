"use strict";

function dataViz(incomingData) {
  // v5 이후 d3.nest() 는 d3.group 및 d3.rollup() 으로 대체됨.
  const nestedTweets = d3.group(incomingData, function (d) {
    return d.user;
  });

  // InternMap 객체를 forEach로 사용할 때에는
  // InternMap 의 각 key에 할당된 value 자체가 그대로 인자에 전달되는 것 같음.
  // 그래서, value에 들어있는 배열 객체에 numTweets 라는 속성을 새로 만들어서
  // 배열의 길이값을 할당할 수 있는 거 같음.
  nestedTweets.forEach((el) => {
    el.numTweets = el.length;
  });

  // 그러나, InternMap 객체가 accessor(접근자) 함수 안에서 사용될 경우,
  // key와 value을 하나의 배열 안에 집어넣어서 인자로 전달하는 거 같음.
  // 그래서 key 는 el[0], value 는 el[1] 로 접근이 가능한 거 같음.
  const maxTweets = d3.max(nestedTweets, function (el) {
    return el[1].numTweets;
  });

  const yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 100]);

  d3.select("svg")
    .selectAll("rect")
    .data(nestedTweets)
    .enter()
    .append("rect")
    .attr("width", 50)
    .attr("height", function (d) {
      // .attr() 메서드도 위에 .max() 메서드와 마찬가지로
      // accessor(접근자) 함수 안에서 InternMap 을 바인딩된 데이터로 사용할 경우,
      // value는 항상 d[1] 로 접근해야 사용할 수 있음.
      return yScale(d[1].numTweets);
    })
    .attr("x", function (d, i) {
      return i * 60;
    })
    .attr("y", function (d) {
      return 100 - yScale(d[1].numTweets);
    })
    .style("fill", "blue")
    .style("stroke", "red")
    .style("stroke-width", "1px")
    .style("opacity", 0.25);
}

d3.json("tweets.json").then((data) => {
  // 참고로, json으로 받은 데이터는 배열이 아니므로, .tweets 로 접근해야 배열 데이터값을 올바르게 전달할 수 있음.
  dataViz(data.tweets);
});

/**
 * d3.json() 메서드 v5 및 그 이상 버전에서 사용 시 주의점!
 *
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
 */

/**
 * d3.nest() => d3.group() or d3.rollup() 변경 관련 주의사항
 *
 *
 * d3.group(iterable, ...keys)
 *
 * 이 메서드는 특정 key 값을 기준으로 데이터를
 * nesting(내포, 범주화, 분류, 그룹화 등)
 * 할 때 사용할 수 있음.
 *
 * 아마 d3.nest() 메서드가 버전 업데이트 되면서
 * deprecated 되고, d3.group() 으로 대체된 것 같음.
 *
 *
 * d3.nest() 와 차이점이 존재한다면,
 * d3.nest().key(특정 key 리턴하는 콜백함수).entries(데이터)
 * 책에는 이런 식으로 nesting 하여 객체가 담긴 배열을
 * 바로 리턴받음.
 *
 *
 * 반면, d3.group(데이터, 특정 key 리턴하는 콜백함수)의 경우,
 * 데이터와 콜백함수 두 인자를 모두 한번에 때려넣어서
 * nesting된 결과물을 얻어냄.
 *
 * 이 때의 결과물은 배열이 아니고,
 * InternMap 이라고 하는, js 의 Map 객체를 상속받는
 * d3에서 사용하는 특이한 Map 객체를 리턴받는 것 같음.
 *
 * 이 안에는, 특정 key값을 기준으로
 * nesting된 데이터들이 배열로 묶여서
 * value에 담겨있음
 */
