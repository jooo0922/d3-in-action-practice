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
      .attr("r", 0)
      .transition() // 각 g에 <circle> 요소 생성 시 연쇄 트랜지션을 적용시킴 (하나의 트랜지션이 끝난 후 다른 트랜지션 연이어 적용)
      .delay(function (d, i) {
        // 오른쪽으로 갈수록 반지름이 40까지 커지기 위한 지연시간이 길어질거임
        // 이런 식으로, .delay() 로 지연시간을 줘서 연쇄 트랜지션을 적용할 수 있음.
        return i * 100;
      })
      .duration(500)
      .attr("r", 40)
      .transition() // 다음 연쇄 트랜지션 시작
      .duration(500)
      .attr("r", 20)
      .style("fill", "pink")
      .style("stroke", "black")
      .style("stroke-width", "1px");

    // 각각의 <g> 요소에 label이 될 <text> 를 달아줌
    teamG
      .append("text")
      .style("text-anchor", "middle") // <text> 는 기본 anchor가 텍스트 시작위치(맨 왼쪽)에 놓이므로, 이 anchor값을 가운데('middle')로 변경한 것. p.113 참고.
      .attr("y", 30)
      // .style("font-size", "10px") // d3.classed() 를 이용해 <text> 에 .active 클래스를 toggle 하면서 동적으로 font-size 를 조절하려고 잠시 코멘트 처리함.
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

      // 위에 이벤트로 입력받은 key값을 기준으로 찾은 최댓값으로
      // 0 ~ 최댓값 사이의 숫자범위를 'yellow' ~ 'blue' 사이의 색상범위로 정규화해주는 함수 리턴 -> 이 정규화된 값을 <circle> 의 색상으로 칠해주려는 것!
      const ybRamp = d3
        .scaleLinear()
        // 근데 아무것도 없이 기본 보간자로 사용하면 굉장히 우중충한 색이 보간되어 나옴.
        // 그래서 .interpolate() 를 이용해서 보간에 필요한 다양한 색상모델을 직접 지정하려는 것
        // .interpolate(d3.interpolateHsl) // 얘는 hsl 값을 기준으로 중간색 보간.
        // .interpolate(d3.interpolateHcl) // 얘는 hcl (l은 휘도) 값을 기준으로 중간색 보간.
        .interpolate(d3.interpolateLab) // 얘는 밝기(L)와 색 대응공간(A, B)를 기준으로 중간색 보간.
        .domain([0, maxValue])
        .range(["yellow", "blue"]);

      // 얘는 수치형 값들을 특정 색상 범주값에 매핑할 때 사용하는 API
      // d3.scaleOrdinal(d3.schemeCategory10) 이렇게 해주면, d3.schemeCategory10 에 미리 정의된 10가지 색상으로
      // domain 값들을 각각 매핑시키는 함수를 리턴함. -> 여기서는 각 지역데이터 마다 색상을 다르게 정의하려는 것임.
      const tenColorScale = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(["UEFA", "CONMEBOL", "CAF", "AFC"]);

      // colorbrewer.js 에 정의된 색상 그라디언트 범주를 사용해서 범주에 맞는 색상값을 리턴하는 함수를 리턴함.
      // .scaleQuantize() 를 이용하고 있음. 이때, .scaleQuantize() 는 최대 3개의 범주만 받기 때문에,
      // .range() 에 전달하는 colorbrewer.js 색상 배열의 길이는 3개를 넘으면 안됨.
      const colorQuantize = d3
        .scaleQuantize()
        .domain([0, maxValue])
        .range(colorbrewer.Reds[3]);

      d3.selectAll("g.overallG") // 각 나라를 묶은 <g> 요소 셀렉션을 받음.
        .select("circle") // 각 <g> 의 자식들인 <circle> 을 선택함
        .transition() // 인터랙션을 부드럽게 처리하기 위해, <circle> 셀렉션 전체에 .transition() 으로 전환(애니메이션)을 적용함
        .duration(1000) // .duration(밀리세컨드) 으로 전환 지속시간을 정의함.
        // .style("fill", function (d) {
        //   // 얘는 지역데이터 별 색상값 매핑시키는 함수를 리턴받아서 사용한 것.
        //   return tenColorScale(d.region);
        // })
        .style("fill", function (d) {
          return colorQuantize(d[key]);
        })
        .attr("r", function (d) {
          // 각 circle 에 바인딩해놓은 incomingData 들(즉, 인자로 받는 d값)을 가져온 뒤, (맨 위에서 처음에 .data(incomingData) 로 데이터바인딩 했던 거 보이지?)
          // 그 중에서 key값에 해당하는 value를 뽑은 뒤, 위에서 리턴받은 정규화 함수로 돌려서 2 ~ 20 사이의 radius 값을 리턴해 줌.
          // 그 값들을 각 <circle> 의 반지름 값인 r 에 넣어줌.
          return radiusScale(d[key]);
        });
      // .style("fill", function (d) {
      //   return ybRamp(d[key]);
      // });
    }

    // 이제는 버튼들 말고, 각 국가별 <g> 요소에 mouseover 이벤트핸들러 등록함.
    teamG.on("mouseover", highlightRegion2);
    teamG.on("mouseout", unHighlight2);

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

    // d3.rgb().darker() 또는 .brighter() 로 mouseover 된 <g> 요소 안의 <circle> 요소의 색상 채도를 조절해주는 함수.
    function highlightRegion2(e) {
      const teamColor = d3.rgb("pink"); // 초기 색상값을 d3.rgb() 로 지정할 수 있음.

      // this 를 통해 이벤트핸들러가 바인딩된 요소인 teamG 즉, DOM 요소인 <g> 에 직접 접근할 수 있음.
      // d3.classed('클래스이름', boolean) 셀렉션에 해당 클래스를 add 하거나 remove 할 때 사용함.
      d3.select(this).select("text").classed("active", true).attr("y", 10); // 동적으로 .active 클래스를 붙였다 뗏다 하면서 font-size 를 조절하려는 것.
      d3.selectAll("g.overallG")
        .select("circle")
        .style("fill", function (p) {
          const selectedRegion = e.currentTarget.__data__.region;
          return p.region === selectedRegion
            ? teamColor.darker(0.75)
            : teamColor.brighter(0.5);
        });

      // 이렇게 하면 mouseover 된 <g> 요소가 부모요소인 #teamsG 의 마지막 자식요소 자리(즉, 끝부분)으로 이동함.
      // 동일한 DOM 요소가 새로 추가되는 게 아니라, 자리만 마지막 자식요소 자리로 이동하는 개념으로 보면 됨.
      // svg 는 zIndex 설정이 불가하므로, 이런 식으로 DOM 을 직접 조작해 svg 요소를 마지막으로 옮겨줘야
      // 다른 svg 요소들보다 앞에 보이도록 할 수 있음.
      this.parentElement.appendChild(this);
    }

    // 이거는 마우스가 밖으로 나왔을 때, 각 <g> 요소의 <circle> 색상을 원래대로 되돌리는 이벤트핸들러를 달아주려고 만든 함수
    function unHighlight(e) {
      d3.selectAll("g.overallG").select("circle").style("fill", "pink");
    }

    // highlightRegion2 에서 채도조절한 <circle> 의 색상값을 모두 원래 색상값으로 초기화하고, <text> 요소도 원래대로 돌려놓는 함수
    function unHighlight2(e) {
      d3.selectAll("g.overallG").select("circle").style("fill", "pink");
      d3.selectAll("g.overallG")
        .select("text")
        .classed("active", false) // 동적으로 .active 클래스를 붙였다 뗏다 하면서 font-size 를 조절하려는 것.
        .attr("y", 30); // 텍스트의 높이값(y) 도 원래대로 되돌려놓음.
    }

    // 외부 이미지파일을 불러와서 그래프 요소에 추가하는 방법 (참고로, <svg> 안에서 이미지 태그는 <image> 를 사용함.)
    d3.selectAll("g.overallG")
      .insert("image", "text") // .insert('끼워넣을 요소 타입', '어느 요소 앞에 끼울 것인지의 타입') 이렇게 하면, 두 번째 파라미터 앞에 첫 번째 파라미터가 끼워져서 두 번째 파라미터 요소에 가려질거임.
      .attr("xlink:href", function (d) {
        // 'xlink: href' 를 통해 <image> 의 경로를 지정함.
        return `./images/${d.team}.png`;
      })
      .attr("width", "45px")
      .attr("height", "20px")
      .attr("x", "-22")
      .attr("y", "-10"); // 이미지의 x, y 값을 각각 이미지의 width, height 의 절반의 마이너스로 줘야 각 <g> 요소의 정가운데로 올 수 있음.
  }
}
