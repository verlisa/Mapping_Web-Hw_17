// Store the API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once getting a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var magnitude = feature.properties.mag;
      var color = '';
      if (magnitude >= 0 && magnitude <= 1)
        color = 'lightgreen'
      else if (magnitude > 1 && magnitude <= 2)
        color = 'yellow'
      else if (magnitude > 2 && magnitude <= 3)
        color = 'orange'
      else if (magnitude > 3 && magnitude <= 4)
        color = 'darkorange'
      else if (magnitude > 4 && magnitude <= 5)
        color = 'pink'
      else if (magnitude > 5)
        color = 'red'

      return L.circleMarker(latlng, {
        radius: feature.properties.mag *5,
        color: color,
        fillOpacity:0.8,
        opacity:0.2
      });
    }
  });

  // Sending the earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidmVybGlzYSIsImEiOiJjamV2b3BqaW8wbmNyMnFxajdjZXBnbjJqIn0.lTi5Qa4IjDD37KWWHZAfMw");
  console.log(streetmap)
  
  // Define a baseMaps object to hold the base layers
  var baseMaps = {
    "Street Map": streetmap,
   
  };

  // Create overlay object to hold the overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  var legend = L.control({position: 'bottomright'});

  // function getColor(magnitude) {}
  //   return radius > 5  ? 'red' :
          //  mag > 4  ? 'darkpink' :
          //  mag > 3  ? 'pink' :
          //  mag > 2   ? 'orange' :
          //  mag > 1   ? 'yellow' :
          //  mag > 0   ? 'lightgreen' :
                    
 
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
      colors = [0, 1, 2, 3, 4, 5],
      labels = [];
      
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < colors.length; i++) {
        div.innerHTML +=
        '<i style="background:' + '"></i> ' +
        // '<i style="background:' + getColor(colors[i] + 1) + '"></i> ' +
        colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');
}
    return div;
  };
  legend.addTo(myMap);

}
