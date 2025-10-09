import * as THREE from 'three';

class MyPowerUp {
    constructor(graph, powerUpData, loader) {
        this.graph = graph;
        this.powerUpData = powerUpData;
        this.loader = loader;

        // Load the power-up model
        this.object = this.loader.loadNode(this.graph, this.powerUpData.nodeId);

        // Sets the initial movement
        this.initialY = this.object.position.y || 0;
        this.amplitude = 0.5; 
        this.speed = 16;
    }

    /**
     * Updates the object's vertical position based on time
     */
    update() {
        const time = (Date.now() % 6000) / 6000;
        const offset = Math.sin(time * this.speed) * this.amplitude;
        this.object.position.y = this.initialY + offset;
    }
}

export { MyPowerUp };
