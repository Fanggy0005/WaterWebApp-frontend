function calculateSystem(treeLocations) {
    // Wait for pipelineRows to be set
    setTimeout(() => {
      let uniqueLngs = [...new Set(treeLocations.map(loc => loc[1]))].sort();
      let treesInOneRow = uniqueLngs.length;
  
      // Debug log to check all parameters
      console.log("Parameters received:", {
        treeLocations: treeLocations,
        treesInOneRow: treesInOneRow,
        pipelineRows: window.pipelineRows
      });
  
      // Check each parameter individually
      if (!treeLocations || !Array.isArray(treeLocations) || treeLocations.length === 0) {
        console.warn("Missing or invalid treeLocations parameter");
        return null;
      }
      if (!treesInOneRow || typeof treesInOneRow !== 'number' || treesInOneRow <= 0) {
        console.warn("Missing or invalid treesInOneRow parameter");
        return null;
      }
      if (!window.pipelineRows || typeof window.pipelineRows !== 'number' || window.pipelineRows <= 0) {
        console.warn("Missing or invalid pipelineRows parameter");
        return null;
      }
  
      let totalLength = calculatePipelineLength(treeLocations);
  
      if (totalLength === 0) {
        console.warn("Pipeline length is zero. Calculation aborted.");
        return null;
      }
  
      let Q = 2.1 * treesInOneRow;
      console.log("Q =", Q);
  
      let Q_all = Q * window.pipelineRows;
      console.log("Q_all =", Q_all);
  
      function cal_PE(Q) {
        let PE;
      
        if (Q <= 42) {
          PE = 32;
        } else if (Q > 42 && Q <= 60) {
          PE = 40;
        } else if (Q > 60 && Q <= 90) {
          PE = 50;
        } else if (Q > 90 && Q <= 130) {
          PE = 63;
        } else if (Q > 130 && Q <= 170) {
          PE = 75;
        } else {
          return "Overdue!";
        }
        return PE;
      }
  
      function loss_PE(Q, PE) {
        let PE_loss;
      
        if (PE === 32) {
          if (Q <= 10) PE_loss = 0.04;
          else if (Q > 10 && Q <= 12) PE_loss = 0.06;
          else if (Q > 12 && Q <= 14) PE_loss = 0.08;
          else if (Q > 14 && Q <= 16) PE_loss = 0.10;
          else if (Q > 16 && Q <= 18) PE_loss = 0.12;
          else if (Q > 18 && Q <= 20) PE_loss = 0.15;
          else if (Q > 20 && Q <= 22) PE_loss = 0.17;
          else if (Q > 22 && Q <= 24) PE_loss = 0.21;
          else if (Q > 24 && Q <= 26) PE_loss = 0.24;
          else if (Q > 26 && Q <= 28) PE_loss = 0.27;
          else if (Q > 28 && Q <= 30) PE_loss = 0.31;
          else if (Q > 30 && Q <= 32) PE_loss = 0.35;
          else if (Q > 32 && Q <= 34) PE_loss = 0.39;
          else if (Q > 34 && Q <= 36) PE_loss = 0.44;
          else if (Q > 36 && Q <= 38) PE_loss = 0.48;
          else if (Q > 38 && Q <= 40) PE_loss = 0.53;
          else PE_loss = 0.58;
        } else if (PE === 40) {
          if (Q > 42 && Q <= 44) PE_loss = 0.21;
          else if (Q > 44 && Q <= 46) PE_loss = 0.23;
          else if (Q > 46 && Q <= 48) PE_loss = 0.25;
          else if (Q > 48 && Q <= 50) PE_loss = 0.27;
          else if (Q > 50 && Q <= 55) PE_loss = 0.32;
          else PE_loss = 0.38;
        } else if (PE === 50) {
          if (Q > 60 && Q <= 65) PE_loss = 0.15;
          else if (Q > 65 && Q <= 70) PE_loss = 0.17;
          else if (Q > 70 && Q <= 75) PE_loss = 0.19;
          else if (Q > 75 && Q <= 80) PE_loss = 0.22;
          else if (Q > 85 && Q <= 85) PE_loss = 0.25;
          else PE_loss = 0.27;
        } else if (PE === 63) {
          if (Q > 90 && Q <= 95) PE_loss = 0.10;
          else if (Q > 95 && Q <= 100) PE_loss = 0.11;
          else if (Q > 100 && Q <= 110) PE_loss = 0.13;
          else if (Q > 110 && Q <= 120) PE_loss = 0.15;
          else PE_loss = 0.18;
        } else if (PE === 75) {
          if (Q > 130 && Q <= 140) PE_loss = 0.09;
          else if (Q > 140 && Q <= 150) PE_loss = 0.10;
          else if (Q > 150 && Q <= 160) PE_loss = 0.11;
          else PE_loss = 0.12;
        } else {
          return "Overdue!";
        }
        return PE_loss;
      }
  
      console.log("loss_PE", loss_PE(33.6, cal_PE(33.6)));
  
      function cal_lossPE(boxLength, PE_loss) {
        let Branch_loss_PE = (boxLength * PE_loss) / 10;
        return Branch_loss_PE;
      }
  
      console.log("cal_lossPE", cal_lossPE(149, 0.44));
  
      function Edit_loss(outhole) {
        let Edit_pipe_loss;
        if (outhole == 1) Edit_pipe_loss = 1;
        else if (outhole == 2) Edit_pipe_loss = 0.512;
        else if (outhole == 3) Edit_pipe_loss = 0.434;
        else if (outhole == 4) Edit_pipe_loss = 0.405;
        else if (outhole == 5) Edit_pipe_loss = 0.380;
        else if (outhole > 5 && outhole <= 10) Edit_pipe_loss = 0.365;
        else if (outhole > 10 && outhole <= 15) Edit_pipe_loss = 0.358;
        else if (outhole > 15 && outhole <= 20) Edit_pipe_loss = 0.354;
        else if (outhole > 20 && outhole <= 30) Edit_pipe_loss = 0.350;
        else if (outhole > 30 && outhole <= 40) Edit_pipe_loss = 0.349;
        else if (outhole > 40 && outhole <= 50) Edit_pipe_loss = 0.348;
        else if (outhole > 50) Edit_pipe_loss = 0.347;
        return Edit_pipe_loss;
      }
  
      console.log("Edit_loss", Edit_loss(16));
  
      function cal_PVC(Q_all) {
        let PVC;
        if (Q_all >= 42 && Q_all <= 100) PVC = 1.25;
        else if (Q_all > 100 && Q_all < 150) PVC = 1.5;
        else if (Q_all > 150 && Q_all <= 260) PVC = 2;
        else if (Q_all > 260 && Q_all <= 420) PVC = 2.5;
        else if (Q_all > 420 && Q_all <= 550) PVC = 3;
        else if (Q_all > 550 && Q_all <= 750) PVC = 4;
        console.log("cal_PVC", PVC);
        return PVC;
      }
  
      function loss_PVC(Q_all, PVC) {
        let loss_PVC;
        if (PVC == 1.25) {
          if (Q_all = 42) loss_PVC = 0.14;
          else if (Q_all > 42 && Q_all <= 44) loss_PVC = 0.15;
          else if (Q_all > 44 && Q_all <= 46) loss_PVC = 0.16;
          else if (Q_all > 24 && Q_all <= 48) loss_PVC = 0.17;
          else if (Q_all > 28 && Q_all <= 50) loss_PVC = 0.19;
          else if (Q_all > 28 && Q_all <= 55) loss_PVC = 0.22;
          else if (Q_all > 28 && Q_all <= 60) loss_PVC = 0.26;
          else if (Q_all > 28 && Q_all <= 65) loss_PVC = 0.30;
          else if (Q_all > 28 && Q_all <= 70) loss_PVC = 0.35;
          else if (Q_all > 28 && Q_all <= 75) loss_PVC = 0.40;
          else if (Q_all > 28 && Q_all <= 80) loss_PVC = 0.45;
          else if (Q_all > 28 && Q_all <= 85) loss_PVC = 0.50;
          else if (Q_all > 28 && Q_all <= 90) loss_PVC = 0.56;
          else if (Q_all > 28 && Q_all <= 95) loss_PVC = 0.62;
          else loss_PVC = 0.68;
        } else if (PVC == 1.5) {
          if (Q_all > 100 && Q_all <= 110) loss_PVC = 0.42;
          else if (Q_all > 110 && Q_all <= 120) loss_PVC = 0.50;
          else if (Q_all > 120 && Q_all <= 130) loss_PVC = 0.58;
          else if (Q_all > 130 && Q_all <= 140) loss_PVC = 0.66;
          else loss_PVC = 0.75;
        } else if (PVC == 2) {
          if (Q_all > 150 && Q_all <= 160) loss_PVC = 0.29;
          else if (Q_all > 160 && Q_all <= 170) loss_PVC = 0.32;
          else if (Q_all > 170 && Q_all <= 180) loss_PVC = 0.36;
          else if (Q_all > 180 && Q_all <= 190) loss_PVC = 0.39;
          else if (Q_all > 190 && Q_all <= 200) loss_PVC = 0.43;
          else if (Q_all > 200 && Q_all <= 220) loss_PVC = 0.52;
          else if (Q_all > 220 && Q_all <= 240) loss_PVC = 0.61;
          else loss_PVC = 0.71;
        } else if (PVC == 2.5) {
          if (Q_all > 260 && Q_all <= 280) loss_PVC = 0.25;
          else if (Q_all > 280 && Q_all <= 300) loss_PVC = 0.28;
          else if (Q_all > 300 && Q_all <= 320) loss_PVC = 0.32;
          else if (Q_all > 320 && Q_all <= 340) loss_PVC = 0.36;
          else if (Q_all > 340 && Q_all <= 360) loss_PVC = 0.40;
          else if (Q_all > 360 && Q_all <= 380) loss_PVC = 0.44;
          else if (Q_all > 380 && Q_all <= 400) loss_PVC = 0.48;
          else loss_PVC = 0.53;
        } else if (PVC == 3) {
          if (Q_all > 420 && Q_all <= 440) loss_PVC = 0.27;
          else if (Q_all > 440 && Q_all <= 460) loss_PVC = 0.29;
          else if (Q_all > 460 && Q_all <= 480) loss_PVC = 0.31;
          else if (Q_all > 480 && Q_all <= 500) loss_PVC = 0.34;
          else loss_PVC = 0.40;
        } else if (PVC == 4) {
          if (Q_all > 550 && Q_all <= 600) loss_PVC = 0.14;
          else if (Q_all > 600 && Q_all <= 650) loss_PVC = 0.16;
          else if (Q_all > 650 && Q_all <= 700) loss_PVC = 0.19;
          else loss_PVC = 0.21;
        }
        console.log("loss_PVC", loss_PVC);
        return loss_PVC;
      }
  
      function cal_lossPVC(verticalLength, loss_PVC) {
        let Main_loss_PVC = (loss_PVC * verticalLength) / 10;
        console.log("verticalLength and loss_PVC", verticalLength, loss_PVC);
        console.log("cal_loss_PVC", Main_loss_PVC);
        return Main_loss_PVC;
      }
  
      /*
      function elbow_loss(PVC) {
        let elbow_lenght;
        if (PVC == 1.25) elbow_lenght = 1.123;
        else if (PVC == 1.5) elbow_lenght = 1.31;
        else if (PVC == 2) elbow_lenght = 1.68;
        else if (PVC == 2.5) elbow_lenght = 1.98;
        else if (PVC == 3) elbow_lenght = 2.47;
        else if (PVC == 4) elbow_lenght = 3.35;
        else if (PVC == 5) elbow_lenght = 4.27;
        else "Overdue!";
        console.log("elbow_lenght", PVC, elbow_lenght);
        return elbow_lenght;
      }
      */
  
      let PE_size = cal_PE(Q);
      let loss_pe_value = loss_PE(Q, PE_size);
      let Head_loss_PE = cal_lossPE(boxLength, loss_pe_value);
      let Total_PE_loss = Head_loss_PE * Edit_loss(treesInOneRow);
  
      let PVC_size = cal_PVC(Q_all);
      let loss_pvc_value = loss_PVC(Q_all, PVC_size);
      let Head_loss_PVC = cal_lossPVC(verticalLength, loss_pvc_value);
      let Total_PVC_loss = Head_loss_PVC * Edit_loss(window.pipelineRows);
  
      let Total_loss = Total_PE_loss + Total_PVC_loss;
      let Pressure_pump = 30 + Total_PE_loss + Total_PVC_loss;
  
      // Store values in the window object
      window.PE_size = PE_size;
      window.PVC_size = PVC_size;
  
      console.log("Pipeline Length:", totalLength.toFixed(1));
      console.log("Selected PE Size:", PE_size.toFixed(1));
      console.log("Selected PVC Size:", PVC_size.toFixed(1));
      console.log("Total PE Loss:", Total_PE_loss.toFixed(2));
      console.log("Total PVC Loss:", Total_PVC_loss.toFixed(2));
      console.log("Total Pressure Loss:", Total_loss.toFixed(2));
  
      document.getElementById('peSize').textContent = PE_size.toFixed(0);
      document.getElementById('pvcSize').textContent = PVC_size.toFixed(0);
      document.getElementById('peLoss').textContent = Total_PE_loss.toFixed(2);
      document.getElementById('pvcLoss').textContent = Total_PVC_loss.toFixed(2);
      document.getElementById('totalLoss').textContent = Total_loss.toFixed(2);
      document.getElementById('pressurePump').textContent = Pressure_pump.toFixed(2);
  
      return {
          totalLength,
          PE_size,
          PVC_size,
          Total_loss
      };
    }, 100); // Wait for pipeline rendering to complete
}