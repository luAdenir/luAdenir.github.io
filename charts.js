function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//Create the buildCharts function.
function buildCharts(sample) {
  //Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    //Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    
    //Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];

    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    var yticks = otuIds.slice(0, 10).map(numericIds=> {
      return "OTU" + numericIds;
    }).reverse();

    var barData = [
      {
        x:sampleValues.slice(0,10).reverse(),
        y: yticks,
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
      
    ];
   
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     margin: {
       t:30,
       l:120,
     }
    };
    
    Plotly.newPlot("bar", barData, barLayout);

// Bubble Chart
  var bubbleData = [
    {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues
      }
    }
  ];

  var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    xaxis: {title: "OTU ID"} 
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);


// Gauge Chart
var metaData = data.metadata;
var filterArray = metaData.filter((sampleObj) => sampleObj.id == sample);
var result = filterArray[0]; 
var washFreq = result.wfreq;

var gaugeData = [
  {
    domain: washFreq,
    value: washFreq,
    title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
    type: "indicator",
    mode: "gauge+number",
    gauge:{
      bar: {color:"Black"},
      axis: {range: [null, 10], tickwidth: 2},
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "yellowgreen"},
        {range: [8,10], color: "green"}
        ],
      },
  },
];

var gaugeLayout = { 
  width: 500,
  height: 450,
  margin: {t:0, b: 0},
};


Plotly.newPlot("gauge", gaugeData, gaugeLayout);

});
}