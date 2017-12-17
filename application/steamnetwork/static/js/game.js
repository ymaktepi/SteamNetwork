function showPie(gameName) {
    hidePie();
    d3.select('#pieChartContainer').style('display', 'block');
    let dataset = parseRawData(gameName);
    if (app.isPlaytimeRangeTwoWeeksSTR === 'true') {
        dataset = dataset.map(d => ({
            label: d.name,
            count: (d.playtime_2_weeks / 60.0).toFixed(1),
            enabled: true
        }));
    } else {
        dataset = dataset.map(d => ({
            label: d.name,
            count: (d.playtime_total / 60.0).toFixed(1),
            enabled: true
        }));
    }
    app.titlePieChart = "Playtime repartition between friends playing " + gameName;
    dataset = dataset.filter(d => d.count > 0);

    var width = app.pieChartDiameter;
    var height = app.pieChartDiameter;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.scaleOrdinal()
        .range(patternIds.map(id => "url('"+id+"')"));
    /*
      d3.select('#pieChartContainer')
        .attr('width', width)
        .attr('height', height);
    */
    var svg = d3.select('.pieChartSVG')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

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
        .attr('class', 'pieLabel');

    tooltip.append('div')
        .attr('class', 'pieCount');

    tooltip.append('div')
        .attr('class', 'PiePercent');
    var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d', arc)
        //.attr("fill", "url('#texCircles1')")
        .attr('fill', d=> color(d.data.label))
        /*function(d, i) {
        return color(d.data.label);
    })*/
        .each(function(d) {
            this._current = d;
        });

    path.on('mouseover', function(d) {
        var total = d3.sum(dataset.map(function(d) {
            return (d.enabled) ? d.count : 0;
        }));
        var percent = Math.round(1000 * d.data.count / total) / 10;
        tooltip.select('.pieLabel').html(d.data.label);
        tooltip.select('.pieCount').html(d.data.count);
        tooltip.select('.PiePercent').html(percent + '%');
        tooltip.style('display', 'block');
    });

    path.on('mouseout', function() {
        tooltip.style('display', 'none');
    });


    path.on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px');
    });


    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
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
    d3.select('#pieChartContainer').style('display', 'none');
    d3.select(".pieTooltip").remove();
    app.titlePieChart = "Click on a bar to show some details";
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
                "playtime_total": friend.games[i].playtime_total
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
