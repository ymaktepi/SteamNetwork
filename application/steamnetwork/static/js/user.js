'use strict';


var app = new Vue({
    el: "#user",
    delimiters: ["[[", "]]"],
    data: {
        rawdata: undefined,
        personaname: undefined,
        state: "loading",
        gameidToGameMap: undefined,
        dataPoints: undefined,
        chart: undefined,
        totalMaxGames: 0,
        currentSelectedMaxGames: undefined,
        isPlaytimeRangeTwoWeeks: "true",
        isPlayer: "true",
        data: undefined,
    },
    methods: {
        updateViewFilter: function(event) {
            let mapName = "";
            if (app.isPlayer === 'true') {
                mapName += "friends";
            } else {
                mapName += "playtime";
            }

            if (app.isPlaytimeRangeTwoWeeks === 'true') {
                mapName += "_2_weeks";
            } else {
                mapName += "_total";
            }
            console.log(mapName)
            let len = app.data.get(mapName).length;
            app.totalMaxGames = len;
            let begin = len - app.currentSelectedMaxGames;
            let end = len;
            app.chart.options.data[0].dataPoints = app.data.get(mapName).slice(begin, end);
            app.chart.render();

            {
                let data = app.data.get(mapName).slice(begin, end).reverse().map(d => ({
                    name: d.label,
                    value: d.y
                }));

                let width = 100; // %
                let barHeight = 20;


                let x = d3.scale.linear()
                    .domain([0, d3.max(data, d => d.value)])
                    .range([0, width]);

                let chart = d3.select(".chartd3")
                    .attr("width", width + "%")
                    .attr("height", barHeight * data.size);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


                let bar = chart.selectAll("g")
                    .data(data)
                    .enter().append("g")
                    .attr("transform", function(d, i) {
                        return "translate(0," + i * barHeight + ")";
                    });

                bar.append("rect")
                    .attr("width", d => x(d.value) + "%")
                    .attr("height", barHeight - 1);

                bar.append("text")
                    .attr("x", d => (x(d.value) - 4))
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .text(d => d.value);

                bar.append("text")
                    //.attr("text-anchor", "end")
                    .attr("x", 10)
                    .attr("y", barHeight / 2)
                    .attr("dy", ".35em")
                    .text(d => d.name);

            }


            $('#nbGames').prop({
                'max': len
            });
        }
    }
});

window.onload = getUserInfos;

function getUserInfos() {
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
                populateGameidToGameMap();
                populateData();
                setTimeout(function() {
                    initBarChart();
                }, 500); // without the timeout it is not loaded correctly.
            }
        }).catch((error) => console.log("Error getting the data: " + error));
}

function populateGameidToGameMap() {
    app.gameidToGameMap = new Map();
    app.rawdata.games.forEach(game => {
        app.gameidToGameMap.set(game.app_id, game);
    });
}

function populateData() {
    let listKeys = ["playtime_2_weeks", "playtime_total", "friends_2_weeks", "friends_total"];
    app.data = new Map();
    let map = new Map();
    listKeys.forEach(key => app.data.set(key, new Array()));
    listKeys.forEach(key => map.set(key, new Map()));

    app.rawdata.friends.forEach(friend => {
        friend.games.forEach(game => {
            if (app.gameidToGameMap.has(game.app_id)) {
                let gameName = app.gameidToGameMap.get(game.app_id).name;
                addIfExist(map.get("playtime_2_weeks"), gameName, game.playtime_2_weeks);
                addIfExist(map.get("playtime_total"), gameName, game.playtime_total);
                if (game.playtime_2_weeks > 0) {
                    addIfExist(map.get("friends_2_weeks"), gameName, 1);
                    addIfExist(map.get("friends_total"), gameName, 1);
                } else if (game.playtime_total > 0) {
                    addIfExist(map.get("friends_total"), gameName, 1);
                }
            }
        });
    });

    listKeys.forEach(keyMap => {
        map.get(keyMap).forEach((value, key, map) => app.data.get(keyMap).push({
            "y": value,
            "label": key
        }));
    });
    listKeys.forEach(keyMap => {
        app.data.get(keyMap).sort((a, b) => a.y - b.y);
    });
    listKeys.forEach(keyMap => {
        let array = app.data.get(keyMap);
        //filter is not in place
        app.data.set(keyMap, array.filter((a) => a.y > 0));
    });


}

function addIfExist(map, key, value) {
    if (map.has(key)) {
        map.set(key, map.get(key) + value);
    } else {
        map.set(key, value);
    }
}

function initBarChart() {
    app.chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,

        title: {
            text: "Most played games by your friends during the last 2 weeks"
        },
        axisX: {
            interval: 1
        },
        axisY2: {
            interlacedColor: "rgba(1,77,101,.2)",
            gridColor: "rgba(1,77,101,.1)",
            title: "Number of players"
        },
        data: [{
            type: "bar",
            name: "games",
            axisYType: "secondary",
            color: "#014D65",
            dataPoints: [],
        }]
    });
    app.chart.render();
    app.updateViewFilter();
}
