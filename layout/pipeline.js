// Function to render the pipeline layout on a separate canvas
function renderPipelineCanvas(treeLocations, areaBounds) {
    var canvas = document.getElementById("pipelineCanvas");
    if (!canvas) return; // Ensure canvas exists
  
    var ctx = canvas.getContext("2d");
  
    // Ensure the canvas is cleared before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Set canvas size
    canvas.width = 1000;
    canvas.height = 800;
  
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
  
    if (!treeLocations || treeLocations.length === 0) {
        console.warn("No tree locations available for pipeline.");
        return;
    }
  
    // Find unique latitudes (rows) and longitudes (columns)
    let uniqueLats = [...new Set(treeLocations.map(loc => loc[0]))].sort((a, b) => b - a);
    let uniqueLngs = [...new Set(treeLocations.map(loc => loc[1]))].sort();
  
    // Create a 2D grid for easier row/column connections
    let grid = [];
    for (let lat of uniqueLats) {
        let row = [];
        for (let lng of uniqueLngs) {
            let tree = treeLocations.find(t => t[0] === lat && t[1] === lng);
            if (tree) {
                row.push(tree);
            }
        }
        if (row.length > 0) {
            grid.push(row);
        }
    }
  
    // Count the number of rows and store it globally
    pipelineRows = grid.length - 1;
    window.pipelineRows = pipelineRows;  // Update global value
    console.log('pipelineRows: ', pipelineRows);
  
    // Draw horizontal pipes between rows
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    
    // First, find the rightmost trees in each row
    let rightmostTreesByRow = [];
    grid.forEach(row => {
        if (row.length > 0) {
            // Sort row by longitude (ascending)
            row.sort((a, b) => a[1] - b[1]);
            // Get the rightmost tree
            rightmostTreesByRow.push(row[row.length - 1]);
        }
    });
    
    // Find the overall rightmost longitude
    let rightmostLng = Math.max(...rightmostTreesByRow.map(tree => tree[1]));
    let rightmostX = margin + (rightmostLng - southWest.lng) * scaleX;
    
    // Store information about horizontal lines
    let horizontalLines = [];
  
    // Calculate and draw horizontal lines between rows
    for (let i = 0; i < grid.length - 1; i++) {
        let currentRow = grid[i];
        let nextRow = grid[i + 1];
        
        if (currentRow.length > 0 && nextRow.length > 0) {
            // Calculate Y position between current and next row
            let currentY = margin + (northEast.lat - currentRow[0][0]) * scaleY;
            let nextY = margin + (northEast.lat - nextRow[0][0]) * scaleY;
            let middleY = (currentY + nextY) / 2;
    
            // Find the leftmost and rightmost X coordinates
            let currentRightmostX = margin + (currentRow[currentRow.length - 1][1] - southWest.lng) * scaleX;
            let nextRightmostX = margin + (nextRow[nextRow.length - 1][1] - southWest.lng) * scaleX;
            
            // Use the maximum X from both rows to ensure line extends to rightmost point
            let maxX = Math.max(currentRightmostX, nextRightmostX);
            
            // Make sure horizontal line extends to the global rightmost point if either row has a tree there
            let shouldExtendToRightmost = currentRow.some(tree => tree[1] === rightmostLng) || 
                                          nextRow.some(tree => tree[1] === rightmostLng);
            
            if (shouldExtendToRightmost) {
                maxX = rightmostX;
            }
            
            let firstX = Math.min(
                margin + (currentRow[0][1] - southWest.lng) * scaleX,
                margin + (nextRow[0][1] - southWest.lng) * scaleX
            );
            
            // Store the line information for vertical connection
            horizontalLines.push({
                y: middleY,
                startX: firstX,
                endX: maxX,
                extendsToRightmost: shouldExtendToRightmost
            });
    
            // Draw the horizontal line
            ctx.beginPath();
            ctx.moveTo(firstX, middleY);
            ctx.lineTo(maxX, middleY);
            ctx.stroke();
        }
    }
    
    // Draw vertical line in the rightmost column if we have horizontal lines that reach it
    if (horizontalLines.length > 0) {
        // Filter to only include horizontal lines that extend to the rightmost point
        let rightmostLines = horizontalLines.filter(line => line.extendsToRightmost);
        
        // Only draw vertical line if we have at least two horizontal lines that extend to rightmost point
        if (rightmostLines.length >= 2) {
            // Sort by Y-coordinate (top to bottom)
            rightmostLines.sort((a, b) => a.y - b.y);
            
            // Draw vertical line connecting the first and last horizontal lines
            let topY = rightmostLines[0].y;
            let bottomY = rightmostLines[rightmostLines.length - 1].y;
            
            ctx.beginPath();
            ctx.moveTo(rightmostX, topY);
            ctx.lineTo(rightmostX, bottomY);
            ctx.stroke();
        }
    }
  
    // Draw tree points
    ctx.fillStyle = "#cc3333";
    treeLocations.forEach(location => {
        let x = margin + (location[1] - southWest.lng) * scaleX;
        let y = margin + (northEast.lat - location[0]) * scaleY;
    
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Function to clear the pipeline canvas
function clearPipelineCanvas() {
    var canvas = document.getElementById("pipelineCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}