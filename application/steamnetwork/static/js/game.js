
function showPie(gameName)
{
  let dataset = parseRawData(gameName);
  if(app.isPlaytimeRangeTwoWeeksSTR === 'true')
  {
    dataset = dataset.map(d => ({
      label: d.name,
      count: d.playtime_2_weeks
    }));
  } else {
    dataset = dataset.map(d => ({
      label: d.name,
      count: d.playtime_total
    }));
  }
  dataset = dataset.filter(d => d.count > 0);

let width = 360;
let height = 360;
let radius = Math.min(width, height) / 2;
let color = d3.scaleOrdinal(d3.schemeCategory20b);
let svg = d3.select('.pieChartSVG')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + (width / 2) +
    ',' + (height / 2) + ')');
let arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);
let pie = d3.pie()
  .value(function(d) { return d.count; })
  .sort(null);
let path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d) {
    return color(d.data.label);
  });
}

function hidePie()
{
  clearChart("pieChartContainer", "pieChartSVG");
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
