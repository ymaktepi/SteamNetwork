'use strict';


var app = new Vue({
    el: "#user",
    delimiters: ["[[", "]]"],
    data: {
        rawdata: undefined,
        personaname: undefined,
        state: "loading",
        gameidToGameMap: undefined,
        gameNameToGameMap: undefined,
        dataPoints: undefined,
        chart: undefined,
        totalMaxGames: 0,
        currentSelectedMaxGames: 1,
        isPlaytimeRangeTwoWeeksSTR: 'true',
        isPlayerSTR: 'true',
        data: undefined,

        chartWidth: 1000,
        pieChartDiameter: 360,

        titleBarChart: "",
        titlePieChart: "Click on a bar to show some details",
    },
    methods: {
        updateViewFilter: function(event) {

            let mapName = "";
            let title = "";
            if (app.isPlayerSTR === 'true') {
                mapName += "friends";
                title += "Number of friends who played each game ";
            } else {
                mapName += "playtime";
                title += "Your friendlist's total playtime for each game ";
            }

            if (app.isPlaytimeRangeTwoWeeksSTR === 'true') {
                mapName += "_2_weeks";
                title += "in the last two weeks";
            } else {
                mapName += "_total";
                title += "since 2009";
            }

            app.titleBarChart = title;

            // set slider size
            let len = app.data.get(mapName).length;
            $('#nbGames').prop({
                'max': len
            });
            app.totalMaxGames = len;

            if (len < app.currentSelectedMaxGames) {
                app.currentSelectedMaxGames = len;
            }

            drawBarChart(app.data.get(mapName));
            let totalWidth = app.chartWidth;
            hidePie();
        }
    }
});

window.onload = getUserInfos;

window.onresize = function() {
    resetChartSize();
    app.updateViewFilter();
};

//pseudo-responsiveness for mobile phones
//based on the bootstrap grid system's sizes
// xs < 576, sm >= 576, md >= 768, lg >= 992, xl >= 1200
function resetChartSize() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    if (w > 1200) {
        app.chartWidth = 1000;
    } else if (w > 992) {
        app.chartWidth = 800;
    } else if (w > 768) {
        app.chartWidth = 650;
    } else if (w > 576) {
        app.chartWidth = 550;
    } else {
        app.chartWidth = 360;
    }
}

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
                populateGameNameToGameMap();
                populateData();
                resetChartSize();
                setTimeout(() => {
                    app.currentSelectedMaxGames = app.nbGames < 10 ? app.nbGames : 10;
                    app.updateViewFilter();
                }, 1);
            }
        }).catch((error) => console.log("Error getting the data: " + error));
}

function populateGameidToGameMap() {
    app.gameidToGameMap = new Map();
    app.rawdata.games.forEach(game => {
        app.gameidToGameMap.set(game.app_id, game);
    });
}

function populateGameNameToGameMap() {
    app.gameNameToGameMap = new Map();
    app.rawdata.games.forEach(game => {
        app.gameNameToGameMap.set(game.name, game);
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
                if (game.playtime_2_weeks > 0) {
                    addIfExist(map.get("playtime_2_weeks"), gameName, game.playtime_2_weeks / 60.0);
                    addIfExist(map.get("playtime_total"), gameName, game.playtime_total / 60.0);
                    addIfExist(map.get("friends_2_weeks"), gameName, 1);
                    addIfExist(map.get("friends_total"), gameName, 1);
                } else if (game.playtime_total > 0) {
                    addIfExist(map.get("playtime_total"), gameName, game.playtime_total / 60.0);
                    addIfExist(map.get("friends_total"), gameName, 1);
                }
            }
        });
    });

    listKeys.forEach(keyMap => {
        map.get(keyMap).forEach((value, key, map) => app.data.get(keyMap).push({
            "value": value,
            "name": key
        }));
    });

    listKeys.forEach(keyMap => {
        let array = app.data.get(keyMap);
        //filter is not in place
        app.data.set(keyMap, array.filter((a) => a.value > 0));
    });

    listKeys.forEach(keyMap => {
        app.data.get(keyMap).sort((a, b) => b.value - a.value);
    });


}

function addIfExist(map, key, value) {
    if (map.has(key)) {
        map.set(key, map.get(key) + value);
    } else {
        map.set(key, value);
    }
}


function clearChart(containerName, chartName) {
    d3.select('.' + chartName).remove();
    d3.select('#' + containerName)
        .append('svg')
        .attr("class", chartName);
}

function clearChart2() {
    d3.select('.barChartSVG').remove();
    d3.select('#barChartContainer')
        .append('svg')
        .attr("class", "barChartSVG");
}

function drawBarChart(allDatas) {

    //clearChart("barChartContainer", "barChartSVG");
    clearChart2();

    let datas = allDatas.slice(0, app.currentSelectedMaxGames);


    let margin = {
        top: 10,
        right: 30,
        bottom: 0,
        left: 200
    };

    let totalWidth = app.chartWidth;
    let barHeight = 12;
    let totalHeight = barHeight * datas.length + margin.top + margin.bottom;

    let width = totalWidth - margin.left - margin.right;
    let height = totalHeight - margin.top - margin.bottom;

    let x = d3.scaleLinear()
        .domain([0, d3.max(datas, data => data.value)])
        .range([0, width]);

    let chart = d3.select(".barChartSVG")
        .attr("width", totalWidth)
        .attr("height", totalHeight);

    var g = chart.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let bar = g.selectAll("g")
        .data(datas)
        .enter().append("g")
        .attr("transform", (data, index) => "translate(0," + (index * barHeight) + ")");


    bar.append("rect")
        .attr("width", data => x(data.value))
        .attr("height", barHeight - 2)
        .attr("y", 1.5)
        .attr("rx", 2)
        .attr("ry", 2)
        .on("click", data => showPie(data.name));

    // text for number of players/hours played
    bar.append("text")
        .attr("text-anchor", "start")
        .attr("x", data => (x(data.value) + 2))
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        //format: integer is not rounded, floats are rounded to 1 decimal point
        // usefull only if we have a small amount of played hours
        .text(data => Number.isInteger(data.value) ? data.value : data.value.toFixed(1));

    // text name of game
    bar.append("text")
        .attr("text-anchor", "end")
        .attr("x", -2)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(data => data.name);
}
