"use strict";

function pie(tweetsData) {
  // v5 이후 d3.nest() 는 d3.group 및 d3.rollup() 으로 대체됨.
  const nestedTweets = d3.group(tweetsData, function (d) {
    return d.user;
  });

  /**
   * InternMap 객체를 forEach로 사용할 때에는
   * 각 key 에 할당된 value, 즉 배열객체 자체가 그대로 순회하는 인자에 전달됨.
   *
   * 그래서, el.numTweets, el.numFavorites 등
   * 배열 객체에 속성을 새로 만들어서 특정 값을 할당할 수 있음.
   */
  nestedTweets.forEach((el) => {
    // el.numTweets 속성을 새로 만든 뒤, 각 사람별 트윗 개수를 저장함.
    el.numTweets = el.length;

    // el.numFavorites 속성을 새로 만든 뒤, 각 사람별 트윗을 순회하면서 좋아요 수를 누적계산함. (d3.sum())
    el.numFavorites = d3.sum(el, (d) => d.favorites.length); // 여기서 el 은 각 사람별 트윗객체가 순회되면서 들어가는 거고, 콜백함수의 인자 d 는 각각의 트윗객체를 뜻함.

    // el.numRetweets 속성을 새로 만든 뒤, 각 사람별 트윗을 순회하면서 리트윗 수를 누적계산함. (d3.sum())
    el.numRetweets = d3.sum(el, (d) => d.retweets.length);
  });
  console.log(nestedTweets);

  const pieChart = d3.pie();

  // d3.pie().value(func) 에서 .value 는 뭐냐면,
  // 아랫줄에 pieChart(nestedTweets) 로 넣어버렸을 때, '정확히 nestedTweets 안에 어떤 값으로 포맷해줘야 하는건데?'
  // 에 대해 어떤 값으로 포맷팅 하라고 딱 정해주는 메서드라고 보면 됨. 한 마디로, 접근자를 정의해주는 것!
  pieChart.value((d) => {
    return d[1].numTweets; // 여기서는 각 배열객체의 numTweets 값을 기준으로 데이터를 포매팅하도록 정해주고 있음.
  });
  const yourPie = pieChart(nestedTweets);

  const newArc = d3.arc();

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(250, 250)") // <path> 들이 담길 <g> 요소를 <svg> 의 가운데로 이동시킴
    .selectAll("path")
    .data(yourPie)
    .enter()
    .append("path")
    .attr("d", (d) =>
      newArc({
        innerRadius: 20, // innerRadius 값을 지정하면 도넛 모양 차트를 생성할 수 있음.
        outerRadius: 100,
        startAngle: d.startAngle,
        endAngle: d.endAngle,
      })
    )
    .style("fill", "blue")
    .style("opacity", 0.5)
    .style("stroke", "black")
    .style("stroke-width", "2px");
}

d3.json("tweets.json").then((data) => {
  pie(data.tweets);
});

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
