// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
	
    // get the metadata field
	let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
	let result = metaData.filter(sampleResult => sampleResult.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
	let select = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
	select.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
	Object.entries(result).forEach(([key, value]) => {
		select.append("h5").text(`${key}: ${value}`);
	});
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
	let sampleData = data.samples;

    // Filter the samples for the object with the desired sample number
	let result = sampleData.filter(sampleResult => sampleResult.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
	let otu_ids = result.otu_ids;
	let otu_labels = result.otu_labels;
	let sample_values = result.sample_values;

    // Build a Bubble Chart
	let bubbleChart = {
		y: sample_values,
		x: otu_ids,
		text: otu_labels,
		mode: "markers",
		marker: {
			size: sample_values,
			color: otu_ids,
			colorscale: "Earth"
		}
	};
	
	let layout1 = {
		title: "Bacteria Cultures Per Sample",
		hovermode: "closest",
		xaxis: {title: "OTU ID"}
	};
	
    // Render the Bubble Chart
	Plotly.newPlot("bubble", [bubbleChart], layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
	yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`);
	xticks = sample_values.slice(0,10);
	textLabels = otu_labels.slice(0,10);
	
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
	let barChart = {
		y: yticks.reverse(),
		x: xticks.reverse(),
		text: textLabels.reverse(),
		type: "bar",
		orientation: "h"
	};
	
	let layout2 = {
		title: "Top 10 Belly Button Bacteria"
	};

    // Render the Bar Chart
	Plotly.newPlot("bar", [barChart], layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
	
    // Get the names field
	let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
	let select = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
	names.forEach((sample) => {
		select.append("option")
			.text(sample)
			.property("value", sample);
	});

    // Get the first sample from the list
	let firstSample = names[0];

    // Build charts and metadata panel with the first sample
	buildMetadata(firstSample);
	buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
	buildMetadata(newSample);
	buildCharts(newSample)
}

// Initialize the dashboard
init();
