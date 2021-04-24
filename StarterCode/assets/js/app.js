// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
}
