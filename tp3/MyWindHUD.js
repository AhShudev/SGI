import * as THREE from 'three';

/**
 *  Represents a wind HUD in the scene.
 */
class MyWindHUD {

    /**
     * Constructor for the wind HUD.
     */
    constructor() {
        this.windLayers = [
            { direction: new THREE.Vector3(0, 0, 0), label: "No Wind", angle: 0 },   // Layer 0: No wind
            { direction: new THREE.Vector3(0, 0, 1), label: "North", angle: 0 },    // Layer 1: North
            { direction: new THREE.Vector3(0, 0, -1), label: "South", angle: 180 }, // Layer 2: South
            { direction: new THREE.Vector3(1, 0, 0), label: "East", angle: 90 },    // Layer 3: East
            { direction: new THREE.Vector3(-1, 0, 0), label: "West", angle: -90 }   // Layer 4: West
        ];

        this.createWindHUD();
    }

    /**
     * Creates the wind HUD
     */
    createWindHUD() {
        // Creates a HUD container 
        this.windHUD = document.createElement("div");
        this.windHUD.style.position = "absolute";
        this.windHUD.style.bottom = "60px";
        this.windHUD.style.right = "60px";
        this.windHUD.style.width = "120px";
        this.windHUD.style.height = "120px"; 
        this.windHUD.style.border = "2px solid white";
        this.windHUD.style.borderRadius = "50%";
        this.windHUD.style.background = "rgba(0,0,0,0.5)";
        this.windHUD.style.display = "flex";
        this.windHUD.style.alignItems = "center";
        this.windHUD.style.justifyContent = "center";
        this.windHUD.style.flexDirection = "column"; 

        // Creates the wind direction arrow
        this.windArrow = document.createElement("div");
        this.windArrow.style.width = "0";
        this.windArrow.style.height = "0";
        this.windArrow.style.borderLeft = "15px solid transparent";
        this.windArrow.style.borderRight = "15px solid transparent";
        this.windArrow.style.borderBottom = "30px solid lightblue"; 
        this.windArrow.style.transform = "rotate(0deg)";
        this.windArrow.style.marginBottom = "10px"; 

        // Creates the text element below the arrow
        this.windText = document.createElement("div");
        this.windText.style.color = "white";
        this.windText.style.fontSize = "14px";
        this.windText.style.fontFamily = "Arial";
        this.windText.innerText = "No Wind"; // Initially no wind

        // Add elements to the HUD
        this.windHUD.appendChild(this.windArrow);
        this.windHUD.appendChild(this.windText);
        document.body.appendChild(this.windHUD);
    }

    /**
     * Updates the wind HUD based on the current wind layer.
     * @param {*} currentLayer 
     */
    updateWindHUD(currentLayer) {
        let windData = this.windLayers[currentLayer];

        // Updates arrow rotation based on wind direction
        this.windArrow.style.transform = `rotate(${windData.angle}deg)`;

        // Update the text below the arrow
        this.windText.innerText = windData.label;
    }
}

export { MyWindHUD };
