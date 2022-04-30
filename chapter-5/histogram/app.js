"use strict";

function histogram(tweetsData) {
  // 일단 항상 d3.scaleLinear() 로 매핑함수부터 만들어놓는 것부터 시작할 것
  const xScale = d3.scaleLinear().domain([0, 5]).range([0, 500]); // user 숫자 범위를 0 ~ 500 까지 맵핑
  const yScale = d3.scaleLinear().domain([0, 10]).range([400, 0]); // 좋아요 및 리트윗 수를 400 ~ 0 까지 표현. -> 범위를 뒤집은 이유는 y축의 위로 갈수록 값을 높이기 위해서!

  // x축 그리는 함수 생성 (눈금 개수는 총 5개로 지정함.)
  const xAxis = d3.axisBottom().scale(xScale).ticks(5);

  // 히스토그램 레이아웃 함수 생성
  const histoChart = d3.histogram();

  // 히스토그램이 어떤 데이터값을 기준으로 데이터들을 분류할 것인지 .value() 의 콜백함수 안에서 결정하여 넘겨줌. (여기서는 좋아유 개수)
  histoChart.thresholds([0, 1, 2, 3, 4, 5]).value(function (d) {
    // 참고로 .thresholds([])는, 데이터들을 포맷할 때, bin(상자. 즉, 막대그래프에서 막대들)을
    // x0, x1 값들을 이용해서 어떻게 divide 시킬 지 정의하는거임.
    // 각각의 bin(상자)들을 0 ~ 5 사이의 값들 중 하나로 divide 해주겠다는 뜻 같음.
    return d.favorites.length;
  });

  // 히스토그램 레이아웃 함수로 tweetsData 를 재가공(포맷)함
  let histoData = histoChart(tweetsData);
  console.log(histoData); // 지금 favorites.length 를 기준으로 4개의 배열로 분류되어 있음.

  // 이제 새롭게 포맷한 histoData 를 바인딩해서 막대그래프를 그려줄거임!
  d3.select("svg")
    .selectAll("rect")
    .data(histoData) // 포맷된 데이터 바인딩
    .enter() // 바인딩된 데이터 개수만큼 아래의 행위들을 처리해 줌.
    .append("rect") // 사각형 (막대그래프) 생성
    .attr("x", (d) => xScale(d.x0)) // 각 데이터의 막대그래프 bin(상자)들의 시작점 x좌표값을 스케일링하여 rect의 x좌표값에 할당
    .attr("y", (d) => yScale(d.length)) // 포맷된 각 데이터 배열의 길이값을 rect의 y좌표값을 스케일링하여 rect의 y좌표값에 할당 (yScale 은 거꾸로 맵핑되니 길이가 길수록 y좌표값이 좌상단 원점에 가까워질거임)
    .attr("width", xScale(histoData[0].x1 - histoData[0].x0)) // bin(상자)들 중 첫번째 상자의 시작점 x좌표값과 끝점 x좌표값(.x1)을 뺀 값을 스케일링하여 rect의 width에 할당. (어차피 상자 넓이는 똑같으니까!)
    .attr("height", (d) => 400 - yScale(d.length)) // 전체 yScale 범위 400 에서 scale된 데이터배열 길이값을 빼줘서 rect 의 height에 할당. (400에서 뺀 이유는, 어차피 yScale은 거꾸로 맵핑되니 길이가 길수록 뺀 값도 클거임)
    .on("click", retweets); // 각 'rect' 요소 클릭 시, 리트윗 개수로 다시 데이터 포맷 후 바인딩해서 이미 생성된 <rect> 요소의 모양을 transition 으로 바꿔주는 retweets() 함수를 이벤트핸들러로 등록함!

  // 위에서 만든 x축 생성 함수를 호출해서 x축 생성해서 <g> 요소에 달아줌. -> 그리고 (0, 400) 쪽으로 옮겨서 x축을 막대그래프 바닥까지 내려줌.
  d3.select("svg")
    .append("g")
    .attr("class", "xAxisG")
    .attr("transform", "translate(0, 400)")
    .call(xAxis);

  // x축 요소의 <text> 요소 (즉, 숫자값이 달린 라벨 요소)를 x축 방향으로 50만큼 이동시킴 (막대그래프 width 가 100이니까, 막대그래프의 가운데로 옮긴 것이지!)
  d3.select("g.xAxisG").selectAll("text").attr("dx", 50);

  function retweets() {
    histoChart.value(function (d) {
      // 데이터 분류 기준값을 각 데이터의 좋아요 개수 -> 리트윗 개수로 변경함!
      return d.retweets.length;
    });

    // 데이터 분류기준이 변경된 히스토그램 레이아웃 함수로 다시 데이터를 재가공(포맷)함.
    histoData = histoChart(tweetsData);

    d3.selectAll("rect") // 앞서 생성한 bin(막대그래프 상자들) 요소들, 즉 <rect> 를 모두 선택함
      .data(histoData) // 데이터 분류기준값이 변경된 상태로 포맷된 데이터 바인딩
      .transition() // 트랜지션 적용
      .duration(500) // 애니메이션 지속시간 500ms
      .attr("x", (d) => xScale(d.x0)) // rect 의 x좌표값을 포맷된 데이터의 .x0 값을 맵핑해서 할당함. 근데 이거는 이전 값과 차이가 없을테니 굳이 안바꿔줘도 되긴 함..
      .attr("y", (d) => yScale(d.length)) // rect 의 y좌표값을 포맷된 데이터배열 길이만큼을 yScale 로 거꾸로 맵핑한 값으로 할당함.
      .attr("height", (d) => 400 - yScale(d.length)); // rect 의 높이값을 데이터배열 길이만큼을 거꾸로 맵핑한 뒤, 400에서 빼준 값으로 할당함
  }
}

d3.json("tweets.json").then((data) => {
  histogram(data.tweets);
});
