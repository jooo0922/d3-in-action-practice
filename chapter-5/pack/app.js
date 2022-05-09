"use strict";

function pack(tweetsData) {
  const nestedTweets = d3.group(tweetsData, function (d) {
    return d.user; // user 값을 기준으로 데이터를 그룹화함!
  });

  const packableTweets = { id: "All Tweets", values: nestedTweets };
  const depthScale = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1, 2]);

  const packChart = d3.pack();

  packChart.size([500, 500]);
}

d3.json("tweets.json").then((data) => {
  pack(data.tweets);
});
