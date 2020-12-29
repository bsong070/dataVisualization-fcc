const dataset = [12, 31, 22, 17, 25, 18, 29, 14, 9];

d3.select("h2").selectAll("div")
      .data(dataset)
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", (d) => (10*d + "px"))
