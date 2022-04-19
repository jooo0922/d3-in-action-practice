const scatterData = [
  { friends: 5, salary: 22000 },
  { friends: 3, salary: 18000 },
  { friends: 10, salary: 88000 },
  { friends: 0, salary: 180000 },
  { friends: 27, salary: 56000 },
  { friends: 8, salary: 74000 },
];

// d3.extent() 함수를 이용해서, 각 scatterData.salary 기준으로 [최솟값, 최댓값] 형태의 배열을 리턴해 줌. -> x좌표값의 domain 배열로 사용할거임.
const xExtent = d3.extent(scatterData, (d) => d.salary);
// d3.extent() 함수를 이용해서, 각 scatterData.friends 기준으로 [최솟값, 최댓값] 형태의 배열을 리턴해 줌. -> y좌표값의 domain 배열로 사용할거임.
const yExtent = d3.extent(scatterData, (d) => d.friends);

// svg 화폭이 500*500 이니까, 위에서 구한 각 domain 범위값을 0 ~ 500 사이로 정규화하는 함수를 d3.scaleLinear() 로 리턴받음.
const xScale = d3.scaleLinear().domain(xExtent).range([0, 500]);
const yScale = d3.scaleLinear().domain(yExtent).range([0, 500]);

const xAxis = d3.axisBottom().scale(xScale).tickSize(500).ticks(4); // 축 레이블 요소 생성하는 함수를 리턴해 줌.
d3.select("svg").append("g").attr("id", "xAxisG").call(xAxis); // <g> 요소를 하나 생성하고, 거기에서 .call(xAxis) 로 축 레이블 생성 함수 호출!
// xAxis(d3.select("svg").append("g").attr("id", "xAxisG")); // 이렇게 호출해줘도 동일함

const yAxis = d3.axisRight().scale(yScale).tickSize(500).ticks(16); // tickSize(500) 으로 눈금의 길이를 500, 즉 svg 화폭 사이즈만큼으로 지정함. -> 격자 형태가 그려짐.
d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

// 이런 스타일 값들은 가급적 css 파일에서 적용해주는 게 좋다고 함.
// d3.selectAll("path.domain").style("fill", "none").style("stroke", "black"); // 기다란 축의 스타일을 지정함
// d3.selectAll("line").style("stroke", "black"); // 축에 달린 눈금들의 스타일을 지정함.

// d3.select("#xAxisG").attr("transform", "translate(0, 500)"); 이런 식으로 <g> 요소를 움직여서 축을 이동시키는 방법도 있음.

d3.select("svg")
  .selectAll("circle")
  .data(scatterData)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("cx", function (d, i) {
    return xScale(d.salary);
  })
  .attr("cy", function (d, i) {
    return yScale(d.friends);
  });
