
function showPie(gameName)
{
  hidePie();
  d3.select('#pieChartContainer').style('display', 'block');
  let dataset = parseRawData(gameName);
  if(app.isPlaytimeRangeTwoWeeksSTR === 'true')
  {
    dataset = dataset.map(d => ({
      label: d.name,
      count: d.playtime_2_weeks,
      enabled: true
    }));
  } else {
    dataset = dataset.map(d => ({
      label: d.name,
      count: d.playtime_total,
      enabled: true
    }));
  }
  dataset = dataset.filter(d => d.count > 0);

  var width = app.pieChartDiameter;
  var height = app.pieChartDiameter;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;
  var legendRectSize = 18;
  var legendSpacing = 4;

  var color = d3.scaleOrdinal(d3.schemeCategory20b);
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

  var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.pie()
    .value(function(d) { return d.count; })
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
      .attr('fill', function(d, i) {
        return color(d.data.label);
      })                                                        // UPDATED (removed semicolon)
      .each(function(d) { this._current = d; });                // NEW

    path.on('mouseover', function(d) {
      console.log("mousover");
      var total = d3.sum(dataset.map(function(d) {
        return (d.enabled) ? d.count : 0;                       // UPDATED
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
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)                                   // UPDATED (removed semicolon)
      .on('click', function(label) {                            // NEW
        var rect = d3.select(this);                             // NEW
        var enabled = true;                                     // NEW
        var totalEnabled = d3.sum(dataset.map(function(d) {     // NEW
          return (d.enabled) ? 1 : 0;                           // NEW
        }));                                                    // NEW

        if (rect.attr('class') === 'disabled') {                // NEW
          rect.attr('class', '');                               // NEW
        } else {                                                // NEW
          if (totalEnabled < 2) return;                         // NEW
          rect.attr('class', 'disabled');                       // NEW
          enabled = false;                                      // NEW
        }                                                       // NEW

        pie.value(function(d) {                                 // NEW
          if (d.label === label) d.enabled = enabled;           // NEW
          return (d.enabled) ? d.count : 0;                     // NEW
        });                                                     // NEW

        path = path.data(pie(dataset));                         // NEW

        path.transition()                                       // NEW
          .duration(750)                                        // NEW
          .attrTween('d', function(d) {                         // NEW
            var interpolate = d3.interpolate(this._current, d); // NEW
            this._current = interpolate(0);                     // NEW
            return function(t) {                                // NEW
              return arc(interpolate(t));                       // NEW
            };                                                  // NEW
          });                                                   // NEW
      });                                                       // NEW

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });
}

function hidePie()
{
  clearChart("pieChartContainer", "pieChartSVG");
  d3.select('#pieChartContainer').style('display', 'none');
}

function parseRawData(gameName)
{
  let game = app.gameNameToGameMap.get(gameName);
  let dataset = [];
  app.rawdata.friends.forEach(friend => {
    let i = indexOfGame(friend.games, game, function(a, b) { return a.app_id === b.app_id;});
      if(i != -1)
      {
        dataset.push({"name":friend.persona_name, "playtime_2_weeks":friend.games[i].playtime_2_weeks, "playtime_total":friend.games[i].playtime_total});
      }
    });
  return dataset;
}

function indexOfGame(array, value, comparator)
{
  let i = 0;
  let toReturn = -1;
  array.forEach(item => {

    if(comparator(value, item))
    {
      toReturn = i;
    }
    i++;
  });
  return toReturn;
}
