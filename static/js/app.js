// <------------------------------------------- Initialization function begins ------------------------------------------->

// Set up the init function to create dropdown menu
function init() {
  // Use d3 to select the dropdown menu
  var dropdown_menu = d3.select("#selDataset");
  // Append options, text, and values based on names in the json file
  d3.json("samples.json").then((data) => {
    data.names.forEach((id) => {
      dropdown_menu.append("option")
        .text(id)
        .property("value", id)
    });
  });
};

// Call init() function to initialize dashboard
init();

// <------------------------------------------- Initialization function ends ------------------------------------------->

// <------------------------------------------- optionChanged function begins ------------------------------------------->

// optionChanged function to update html page when the test subject id is changed
function optionChanged(id) {
  d3.json("samples.json").then((data) => {
    // Filtering json for only sample_data that matches id selected from dropdown
    var filtered_sample_data = data.samples.filter((sample) => sample.id == id);
    // Filtering json for only metadata that matches id selected from dropdown
    var filtered_metadata = data.metadata.filter((sample) => sample.id == id);
    // Display bar chart with filtered data
    bar_chart(filtered_sample_data[0]);
    // Display bubble chart with filtered data
    bubble_chart(filtered_sample_data[0]);
    // Display demographic info with filtered data
    demographic_info(filtered_metadata[0]);
  });
};

// <------------------------------------------- optionChanged function ends ------------------------------------------->

// <------------------------------------------- Plotly bar chart function begins ------------------------------------------->

// Function creating bar chart
function bar_chart(person_sample) {
  // Retrieve first ten OTU sample values
  var first_ten_otu_values = person_sample.sample_values.slice(0, 10);
  // Retrieve first ten OTU ids
  var first_ten_otu_ids = person_sample.otu_ids.map((otu_id) => {return "OTU " + otu_id}).slice(0, 10);
  // Retrieve first ten OTU labels
  var first_ten_otu_labels = person_sample.otu_labels;

  // Create trace, we also reverse the arrays so that the OTU with highest sample value is charted first
  var trace1 = {
    x: first_ten_otu_values.reverse(),
    y: first_ten_otu_ids.reverse(),
    text: first_ten_otu_labels.reverse(),
    type: "bar",
    orientation: "h"
  };
  
  // Create data array for plot
  var data = [trace1];

  // Add layout details
  var layout = {
    title: "Top 10 OTUs and Sample Value",
    xaxis: { title: "Sample Value" },
    yaxis: { title: "OTU ID"}
  };

  // Create bar chart at id: "bar"
  Plotly.newPlot("bar", data, layout);
};

// <------------------------------------------- Plotly bar chart function ends ------------------------------------------->

// <------------------------------------------- Plotly bubble chart function begins ------------------------------------------->

// Function creating bubble chart
function bubble_chart(person_sample) {
  // Retrieve OTU ids
  var otu_ids = person_sample.otu_ids;
  // Retrieve OTU sample values
  var sample_values = person_sample.sample_values;
  // Retrieve OTU labels
  var otu_labels = person_sample.otu_labels;

  // Create trace
  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      color: otu_ids,
      size: sample_values
    }
  };

  // Create data array for plot
  var data = [trace1];

  // Add layout details
  var layout = {
    title: "OTU Bubble Chart",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Value"}
  };

  // Create bubble chart at id: "bubble"
  Plotly.newPlot("bubble", data, layout);
};

// <------------------------------------------- Plotly bubble chart function ends ------------------------------------------->

// <------------------------------------------- Demographic info function begins ------------------------------------------->

// Function to populate the Demographic Info panel
function demographic_info(person_sample) {
  // Use d3 to select the demographic info panel
  var demographic_info_panel = d3.select("#sample-metadata");
  // Remove demographic info (if it's present)
  demographic_info_panel.html("")
  // For each metadata key value pair, append h4 tag and info
  Object.entries(person_sample).forEach(([key, value]) => {
    demographic_info_panel.append("h4").text(`${key} : ${value}`)
  });
};

// <------------------------------------------- Demographic info function ends ------------------------------------------->