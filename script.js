let width = 1000,
  height = 600;

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

    svg
      .append("g")
      .attr("id", "districts")
      .selectAll("path")
      .data(data[0].features)
      .enter()
      .append("path")
      .attr("d", geopath)
      .attr("fill", "black")
      .on("mouseover", (event, d) => { 
        d3.select(".tooltip").html(
          "<h4>" +
            d.properties.Name +
            "</h4>" +
            "Population: " +
            populationData[d.properties.Name.toUpperCase()]
        );

        let path = d3.select(event.currentTarget);
        path.style("stroke", "red").style("stroke-width", 2);
      })
      .on("mouseout", (event, d) => { 
        d3.select(".tooltip").text("");

        let path = d3.select(event.currentTarget);
        path.style("stroke", "none");
      });
  }
);
