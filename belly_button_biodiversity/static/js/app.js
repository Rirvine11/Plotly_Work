function buildMetadata(sample) {

    d3.json("/metadata/" + sample).then(function(response){
      console.log(response);
      selection = d3.select("#sample-card").select("#sample-metadata")
      console.log(selection)
      selection.html("");
      var table = selection.append("table")
      .append("tbody")
  
      Object.entries(response).forEach(([key, value]) => {
        var row = table.append("tr")
        row.append("td").text(key, ": ");
        row.append("td").text(value)
        
      });
      
    }); 
  
  }
  
  function buildCharts(sample) {
  
    d3.json("/samples/" + sample).then(function(response){
      console.log(response);
     
      var otuId = response.otu_ids;
      var sliceotuId = otuId.slice(0, 10);
      var sampleValue = response.sample_values;
      var slicesampleValue = sampleValue.slice(0,10);
      var otuLabels = response.otu_labels;
      var sliceotuLabels = otuLabels.slice(0,10);
          var trace1 = {
            labels : sliceotuId,
            values : slicesampleValue,
            hovertext : sliceotuLabels,
            type : "pie"
            
          }
       
       var layout = {
        height: 400,
        width: 400
      
      };
      var trace2 = {
        x : otuId,
        y : sampleValue,
        mode : 'markers',
        marker: {
          color : otuId,
          size: sampleValue
        },
        hovertext : otuLabels
      };
      var layout2 = {
        showlegend : false,
        tickvalue : otuId,
        
      }
      Plotly.newPlot("pie", [trace1], layout);
      Plotly.newPlot("bubble", [trace2], layout2)
      
    });
    };
  
  
    function init() {
      //   // Grab a reference to the dropdown select element
         var selector = d3.select("#selDataset");
      
      // //   // Use the list of sample names to populate the select options
         d3.json("/names").then((sampleNames) => {
           sampleNames.forEach((sample) => {
             selector
              .append("option")
              .text(sample)
              .property("value", sample);
          });
      
      // //     // Use the first sample from the list to build the initial plots
          const firstSample = sampleNames[0];
          buildCharts(firstSample);
          buildMetadata(firstSample);
          buildGauge(firstSample);
        });
      }
      
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  