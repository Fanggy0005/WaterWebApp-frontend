function calculatePipeAndFittings(treeLocations) {
    setTimeout(() => {
        // Determine pipe sizes (adjust as needed)
        let PVC_size = window.PVC_size; // Example PVC size
        let PE_size = window.PE_size; // Example PE size
        
        // Get costs from calculate.js
        let mainPipeCost = mainPipe_cost(PVC_size) || 0;
        let subMainPipeCost = subMainPipe_cost(PE_size) || 0;
        let elbowCost = elbow_cost(PVC_size) || 0;
        let teesCost = tees_cost(PVC_size) || 0;
        
        // Get unique latitudes and longitudes
        let uniqueLats = [...new Set(treeLocations.map(loc => loc[0]))].sort((a, b) => b - a);
        let uniqueLngs = [...new Set(treeLocations.map(loc => loc[1]))].sort();
        
        // Calculate main pipe length (vertical) and submain pipe length (horizontal) using actual measurements
        let pipelineRows = typeof window.pipelineRows === 'number' ? window.pipelineRows : 0;
        
        // Calculate vertical length (main pipe)
        let verticalLength = uniqueLats.length > 1
            ? calculateDistance(uniqueLats[0], uniqueLngs[0], uniqueLats[uniqueLats.length - 1], uniqueLngs[0])
            : 0;

        console.log("verticalLength: ", verticalLength);
            
        // Calculate horizontal length (submain pipe)
        let boxLength = uniqueLngs.length > 1
            ? calculateDistance(uniqueLats[0], uniqueLngs[0], uniqueLats[0], uniqueLngs[uniqueLngs.length - 1])
            : 0;
        let horizontalLines = uniqueLats.length - 1;
        let horizontalLength = boxLength * horizontalLines;

        console.log("horizontalLength: ", horizontalLength);
        
        // Calculate number of straight pipes (each 20 cm)
        let straightPipeLength = 1;
        let numMainPipes = Math.ceil(verticalLength / straightPipeLength);
        let numSubmainPipes = Math.ceil(horizontalLength / straightPipeLength);

        // Calculate number of 90-degree elbows
        let numElbows = 2;

        // Calculate number of tees
        let numTees = Math.max(0, pipelineRows - 2);
        
        function mainPipe_cost(PVC_size){
            let cost_PVC;
            if (PVC_size === 1.25) cost_PVC = 10.45;
            else if (PVC_size === 1.5) cost_PVC = 13.7;
            else if (PVC_size === 2) cost_PVC = 21.6;
            else if (PVC_size === 2.5) cost_PVC = 342;
            else if (PVC_size === 3) cost_PVC = 474;
            else if (PVC_size === 4) cost_PVC = 768;
            console.log("size_PVC: ", PVC_size);
            return cost_PVC;
        
        }
        
        function subMainPipe_cost(PE_size){
            let cost_PE;
            if (PE_size === 32) cost_PE = 17.1;
            else if (PE_size === 40) cost_PE = 24.6;
            else if (PE_size === 50) cost_PE = 39.6;
            else if (PE_size === 63) cost_PE = 36.4;
            else if (PE_size === 75) cost_PE = 48.7;
            
            return cost_PE;
        
        }
        
        function elbow_cost(PVC_size){
            let cost_elbow;
            if (PVC_size === 1.25) cost_elbow = 17.50;
            else if (PVC_size === 1.5) cost_elbow = 22;
            else if (PVC_size === 2) cost_elbow = 33.20;
            else if (PVC_size === 2.5) cost_elbow = 70.20;
            else if (PVC_size === 3) cost_elbow = 98.40;
            else if (PVC_size === 4) cost_elbow = 192;
            
            return cost_elbow;
        
        }
        
        function tees_cost(PVC_size){
            let cost_tees;
            if (PVC_size === 1.25) cost_tees = 17.50;
            else if (PVC_size === 1.5) cost_tees = 22;
            else if (PVC_size === 2) cost_tees = 33.20;
            else if (PVC_size === 2.5) cost_tees = 70.20;
            else if (PVC_size === 3) cost_tees = 98.40;
            else if (PVC_size === 4) cost_tees = 192;
            
            return cost_tees;
        
        }
        // Create table data with separate pipe types
        const tableData = [
            { no: 1, product: 'Main Pipe (PVC)', quantity: numMainPipes, pricePerUnit: mainPipeCost, totalPrice: numMainPipes * mainPipeCost },
            { no: 2, product: 'Submain Pipe (PE)', quantity: numSubmainPipes, pricePerUnit: subMainPipeCost, totalPrice: numSubmainPipes * subMainPipeCost },
            { no: 3, product: '90-degree Elbow (PVC)', quantity: numElbows, pricePerUnit: elbowCost, totalPrice: numElbows * elbowCost },
            { no: 4, product: 'Tee (PVC)', quantity: numTees, pricePerUnit: teesCost, totalPrice: numTees * teesCost }
        ];

        // Calculate the final price (sum of all total prices)
        const finalPrice = tableData.reduce((sum, row) => sum + row.totalPrice, 0);

        // Add final price row
        tableData.push({
            no: '',
            product: 'Total Price',
            quantity: '',
            pricePerUnit: '',
            totalPrice: finalPrice
        });

        // Update existing table
        const tbody = document.getElementById('pipeTableBody');
        tbody.innerHTML = tableData.map(row => `
            <tr>
                <td>${row.no}</td>
                <td>${row.product}</td>
                <td>${row.quantity}</td>
                <td>${row.pricePerUnit ? row.pricePerUnit.toFixed(2) : ''}</td>
                <td>${row.totalPrice.toFixed(2)}</td>
            </tr>
        `).join('');

        return {
            numMainPipes,
            numSubmainPipes,
            numElbows,
            numTees
        };
    }, 200);
}

function showPipeTable() {
    document.getElementById('pipeLength').classList.add('hidden');
    document.getElementById('tableContainer').classList.remove('hidden');
}