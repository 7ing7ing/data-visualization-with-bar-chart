const width = 900;
const height = 500;
const padding = 50;

const svg = d3
  .select("div")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then(function (GDPjson) {
  const dataset = GDPjson.data;

  const years = dataset.map((elem) => {
    return new Date(elem[0]);
  });

  const minBillion = d3.min(dataset, (d) => d[1]);
  const maxBillion = d3.max(dataset, (d) => d[1]);

  const minYear = d3.min(years);
  const maxYear = d3.max(years);

  const xScale = d3
    .scaleTime()
    .domain([minYear, maxYear])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxBillion])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const tooltip = d3
    .select("div")
    .append("div")
    //.append("text")
    .attr("id", "tooltip");

  svg
    .append("g")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis)
    .attr("id", "x-axis");

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .attr("id", "y-axis");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -225)
    .attr("y", 70)
    .text("Gross Domestic Product")
    .attr("fill", "#E05D5D");

  svg
    .append("text")
    .attr("x", 390)
    .attr("y", 490)
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
    .attr("fill", "#E05D5D");
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(years[i])) // i de <data> coincide con i de <years> porque están enlazados.
    .attr("y", (d) => yScale(d[1]))
    .attr("width", 2)
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("fill", "#00A19D")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", function (evt, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(
        d[0].substring(0, 4) +
          " " +
          checkQuarter(d[0]) +
          "<br>" +
          "$" +
          d[1] +
          " Billion"
      );
      //tooltip.style("left", xScale(new Date(d[0])) + 20 + "px");
      //tooltip.style("top", yScale(d[1]) + 20 + "px");
      tooltip.style("position", "absolute");
      tooltip.style("left", evt.pageX + 20 + "px");
      tooltip.style("top", evt.pageY + "px");
      tooltip.attr("data-date", d[0]);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(400).style("opacity", 0);
    });

  function checkQuarter(date) {
    var month = date.substring(5, 7);
    if (month === "01") {
      return "Q1";
    } else if (month === "04") {
      return "Q2";
    } else if (month === "07") {
      return "Q3";
    } else {
      return "Q4";
    }
  }
});
