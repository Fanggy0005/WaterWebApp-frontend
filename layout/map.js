// Set map and locations
var map = L.map('map').setView([14.0, 100.0], 17);

// Use satellite image of Esri(ARC GIS)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri'
}).addTo(map);


// Initialize drawnItems FeatureGroup for our drawn shapes
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Set up the drawing control
var drawControl = new L.Control.Draw({
  draw: {
    // Disable all shapes except rectangle
    polyline: false,
    polygon: false,
    circle: false,
    marker: false,
    circlemarker: false,
    rectangle: {
      shapeOptions: {
        color: '#3388ff'
      },
      showArea: true
    }
  },
  edit: {
    featureGroup: drawnItems,
    remove: true
  }
});

map.addControl(drawControl);

// Variable to store current rectangle
var currentRectangle = null;

// Handle the created rectangle
map.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer;
  
  // If there's already a rectangle, remove it
  if (currentRectangle) {
    drawnItems.removeLayer(currentRectangle);
  }
  
  // Store the new rectangle
  currentRectangle = layer;
  drawnItems.addLayer(layer);
  
  // Calculate and display area information
  updateAreaInfo(layer);
});

// Handle rectangle editing
map.on(L.Draw.Event.EDITED, function (event) {
  var layers = event.layers;
  layers.eachLayer(function (layer) {
    // Update area information
    updateAreaInfo(layer);
  });
});

// Handle rectangle deletion (now also clears tree markers)
map.on(L.Draw.Event.DELETED, function (event) {
  // Clear the area info
  document.getElementById('area-info').innerHTML = 'No area selected.';
  currentRectangle = null;

  // Clear tree markers if they exist
  if (window.treeMarkers) {
    window.treeMarkers.clearLayers();
  }
});

// Function to update area information
function updateAreaInfo(layer) {
  var bounds = layer.getBounds();
  var northEast = bounds.getNorthEast();
  var southWest = bounds.getSouthWest();
  
  var lengthMeters = calculateDistance(
    northEast.lat, northEast.lng,
    northEast.lat, southWest.lng
  );
  
  var widthMeters = calculateDistance(
    northEast.lat, northEast.lng,
    southWest.lat, northEast.lng
  );
}

// Function to calculate distance between two points (in meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371000; // Earth's radius in meters
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}