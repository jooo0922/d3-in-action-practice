"use strict";

function pie(tweetsData) {
  const pieChart = d3.pie();
  const yourPie = pieChart([1, 1, 2]);

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
        innerRadius: 0,
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
