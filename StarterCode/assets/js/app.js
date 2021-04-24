// set up chart
var svgWidth = 900;
var svgHeight = 500;

//
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(health_data, chosenXAxis) {
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(health_data, (d) => d[chosenXAxis] * 0.95),
      d3.max(health_data, (d) => d[chosenXAxis] * 1.03),
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(health_data, chosenYAxis) {
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(health_data, (d) => d[chosenYAxis]) - 1,
      d3.max(health_data, (d) => d[chosenYAxis]) + 1,
    ])
    .range([height, 0]);

  return yLinearScale;
}

function tooltip(object, chosenXAxis, chosenYAxis) {
  var labelX;
  var labelY;

  if (chosenXAxis === "poverty") {
    labelX = "Poverty: ";
  } else if (chosenXAxis === "age") {
    labelX = "Age: ";
  } else {
    labelX = "Income: ";
  }

  if (chosenYAxis === "healthcare") {
    labelY = "Healthcare: ";
  } else if (chosenYAxis === "smoke") {
    labelY = "Smoke: ";
  } else {
    labelY = "Obesity: ";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(
      (d) =>
        `${d.state}<br>${labelX}${d[chosenXAxis]}<br>${labelY}${d[chosenYAxis]}`
    );

  object.call(toolTip);

  object
    .on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });
}

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

function renderYAxes(newXScale, yAxis) {
  var leftAxis = d3.axisLeft(newXScale);

  yAxis.transition().duration(1000).call(leftAxis);

  return yAxis;
}

function makeCircle(
  circlesGroup,
  newXScale,
  chosenXAxis,
  circlestxt,
  axis
) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr(`c${axis}`, (d) => newXScale(d[chosenXAxis]));

  circlestxt
    .transition()
    .duration(1000)
    .attr(axis, (d) => newXScale(d[chosenXAxis]) + n);

  return circlesGroup, circlestxt;
}

function parseData(csv, Axis) {
  csv.forEach((data) => {
    data[Axis] = +data[Axis];
  });
}

d3.csv("./assets/data/data.csv")
  .then((csv_data, error) => {
    if (error) throw error;

    parseData(csv_data, chosenXAxis);
    parseData(csv_data, chosenYAxis);

    console.log(d3.min(csv_data, (d) => d.smokes) + 1);
    console.log(d3.max(csv_data, (d) => d.smokes) - 1);

    var yLinearScale = yScale(csv_data, chosenYAxis);
    var xLinearScale = xScale(csv_data, chosenXAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup
      .append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, ${height}+1)`)
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle").data(csv_data).enter();

    var circles = circlesGroup
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", 10)
      .classed("stateCircle", true)
      .attr("cursor", "pointer");

    var circlesText = circlesGroup
      .append("text")
      .text((d) => d.abbr)
      .attr("x", (d) => xLinearScale(d[chosenXAxis]))
      .attr("y", (d) => yLinearScale(d[chosenYAxis]) + 3.5)
      .classed("stateText", true)
      .attr("font-size", "10px")
      .attr("cursor", "pointer");

    var labelsGroupX = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var labelsGroupY = chartGroup
      .append("g")
      .attr("transform", `translate(${width - 795}, ${height / 2})`);

    var povertyLabel = labelsGroupX
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty")
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = labelsGroupX
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age")
      .classed("inactive", true)
      .text("Age (Median)");

    var houseLabel = labelsGroupX
      .append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Household Income (Median)");

    var healthLabel = labelsGroupY
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", 0)
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Heathcare (%)");

    var smokeLabel = labelsGroupY
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", -20)
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var obeseLabel = labelsGroupY
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y", -40)
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obese (%)");

    tooltip(circles, chosenXAxis, chosenYAxis);
    tooltip(circlesText, chosenXAxis, chosenYAxis);

    labelsGroupX.selectAll("text").on("click", function () {
      var value = d3.select(this).attr("value");

      if (value !== chosenXAxis) {
        chosenXAxis = value;
        parseData(csv_data, chosenXAxis);
        xLinearScale = xScale(csv_data, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = makeCircle(
          circles,
          xLinearScale,
          chosenXAxis,
          circlesText,
          "x",
          0
        );

        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          houseLabel.classed("active", false).classed("inactive", true);
        } else if (chosenXAxis === "age") {
          povertyLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", true).classed("inactive", false);
          houseLabel.classed("active", false).classed("inactive", true);
        } else {
          povertyLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", false).classed("inactive", true);
          houseLabel.classed("active", true).classed("inactive", false);
        }
      }
    });

    labelsGroupY.selectAll("text").on("click", function () {
      var value = d3.select(this).attr("value");

      if (value !== chosenYAxis) {
        chosenYAxis = value;
        parseData(csv_data, chosenYAxis);
        yLinearScale = yScale(csv_data, chosenYAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        circlesGroup = makeCircle(
          circles,
          yLinearScale,
          chosenYAxis,
          circlesText,
          "y",
          3.5
        );

        if (chosenYAxis === "healthcare") {
          healthLabel.classed("active", true).classed("inactive", false);
          smokeLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "smokes") {
          healthLabel.classed("active", false).classed("inactive", true);
          smokeLabel.classed("active", true).classed("inactive", false);
          obeseLabel.classed("active", false).classed("inactive", true);
        } else {
          healthLabel.classed("active", false).classed("inactive", true);
          smokeLabel.classed("active", false).classed("inactive", true);
          obeseLabel.classed("active", true).classed("inactive", false);
        }
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });