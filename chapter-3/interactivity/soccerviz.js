"use strict";

/**
 * d3 v4 이상 버전에서 .csv 데이터를 배열로 로드하기
 *
 * async/await 를 이용해서 비동기로
 * 데이터를 모두 가져올 때까지 기다린 뒤,
 *
 * 다 가져오면 .then() 으로 프라미스 체이닝을
 * 연결하여 배열에 담긴 데이터를 전달받을 수 있음.
 */
async function loadData() {
  const data = await d3.csv("worldcup.csv");
  return data;
}

function createSoccerViz() {
  loadData().then((data) => overallTeamViz(data));

  function overallTeamViz(incomingData) {
    d3.select("svg")
      .append("g") // <svg> 화폭에 <g> 요소 하나 생성
      .attr("id", "teamsG") // teamsG 라는 id값을 갖는, 하위에 나라별 <g> 요소들을 포함하는 전체 <g> 요소를 만든 것임.
      .attr("transform", "translate(50, 300)") // 전체 <g> 요소를 화폭의 가운데 쪽으로 옮김
      .selectAll("g") // 이 teamsG 안에는 별도의 <g> 요소는 없으니 빈 셀렉션을 받게 됨.
      .data(incomingData) // 로드한 csv 데이터 바인딩
      .enter() // 로드한 csv 데이터가 당연히 빈 셀렉션보다 개수가 많으니, 그만큼 enter 할 요소를 어떻게 들여올 것인지 다음 메서드에서 정의함.
      .append("g") // 각 데이터별로 <g> 요소를 새로 만들고
      .attr("class", "overallG") // class값은 'overallG' 라고 붙임.
      .attr("transform", function (d, i) {
        return `translate(${i * 50}, 0)`;
      }); // i값은 바인딩된 데이터 배열의 인덱스이므로, <g> 요소마다 x축을 기준으로 50px 씩 이동함

    // 계속 d3.selectAll('g.overallG') 이렇게 셀렉션을 가져오기 귀찮으니, 셀렉션을 변수에 저장해놓은 거임.
    const teamG = d3.selectAll("g.overallG"); // 위에서 만든 데이터별 <g> 요소들(즉, teamsG 의 자식노드인 <g> 요소들)을 모두 셀렉션함.

    // 각각의 <g> 요소에 <circle> 생성해 줌.
    teamG
      .append("circle")
      .attr("r", 20)
      .style("fill", "pink")
      .style("stroke", "black")
      .style("stroke-width", "1px");

    // 각각의 <g> 요소에 label이 될 <text> 를 달아줌
    teamG
      .append("text")
      .style("text-anchor", "middle") // <text> 는 기본 anchor가 텍스트 시작위치(맨 왼쪽)에 놓이므로, 이 anchor값을 가운데('middle')로 변경한 것. p.113 참고.
      .attr("y", 30)
      .style("font-size", "10px")
      .text((d) => d.team);

    // 현재 d3 버전에서 d3.keys(Object) 는 없어졌음. 아마 es6 이후 js 내장 api에 Object.keys() 가 생겨서 더 이상 필요없어졌기 때문인 거 같음.
    const dataKeys = Object.keys(incomingData[0]).filter(
      (el) => el !== "team" && el !== "region"
    ); // 어쨋든 incomingData 중에서 아무거나 하나 가져와서 key값들을 문자열 배열로 받아놓음.
    // 이 때, team, region 은 수치화할 수 있는 데이터 목록이 아니기 때문에, key 문자열 배열에서 filter 로 제외시킴. 못쓰는 데이터들이니까.
    // 왜 수치화한 데이터들만 쓰려는걸까? 아래에서 보면 알겠지만 그 수치들을 가지고 <circle> 의 반지름값을 매겨주려는 거임.

    d3.select("#controls")
      .selectAll("button.temas") // class 가 teams 인 <button> 요소는 <div id='controls' 에 없으니 당연히 빈 셀렉션을 받음.
      .data(dataKeys) // 위에서 team, region 을 제외하고 모아놓은 key값 문자열 배열을 데이터 바인딩함.
      .enter() // 이제 빈 셀렉션보다 많은 개수의 데이터들 만큼 enter한 요소를 어떻게 들여올 것인지 다음 메서드부터 정의함.
      .append("button") // 각 key에 따라 <button>을 하나씩 동적으로 생성해 줌. (이제 이 버튼을 클릭해서 해당 key값의 데이터만큼 <circle> 의 속성에 변화를 주겠지)
      .on("click", buttonClick)
      .html(function (d) {
        return d;
      });

    function buttonClick(e) {
      const key = e.target.textContent; // 클릭한 버튼의 이름 (즉, 위에 버튼들에서 바인딩한 데이터의 key값들 중 하나겠지)

      // 이벤트로 입력받은 key값을 기준으로 incomingData 에 존재하는 각 key값의 value들을 (현재는 '7' 이런 식으로 숫자가 문자열로 표현된 상태임.)
      // parseFloat() 으로 숫자화시킨 뒤, 걔내들 중 가장 큰값을 maxValue 에 넣어줌.
      const maxValue = d3.max(incomingData, function (d) {
        return parseFloat(d[key]);
      });

      // 위에서 이벤트로 입력받은 key값을 기준으로 찾은 최댓값으로
      // 0 ~ 최댓값 사이의 숫자범위를 2 ~ 20 사이의 숫자로 정규화해주는 함수 리턴함. -> 이 정규화된 값을 <circle>의 반지름값으로 사용하려는 것!
      const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);

      d3.selectAll("g.overallG") // 각 나라를 묶은 <g> 요소 셀렉션을 받음.
        .select("circle") // 각 <g> 의 자식들인 <circle> 을 선택함
        .attr("r", function (d) {
          // 각 circle 에 바인딩해놓은 incomingData 들(즉, 인자로 받는 d값)을 가져온 뒤, (맨 위에서 처음에 .data(incomingData) 로 데이터바인딩 했던 거 보이지?)
          // 그 중에서 key값에 해당하는 value를 뽑은 뒤, 위에서 리턴받은 정규화 함수로 돌려서 2 ~ 20 사이의 radius 값을 리턴해 줌.
          // 그 값들을 각 <circle> 의 반지름 값인 r 에 넣어줌.
          return radiusScale(d[key]);
        });
    }

    // 이제는 버튼들 말고, 각 국가별 <g> 요소에 mouseover 이벤트핸들러 등록함.
    teamG.on("mouseover", highlightRegion);
    teamG.on("mouseout", function (e) {
      // 이거는 마우스가 밖으로 나왔을 때, 각 <g> 요소의 <circle> 색상을 원래대로 되돌리는 이벤트핸들러를 달아준 것.
      d3.selectAll("g.overallG").select("circle").style("fill", "pink");
    });

    function highlightRegion(e) {
      d3.selectAll("g.overallG") // 각 국가별 <g> 요소를 모두 선택한 셀렉션이 반환되겠지
        .select("circle") // 각 국가별 <g> 요소 안에 담긴 <circle> 들을 선택함.
        .style("fill", function (p) {
          // 각 국가별 <circle> 에 바인딩된 incomingData(즉, p) 를 돌면서,
          // mouseover 된 e.currentTarget (즉, 해당 국가의 <g> 요소)의 __data__.region 과 동일하면,
          // 빨강색으로 강조해주고, 나머지는 회색으로 색칠해버림.
          // 현재 d3 버전의 .on('event', callback) 에서 callback 에 전달해주는 이벤트 파라미터는
          // 바닐라 js 의 이벤트 파라미터와 동일함... 거기에 바인딩된 데이터를 인자로 받는게 아니기 때문에
          // e.currentTarget(즉, 이벤트를 받은 <g> 요소)에 접근한 뒤, .__data__.region 이런식으로 해줘야
          // 해당 요소에 바인딩된 데이터에 접근할 수 있을거임.
          const selectedRegion = e.currentTarget.__data__.region;
          return p.region === selectedRegion ? "red" : "gray";
        });
    }
  }
}
