"use strict";

d3.json("tweets.json", function (error, data) {
  dataViz(data.tweets);
});

function dataViz(incData) {
  const nestedTweets = d3
    .nest()
    .key(function (el) {
      return el.user;
    })
    .entries(incData);

  var colorScale = d3.scale.category10([0, 1, 2, 3]);

  nestedTweets.forEach(function (el) {
    el.numTweets = el.values.length;
    el.numFavorites = d3.sum(el.values, function (d) {
      return d.favorites.length;
    });
    el.numRetweets = d3.sum(el.values, function (d) {
      return d.retweets.length;
    });
  });

  const pieChart = d3.layout.pie().sort(null);
  pieChart.value(function (d) {
    return d.numTweets;
  });
  const newArc = d3.svg.arc();
  newArc.outerRadius(100).innerRadius(20);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(250,250)")
    .selectAll("path")
    .data(pieChart(nestedTweets), function (d) {
      return d.data.key;
    })
    .enter()
    .append("path")
    .attr("d", newArc)
    .style("fill", function (d, i) {
      return colorScale(i);
    })
    .style("opacity", 0.5)
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .each(function (d) {
      this._current = d;
    });

  pieChart.value((d) => d.numRetweets);
  d3.selectAll("path")
    .data(
      pieChart(nestedTweets.filter((d) => d.numRetweets > 0)),
      (d) => d.data.key
    )
    .exit()
    .remove();

  d3.selectAll("path")
    .data(
      pieChart(nestedTweets.filter((d) => d.numRetweets > 0)),
      (d) => d.data.key
    )
    .transition()
    .duration(1000)
    .attrTween("d", arcTween);

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
      return newArc(i(t));
    };
  }
}

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

/**
 * 파이 레이아웃 재정렬 기능 비활성화
 *
 * 파이 레이아웃 함수는 기본적으로
 * 차트를 보기좋게 만들기 위해서, 데이터를 포맷팅할 때마다
 * 큰 값부터 작은 값 순으로 index 값을 바꿔줌.
 *
 * -> 이렇게 하면 각도가 큰 원호부터 각도가 작은 원호 순으로 파이차트가 그려짐.
 *
 * 그런데, 파이 레이아웃의 기준값을 pie.value() 로 바꾼 뒤에
 * 다시 데이터 포맷팅을 하면, 당연히 index 값이 다시 바뀌겠지?
 *
 * 그러다 보니까 각 원호의 순서가 뒤바뀌어서 트랜지션이 적용될 때
 * 뒤틀리는 듯한 움직임이 나오는 거임.
 *
 * 이걸 방지하기 위해서, pie.sort(null) 로 해주면
 * 원호를 큰 값부터 작은값 순으로 index값을 재정렬해주는 기능을 비활성화 할 수 있음.
 *
 * 이로 인해 각 원호의 위치가 바뀌지 않게 되므로, 트랜지션을 줘도
 * 각자 원래 있던 자리에서 각도값만 바뀌게 될거임.
 */
