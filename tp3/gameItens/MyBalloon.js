import * as THREE from 'three';


/**
 * Represents a balloon in the scene.
 */
class MyBalloon {

    /**
     * Constructor for the balloon.
     * @param {*} graph 
     * @param {*} balloonData 
     * @param {*} loader 
     */
    constructor(graph, balloonData, loader) {
        this.graph = graph;
        this.balloonData = balloonData;
        this.loader = loader;
        this.route = null;

        this.object = new THREE.Object3D(); 
        this.position = new THREE.Vector3(0.0, 0.0, 0.0);
        this.radius = 5; 

        // Models
        this.detailedModel = this.createDetailedModel();
        this.billboardModel = this.createBillboardModel();
        this.object.add(this.detailedModel);
        this.object.castShadow = true;
        this.object.receiveShadow = true;

        this.windLayers = [
            { direction: new THREE.Vector3(0, 0, 0), speed: 0 },       // Layer 0: No wind
            { direction: new THREE.Vector3(0, 0, 1), speed: 1.5 },     // Layer 1: North
            { direction: new THREE.Vector3(0, 0, -1), speed: 1.5 },    // Layer 2: South
            { direction: new THREE.Vector3(-1, 0, 0), speed: 1.5 },    // Layer 3: East
            { direction: new THREE.Vector3(1, 0, 0), speed: 1.5 }      // Layer 4: West
        ];
        this.layerHeight = 5;   // Distance between wind layers
        this.maxHeight = 100;   // Maximum height the balloon can reach
        this.orientattion = null;
    }

    /**
     * Creates the detailed model of the balloon.
     * @returns {THREE.Object3D} - Detailed model.
     */
    createDetailedModel() {
        const detailed = this.loader.loadNode(this.graph, this.balloonData.nodeId)

        return detailed;
    }

    /**
     * Creates the simplified model (billboard) of the balloon.
     * @returns {THREE.Sprite} - Simplified model.
     */
    createBillboardModel() {
        const texture = new THREE.TextureLoader().load('scene/textures/balloon5.jpg');
        const material = new THREE.SpriteMaterial({ map: texture });
        const billboard = new THREE.Sprite(material);
        billboard.scale.set(this.radius * 2, this.radius * 3, 1);
        return billboard;
    }

    /**
     * Switches between detailed and simplified models.
     * @param {boolean} useDetailed - Defines whether the detailed model will be used.
     */
    toggleModel(useDetailed) {
        this.object.clear();
        this.object.add(useDetailed ? this.detailedModel : this.billboardModel);
    }

    /**
     * Updates the balloon's position based on user controls.
     * @param {string} control - Controls ("W", "S").
     */
    /*
    updatePosition(control) {
        if (control === 'W') {
            this.position.y = Math.min(this.position.y + 0.1, this.maxHeight); // Up, limited by maximum height
        } else if (control === 'S' && this.position.y > 0) {
            this.position.y = Math.max(this.position.y - 0.1, 0); // Down, limited by the floor
        }
    }
        */

    updatePosition(control) {
        if (control === 'W') {
            this.position.z += 1;
        } else if (control === 'S') {
            this.position.z -= 1;
        } else if (control === 'A') {
            this.position.x += 1;
        } else if (control === 'D') {
            this.position.x -= 1;
        }
    }

    /**
     * Updates the balloon's position based on wind layers.
     */
    switchLayers() {
        // Determine current and next layers
        let lowerLayerIndex = Math.floor(this.position.y / this.layerHeight);
        lowerLayerIndex = Math.max(0, Math.min(lowerLayerIndex, this.windLayers.length - 1));
        const upperLayerIndex = Math.min(lowerLayerIndex + 1, this.windLayers.length - 1);
    
        const lowerLayer = this.windLayers[lowerLayerIndex];
        const upperLayer = this.windLayers[upperLayerIndex];
    
        // Fraction between layers
        const fraction = (this.position.y % this.layerHeight) / this.layerHeight;
    
        // Smooth wind interpolation
        const interpolatedWind = lowerLayer.direction
            .clone()
            .multiplyScalar(1 - fraction)
            .add(upperLayer.direction.clone().multiplyScalar(fraction))
            .multiplyScalar(lowerLayer.speed * (1 - fraction) + upperLayer.speed * fraction);

        // Calculates balloon orientation based on lateral movement
        const movement = this.position;
        if (movement.length() > 0) {
            this.orientation = Math.atan2(movement.x, movement.z); 
        }
    
        // Adds interpolated wind to position
        this.position.add(interpolatedWind);
    
        // Updates the actual position of the balloon
        this.object.position.copy(this.position);
    } 
    
    /**
     * Returns the wind layer where the balloon is located.
     * @returns 
     */
    getWindLayer() {
        const lowerLayerIndex = Math.floor(this.position.y / this.layerHeight);
        const fraction = (this.position.y % this.layerHeight) / this.layerHeight;

        if (fraction > 0.5 && lowerLayerIndex < this.windLayers.length - 1) {
            return lowerLayerIndex + 1; 
        }

        return Math.min(lowerLayerIndex, this.windLayers.length - 1);
    }

    /**
     * Returns the balloon orientation
     */
    getOrientation() {
        return this.orientation;
    }
    

    /**
     * Adds the balloon to the scene.
     * @param {THREE.Scene} scene - Scene where the balloon will be added.
     */
    addToScene(scene) {
        scene.add(this.object);
    }
}

export { MyBalloon };
