// Use D3 to read in the JSON file
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        //filter data for desired sample number
        var resultsarray = metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0]
            //use d3 to select id of sample metadata
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

        // Build gauge
        // buildGauge(result.wfreq);
    });
}


function buildCharts(sample) {

    // Use `d3.json` to read the sample data for the plots
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0];

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        //  Build bubble Chart 

        var LayoutBubble = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
            margin: { t: 30 }
        };

        var DataBubble = [{
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                size: values,
                colorscale: "Earth"
            }
        }];

        Plotly.newPlot("bubble", DataBubble, LayoutBubble);


        //  Build bar chart

        var bar_data = [{
            y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: values.slice(0, 10).reverse(),
            text: labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"

        }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", bar_data, barLayout);

        buildGauge(result.wfreq);
    });
}

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

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}



// Initialize the dashboard
init();