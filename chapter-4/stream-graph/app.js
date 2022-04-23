"use strict";

async function loadData() {
  const data = await d3.csv("movies.csv");
  return data;
}

function streamGraph(data) {
  // 일단 항상 d3.scaleLinear() 로 매핑함수부터 만들어놓는 것부터 시작할 것
  const xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
  const yScale = d3.scaleLinear().domain([-100, 100]).range([480, 20]);

  // x축 그리는 함수 생성
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .tickSize(480);

  // y축 그리는 함수 생성
  const yAxis = d3.axisRight().scale(yScale).ticks(10).tickSize(480);

  // 위에서 만든 축 생성 함수를 호출해서 각각 x, y축 생성해서 <g> 요소에 달아줌.
  d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis);
  d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

  // 각 영화별 area 색을 채워줄 색상 그라디언트를 매핑하는 함수를 만듦.
  const fillScale = d3
    .scaleLinear()
    .domain([0, 5])
    .range(["lightgray", "black"]);

  let n = 0;
  // data[0] 에 존재하는 각각의 데이터 열을 for...in 루프로 돌림
  // console.log(data[0]) // 얘는 csv 데이터의 첫 번째 행. 즉, 첫째날의 영화별 매출액 데이터가 담겨있겠지
  // 이거는 굳이 첫째날 데이터로 안해도 되고 둘째날, 셋째날 등 다 됨. 중요한 건
  // for in 루프에서 사용할 key값(즉, 각 영화 key값들) 을 가져오기 위해 사용하고 있는 객체인 것!
  for (const key in data[0]) {
    // key 값이 'day' 인 데이터열을 제외한 나머지 데이터열, 즉 각 6개의 영화에 대한 데이터열에 대해서만 선 생성기를 만듦.
    if (key !== "day") {
      // 각 영화의 매출액 및 날짜를 받아 매핑된 좌표값으로 변환해서 영역 생성기 함수를 만듦.
      const movieArea = d3
        .area() // d3.line() 대신 도형색을 채워넣을 수 있는 영역 생성기
        .x(function (d) {
          return xScale(d.day);
        })
        .y1(function (d) {
          return yScale(alternatingStacking(d, key, "top")); // 각 영화별 선 생성기의 y좌표값 접근자는 처음 영화(movie1) ~ 지정된 영화(key) 까지의 매출액 누산값을 매핑해서 리턴해 줌.
        })
        .y0(function (d) {
          return yScale(alternatingStacking(d, key, "bottom")); // 매출액 누산값에서 현재 지정된 영화 매출액(d[key])를 뺀 값을 매핑해서 리턴해 줌. -> 그러니 값이 바로 밑에 그래프의 누산값과 정확히 일치하겠지. (이거는 p.194 참고)
        }) // 영역 생성 시, d3.area.y1() 과 d3.area.y0() 으로 꼭대기와 바닥의 y좌표값을 각각 생성해줘야 함. -> 그래야 색을 채울 수 있음.
        .curve(d3.curveBasis); // 선을 basis 모드로 보간시킴 -> 곡선으로 나오겠군

      d3.select("svg")
        .insert("path", ".movie") // .insert('끼워넣을 요소 타입', '어느 요소 앞에 끼울 것인지의 타입') 이렇게 하면, 두 번째 파라미터 앞에 첫 번째 파라미터가 끼워져서 두 번째 파라미터 요소에 가려질거임.
        // 즉, 지금 만들 새로운 .movie 요소 앞에 이전에 만든 모든 path들을 끼워넣으니까, 항상 새로 만드는 path 앞에 이전에 만든 path 들을 끼워넣는 셈. 따라서, 새로 만든 path일수록 맨앞에 오겠지!
        .attr("class", "movie")
        .style("id", key + "Area")
        .attr("d", movieArea(data))
        .attr("fill", fillScale(n)) // n값을 for..in 루프에서 매번 증가시키면서 해당하는 색상 그라디언트 값으로 매핑받아와서 area 색을 채울 수 있도록 함.
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .style("opacity", 1);
    }
    n++;
  }

  // 비교적 간단한 매출액 누산함수
  function simpleStacking(incomingData, incomingAttribute) {
    let newHeight = 0;

    for (const key in incomingData) {
      if (key !== "day") {
        newHeight += parseInt(incomingData[key]);

        if (key === incomingAttribute) {
          break;
        }
      }
    }

    // 위에 forin 루프에 의해 처음 영화(movie1) 부터 현재 지정된 영화 (incomingAttribute) 까지의 매출액이 newHeight 에 누산되어 리턴해 줌.
    return newHeight;
  }

  // simpleStack 보다 더 복잡한 처리를 해주는 매출액 누산함수를 만들어서 스트림그래프를 생성하려고 함.
  // 참고로 topBottom 은 영역의 꼭대기에 그리는 것인지 바닥에 그리는 것인지 판별할 수 있는 문자열을 받는 것.
  function alternatingStacking(incomingData, incomingAttribute, topBottom) {
    let newHeight = 0;
    let skip = true;

    for (const key in incomingData) {
      if (key !== "day") {
        if (key === "movie1" || skip === false) {
          newHeight += parseInt(incomingData[key]);

          if (key === incomingAttribute) {
            break;
          }

          if (skip === false) {
            skip = true;
          } else {
            n % 2 === 0 ? (skip = false) : (skip = true);
          }
        } else {
          skip = false;
        }
      }
    }

    if (topBottom === "bottom") {
      newHeight = -newHeight;
    }

    if (n > 1 && n % 2 === 1 && topBottom === "bottom") {
      newHeight = 0;
    }

    if (n > 1 && n % 2 === 0 && topBottom === "top") {
      newHeight = 0;
    }

    return newHeight;
  }
}

loadData().then((data) => {
  streamGraph(data);
});
