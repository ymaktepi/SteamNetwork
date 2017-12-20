function showPie(gameName) {
    hidePie();
    d3.select('#pieChartContainer').style('display', 'inline').style('height', "100%");
    d3.select('#pieCharLegendContainer').style('display', 'inline').style('height', "100%");
    let dataset = parseRawData(gameName);

    if (app.isPlaytimeRangeTwoWeeksSTR === 'true') {
        app.titlePieChart = "who have played " + gameName + " since they bought the game";
        dataset = dataset.map(d => ({
            label: d.name,
            count: d.playtime_2_weeks,
            steamId: d.steam_id,
            avatar: d.avatar,
        }));
    } else {
        app.titlePieChart = "who have played " + gameName + " during the last two weeks";
        dataset = dataset.map(d => ({
            label: d.name,
            count: d.playtime_total,
            steamId: d.steam_id,
            avatar: d.avatar,
        }));
    }

    app.subTitlePieChart = "Click on the square next to the name to hide the player's record from the graph.";
    dataset = dataset.filter(d => d.count > 0);
    dataset = dataset.sort((a, b) => b.count - a.count);

    // transform into hours
    dataset = dataset.map(d => ({
        label: d.label,
        count: (d.count / 60.0).toFixed(2),
        enabled: true,
        steamId: d.steamId,
        avatar: d.avatar,
    }));

    let lenData = dataset.length;
    dataset = dataset.slice(0, 10); //top 10

    if (dataset.length == lenData) {
        app.titlePieChart = "Friends " + app.titlePieChart;
    } else {
        app.titlePieChart = "Top 10 of friends " + app.titlePieChart;
    }

    var width = app.pieChartDiameter;
    var height = app.pieChartDiameter;
    var legendRectSize = 18;
    var legendSpacing = 4;
    var legendWidth = 150;
    var legendHeight = dataset.length * (legendRectSize + legendSpacing);
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;

    var color = d3.scaleOrdinal()
        .range(patternIds.map(id => "url('" + id + "')"));

    var svg = d3.select('.pieChartSVG')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');
    var pieChartLegendSVG = d3.select('.pieChartLegendSVG')

        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .append('g');

    addTextureDefs(d3.select('.pieChartSVG'));

    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function(d) {
            return d.count;
        })
        .sort(null);

    var tooltip = d3.select('#pieChartContainer')
        .attr('width', width)
        .attr('height', height)
        .append('div')
        .attr('class', 'pieTooltip');

    tooltip.append('div')
        .attr('class', 'pieAvatar')
        .append('img');

    tooltip.append('div')
        .attr('class', 'pieLabel');

    tooltip.append('div')
        .attr('class', 'pieCount');

    tooltip.append('div')
        .html("Click to see his profile");

    var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        //.attr("fill", "url('#texCircles1')")
        .attr('fill', d => color(d.data.label))
        /*function(d, i) {
        return color(d.data.label);
    })*/
        .each(function(d) {
            this._current = d;
        });

    path.on('mouseover', function(d) {

        d3.select(this).attr("fill-opacity", "0.7"); //highlight
        tooltip.select('.pieAvatar').select('img').attr('src', d.data.avatar).attr('alt', 'Avatar image').attr('class', 'img-responsive');
        tooltip.select('.pieLabel').html(d.data.label);
        if (d.data.count > 1)
            tooltip.select('.pieCount').html(d.data.count + ' hours');
        else
            tooltip.select('.pieCount').html(d.data.count + ' hour');
        tooltip.style('display', 'block');
    });

    path.on('click', function(d) {
        window.location.href = "/user/" + d.data.steamId;
    });


    path.on('mouseout', function() {
        tooltip.style('display', 'none');
        d3.select(this).attr("fill-opacity", "1"); //highlight
    });


    path.on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 30) + 'px')
            .style('left', (d3.event.layerX + 5) + 'px');
    });


    var legend = pieChartLegendSVG.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + 0 + ',' + i * height + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)
        .on('click', function(label) {
            var rect = d3.select(this);
            var enabled = true;
            var totalEnabled = d3.sum(dataset.map(function(d) {
                return (d.enabled) ? 1 : 0;
            }));

            if (rect.attr('class') === 'disabled') {
                rect.attr('class', '');
            } else {
                if (totalEnabled < 2) return;
                rect.attr('class', 'disabled');
                enabled = false;
            }

            pie.value(function(d) {
                if (d.label === label) d.enabled = enabled;
                return (d.enabled) ? d.count : 0;
            });

            path = path.data(pie(dataset));

            path.transition()
                .duration(750)
                .attrTween('d', function(d) {
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });
        });

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) {
            return d;
        });
}

function hidePie() {
    clearChart("pieChartContainer", "pieChartSVG");
    clearChart("pieCharLegendContainer", "pieChartLegendSVG");
    d3.select('#pieChartContainer').style('display', 'none');
    d3.select('#pieCharLegendContainer').style('display', 'none');
    d3.select(".pieTooltip").remove();
    app.titlePieChart = "Click on a bar to show some details";
    app.subTitlePieChart = "";
}

function parseRawData(gameName) {
    let game = app.gameNameToGameMap.get(gameName);
    let dataset = [];
    app.rawdata.friends.forEach(friend => {
        let i = indexOfGame(friend.games, game, function(a, b) {
            return a.app_id === b.app_id;
        });
        if (i != -1) {
            dataset.push({
                "name": friend.persona_name,
                "playtime_2_weeks": friend.games[i].playtime_2_weeks,
                "playtime_total": friend.games[i].playtime_total,
                "steam_id": friend.steam_id,
                "avatar": friend.avatar
            });
        }
    });
    return dataset;
}

function indexOfGame(array, value, comparator) {
    let i = 0;
    let toReturn = -1;
    array.forEach(item => {

        if (comparator(value, item)) {
            toReturn = i;
        }
        i++;
    });
    return toReturn;
}
