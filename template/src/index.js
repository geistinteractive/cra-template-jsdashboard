function print_filter(filter) {
  var f = eval(filter);
  if (typeof f.length != "undefined") {
  } else {
  }
  if (typeof f.top != "undefined") {
    f = f.top(Infinity);
  } else {
  }
  if (typeof f.dimension != "undefined") {
    f = f
      .dimension(function (d) {
        return "";
      })
      .top(Infinity);
  } else {
  }
  console.log(
    filter +
      "(" +
      f.length +
      ") = " +
      JSON.stringify(f)
        .replace("[", "[\n\t")
        .replace(/}\,/g, "},\n\t")
        .replace("]", "\n]")
  );
}
var dayFormat = d3.timeFormat("%d");
var numFormatLg = d3.format("~s");
var numFormat = d3.format(",");
var monthName = d3.timeFormat("%B");
var monthFormat = d3.timeFormat("%m");

function remove_empty_bins(source_group) {
  return {
    all: function () {
      return source_group.all().filter(function (d) {
        return d.value != 0;
      });
    },
  };
}

window.loadData = function (json) {
  var data = JSON.parse(json);
  console.log(data);
  var updateObjects = function (d, i) {
    //basic items. Remove if necessary
    d.Date = new Date(d.fieldData.Date);
    d.Year = d.Date.getFullYear();
    // d.Day = dayFormat(currDate);
    // d.Month = currDate.getMonth();
  };

  data.forEach(updateObjects);
  var facts = crossfilter(data);

  var companiesKey = "Companies::Name";
  var companiesDim = facts.dimension(function (d) {
    return d.fieldData[companiesKey];
  });
  var companiesGroup = companiesDim.group();
  print_filter(companiesGroup);
  window.companiesBarChart = dc.barChart("#companiesBarChart");

  companiesBarChart
    .group(companiesGroup)
    .dimension(companiesDim)
    .renderLabel(true)
    .clipPadding(100)
    .height(400)
    .x(d3.scaleBand())
    .xUnits(dc.units.ordinal)
    .colorAccessor(function (d, i) {
      return i;
    })
    .elasticX(true)
    .elasticY(true)
    .ordinalColors(d3.schemeOranges[7]);

  dc.renderAll();
};
