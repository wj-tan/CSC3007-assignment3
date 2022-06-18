let width = 1200,
  height = 800;

let svg = d3.select("svg").attr("viewBox", "0 0 " + width + " " + height);

// Load external data
Promise.all([d3.json("sgmap.json"), d3.csv("population2021.csv")]).then(
  (data) => {
    console.log(data[0]);
    console.log(data[1]);

    // Setting up population data
    populationData = [];
    data[0].features.forEach((element) => {
      // console.log(element)
      data[1].forEach((element2) => {
        // console.log(element2)
        if (
          element.properties.Name.toLowerCase() ==
          element2.Subzone.toLowerCase()
        ) {
          populationData[element.properties.Name] = element2.Population;
        }
      });
    });

    console.log(populationData);

    // Map and projection
    var projection = d3
      .geoMercator()
      .center([103.851959, 1.29027])
      .fitExtent(
        [
          [20, 20],
          [980, 580],
        ],
        data[0]
      );

    let geopath = d3.geoPath().projection(projection);

    // Set up colorscale
    let colorScale = d3
      .scaleOrdinal()
      .domain([0, 64000])
      .range(d3.schemeOrRd[0,9]);

    let legendColor = d3
      .scaleOrdinal()
      .domain([0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000])
      .range(d3.schemeOrRd[9]);

    // Legend
    var legend = d3
      .legendColor()
      .scale(legendColor)
      .shapeWidth(40)
    //   .cells([0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000])
      .orient("horizontal")
      .title("Population");

    svg
      .append("g")
      .attr("transform", "translate(700,500)")
      .style("font-size", "10px")
      .call(legend);

    svg
      .append("g")
      .attr("id", "districts")
      .selectAll("path")
      .data(data[0].features)
      .enter()
      .append("path")
      .attr("d", geopath)
      .attr("fill", (d) =>
        colorScale(populationData[d.properties.Name.toUpperCase()])
      )
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        d3.select(".tooltip")
          // .text(d.properties.Name + "Population: " + populationData[d.properties.Name.toUpperCase()])
          // .style("position", "absolute")
          // .style("background", "#fff")
          // .style("left", (event.pageX) + "px")
          // .style("right", (event.pageY) + "px");
          .html(
            "<h4>" +
              d.properties.Name +
              "</h4>" +
              "Population: " +
              populationData[d.properties.Name.toUpperCase()]
          );

        let path = d3.select(event.currentTarget);
        path.style("stroke", "red").style("stroke-width", 3);
      })
      .on("mouseout", (event, d) => {
        d3.select(".tooltip").text("");

        let path = d3.select(event.currentTarget);
        path.style("stroke", "black").style("stroke-width", 1);
      });
  }
);
