
var lightLayer = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    }
)


var map = L.map("map", {
    center:[50,-50],
    zoom: 4
})

lightLayer.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function (data) {

    // var depth_list = []
    // for (let i=0; i < x.features.length; i++) {
    //     var depth = x.features[i].geometry.coordinates[2]
    //     depth_list.push(depth)
    // }
    // var coordinate_list = []
    // for (let i=0; i < x.features.length; i++) {
    //     var coord1 = x.features[i].geometry.coordinates[0]
    //     var coord2 = x.features[i].geometry.coordinates[1]
    //     coordinate_list.push([coord1,coord2])
    // }
    // var magnitude_list = []
    // for (let i=0; i < x.features.length; i++) {
    //     var magnitude = x.features[i].properties.mag
    //     magnitude_list.push(magnitude)
    // }

    function color (depth) {
        if (depth > 90) {
            return "#ff0000"
        }
        else if (depth > 70) {
            return "#FFB000"
        }
        else if (depth > 50) {
            return "#FCFF00"
        }
        else if (depth > 30) {
            return "#84FF00"
        }
        else if (depth > 10) {
            return "#05FF00"
        }
        else{return "#00F2FF"}
    }

    function magnitudeScaler(magnitude){
        if (magnitude === 0){
            return 1
        }
        else {
            return magnitude *4}
    }

    function eqStyle(feature){

        return{
            opacity:1,
            fillOpacity:1,
            fillColor: color(feature.geometry.coordinates[2]),
            color: "#FFFFFF",
            radius: magnitudeScaler(feature.properties.mag),
            stroke: true,
            weight: 1
        }
    }




    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },

        style: eqStyle,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "Magnitude:" + feature.properties.mag + "<br>Coordinates:" + feature.geometry.coordinates[0] + "," + feature.geometry.coordinates[1]
            )
        }

    
    
    }).addTo(map);


    var legend = L.control({position: "topright"})
    
      legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend")
    
        var grades = [0, 10, 30, 50, 70, 90]

    
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: " + color(grades[i] + 1) + "'></i> "
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
    
      legend.addTo(map)
  

});