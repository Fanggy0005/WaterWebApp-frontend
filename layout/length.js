function calculatePipelineLength(treeLocations) {
    if (!treeLocations || treeLocations.length === 0) {
      console.warn("No tree locations available for pipeline calculation.");
      return 0;
    }
  
    // Helper function to calculate distance between two points in meters
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000; // Earth's radius in meters
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
  
    // Find unique latitudes (rows) and longitudes (columns)
    let uniqueLats = [...new Set(treeLocations.map(loc => loc[0]))].sort((a, b) => b - a);
    let uniqueLngs = [...new Set(treeLocations.map(loc => loc[1]))].sort((a, b) => a - b);
  
    // Calculate the length of the bounding box using actual boundary coordinates
    let boxLength = uniqueLngs.length > 1
      ? calculateDistance(uniqueLats[0], uniqueLngs[0], uniqueLats[0], uniqueLngs[uniqueLngs.length - 1])
      : 0;
    let verticalLength = uniqueLats.length > 1
      ? calculateDistance(uniqueLats[0], uniqueLngs[0], uniqueLats[uniqueLats.length - 1], uniqueLngs[0])
      : 0;
  
    console.log("Box Length:", boxLength);
    console.log("Vertical Length:", verticalLength);
  
    // Calculate number of horizontal pipeline lines (between unique rows)
    let horizontalLines = uniqueLats.length - 1;
    let totalLength = (boxLength * horizontalLines) + verticalLength;
  
    console.log("Total Pipeline Length:", totalLength);
    document.getElementById('pipelineLength').textContent = totalLength.toFixed(1);
  
    window.boxLength = boxLength;
    window.verticalLength = verticalLength;
  
    return totalLength;
}