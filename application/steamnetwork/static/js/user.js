'use strict';

var app = new Vue({
  el: "#user",
  delimiters: ["[[", "]]"],
  data: {
    title: "Loading",
    page_title: "Loading",
    page_subtitle: "",
    laoding: true,
    rawdata: undefined,
    personaname: undefined,
    state: "loading",
  },
  methods:
  {
      buttonIdClicked: function (event)
      {
          app.state = "Loading";

          alert(app.user_id);
      }
  }
});

window.onload = getUserInfos;

function getUserInfos()
{
  fetch('/api/allinfos/' + name, {
      method: "GET",
    })
  .then((resp) => resp.json())
  .then(function(data) {
    if (data.status === "ok") {
      app.rawdata = data;
      app.personaname = app.rawdata.user.persona_name;
      app.state = "loaded";
      setTitle(app.personaname);
      setPage_title("Profile of " + app.personaname);
      setPage_subtitle("Let's find some friends, shall we?");
      setTimeout(function(){ drawBartChart(); }, 500); // without the timeout it is not loaded correctly.
    }
  }).catch((error) => console.log("Error getting the data: "+error));
}

function getMostPlayedGames(isLastTwoWeeks)
{
  //TODO
}

function drawBartChart()
{
  var data = getMostPlayedGames(true);
  var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,

	title:{
		text:"Most played games by your friends during the last 2 weeks"
	},
	axisX:{
		interval: 1
	},
	axisY2:{
		interlacedColor: "rgba(1,77,101,.2)",
		gridColor: "rgba(1,77,101,.1)",
		title: "Number of players"
	},
	data: [{
		type: "bar",
		name: "games",
		axisYType: "secondary",
		color: "#014D65",
		dataPoints: [
			{ y: 3, label: "Sweden" },
			{ y: 7, label: "Taiwan" },
			{ y: 5, label: "Russia" },
			{ y: 9, label: "Spain" },
			{ y: 7, label: "Brazil" },
			{ y: 7, label: "India" },
			{ y: 9, label: "Italy" },
			{ y: 8, label: "Australia" },
			{ y: 11, label: "Canada" },
			{ y: 15, label: "South Korea" },
			{ y: 12, label: "Netherlands" },
			{ y: 15, label: "Switzerland" },
			{ y: 25, label: "Britain" },
			{ y: 28, label: "Germany" },
			{ y: 29, label: "France" },
			{ y: 52, label: "Japan" },
			{ y: 103, label: "China" },
			{ y: 134, label: "US" }
		]
	}]
});
chart.render();
}
