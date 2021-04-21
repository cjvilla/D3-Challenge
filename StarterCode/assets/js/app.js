// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//creating SVG wrapper 
var svg = d3
    .select('.article')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g')
    .attr('transofrm', `translate(${margin.left}), ${margin.top} `);

// id,state,abbr,poverty,povertyMoe,age,
// ageMoe,income,incomeMoe,healthcare,
//healthcareLow,healthcareHigh,obesity,
//obesityLow,obesityHigh,smokes,smokesLow,
//smokesHigh

var chosenXAxis = 'healthcare'

function xScale(data, chosenXAxis)