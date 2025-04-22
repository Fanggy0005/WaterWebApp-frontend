// Function to generate tree locations symmetrically centered in the rectangle
function generateTreeLocations(bounds, spacingMeters) {
  var treeLocations = [];
  var northEast = bounds.getNorthEast();
  var southWest = bounds.getSouthWest();

  // Calculate center latitude and longitude
  var centerLat = (northEast.lat + southWest.lat) / 2;
  var centerLng = (northEast.lng + southWest.lng) / 2;

  // Convert spacing in meters to latitude/longitude increments
  var latIncrement = spacingMeters / 111320;
  var lngIncrement = spacingMeters / (111320 * Math.cos(centerLat * Math.PI / 180));

  // Calculate the total number of trees along each axis
  var numTreesLat = Math.floor((northEast.lat - southWest.lat) / latIncrement);
  var numTreesLng = Math.floor((northEast.lng - southWest.lng) / lngIncrement);

  // Adjust start position to ensure symmetry
  var startLat = centerLat - (numTreesLat / 2) * latIncrement;
  var startLng = centerLng - (numTreesLng / 2) * lngIncrement;

  // Generate tree locations symmetrically
  for (var i = 0; i <= numTreesLat; i++) {
    for (var j = 0; j <= numTreesLng; j++) {
      var treeLat = startLat + (i * latIncrement);
      var treeLng = startLng + (j * lngIncrement);
      treeLocations.push([treeLat, treeLng]);
    }
  }

  return treeLocations;
}

// Function to display tree locations on the map
function displayTreeLocations(treeLocations) {
  // Clear existing tree markers (if any)
  if (window.treeMarkers) {
    window.treeMarkers.clearLayers();
  }

  // Create a new layer for tree markers
  window.treeMarkers = L.layerGroup().addTo(map);

    // Add deep red solid markers for each tree location
  treeLocations.forEach(function (location) {
    L.circleMarker(location, {
      radius: 2,
      color: '#cc3333',   // Darker red but not as dark as original
      fillColor: '#cc3333', // Same color for fill
      fillOpacity: 1
    }).addTo(window.treeMarkers);
  });
}

// Update area info and render tree preview
function updateAreaInfo(layer) {
var bounds = layer.getBounds();
var treeLocations = generateTreeLocations(bounds, 10);
var treeNumber = treeLocations.length;

var lengthMeters = calculateDistance(
  bounds.getNorthEast().lat, bounds.getNorthEast().lng,
  bounds.getNorthEast().lat, bounds.getSouthWest().lng
);

var widthMeters = calculateDistance(
  bounds.getNorthEast().lat, bounds.getNorthEast().lng,
  bounds.getSouthWest().lat, bounds.getNorthEast().lng
);

var areaSquareMeters = lengthMeters * widthMeters;
var areaRai = areaSquareMeters / 1600; // Convert to rai (1 rai = 1600 sq meters)

var infoHtml = `
  <h3>Selected Area Information</h3>
  <p>Length: ${lengthMeters.toFixed(0)} meters</p>
  <p>Width: ${widthMeters.toFixed(0)} meters</p>
  <p>Area: ${areaSquareMeters.toFixed(0)} m² (${areaRai.toFixed(0)} rai)</p>
  <h3>Tree Locations</h3>
  <p>Number of trees: ${treeNumber}</p>
`;
document.getElementById('area-info').innerHTML = infoHtml;

// Ensure both functions are called here
function updateTreeDisplay(treeLocations, bounds) {
    displayTreeLocations(treeLocations);  // Show trees on map
    renderTreeCanvas(treeLocations, bounds); // Show trees in the HTML canvas preview
}

function updatePipelineDisplay(treeLocations, bounds) {
    setTimeout(() => {
        renderPipelineCanvas(treeLocations, bounds);
    }, 100);
}

function updatePipelineLength(treeLocations) {
    calculatePipelineLength(treeLocations);
}

function updatePipeSystem(treeLocations) {
  calculateSystem(treeLocations);
}
// Call the functions separately
updateTreeDisplay(treeLocations, bounds);
updatePipelineDisplay(treeLocations, bounds);
updatePipelineLength(treeLocations);
updatePipeSystem(treeLocations);
calculatePipeAndFittings(treeLocations);
}

// Function to render tree layout on canvas
function renderTreeCanvas(treeLocations, areaBounds) {
var canvas = document.getElementById("treeCanvas");
var ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 1000;  // Adjust for better scaling
canvas.height = 800; // Keep it square

// Clear previous drawing
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Define margins for better spacing
const margin = 20;

// Get area bounds
var northEast = areaBounds.getNorthEast();
var southWest = areaBounds.getSouthWest();

// Compute scale factors
var areaWidth = Math.abs(northEast.lng - southWest.lng);
var areaHeight = Math.abs(northEast.lat - southWest.lat);

var scaleX = (canvas.width - 2 * margin) / areaWidth;
var scaleY = (canvas.height - 2 * margin) / areaHeight;

// Draw boundary box
ctx.strokeStyle = "black";
ctx.lineWidth = 2;
ctx.strokeRect(margin, margin, canvas.width - 2 * margin, canvas.height - 2 * margin);

// Draw trees
ctx.fillStyle = "#cc3333";  // Matching color for canvas
treeLocations.forEach(function (location) {
    var x = margin + (location[1] - southWest.lng) * scaleX;
    var y = margin + (northEast.lat - location[0]) * scaleY;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
});
}

// Function to clear canvas
function clearCanvas() {
var canvas = document.getElementById("treeCanvas");
var ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);
}