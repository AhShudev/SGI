import * as THREE from 'three';

class MyCameraController {
    constructor(camera, target, track) {
        this.camera = camera; 
        this.target = target; // Player Balloon
        this.track = track; 
        this.offsetHeight = 75; // Camera height to the balloon
        this.offsetDistanceX = 5; 
        this.offsetDistanceZ = -75; 
        this.orientation = null; 
    }

    /**
     * Calculated based on the balloon's position and orientation.
     */
    calculateLookAt() {
        return new THREE.Vector3(
            this.target.object.position.x + 2 * Math.sin(this.orientation),
            this.target.object.position.y,
            this.target.object.position.z + 2 * Math.cos(this.orientation)
        );
    }

    /**
     * Updates the camera position and orientation based on the balloon.
     */
    update() {
        if (!this.target || !this.target.position) return;

        this.orientation = this.target.getOrientation();

        // Calculates camera offset based on balloon orientation
        const offsetX = this.offsetDistanceX * Math.sin(this.orientation);
        const offsetZ = this.offsetDistanceZ * Math.cos(this.orientation);

        let direction = this.target.getWindLayer();

        this.camera.position.set(
            this.target.object.position.x - offsetX,
            this.target.object.position.y + this.offsetHeight,
            this.target.object.position.z - offsetZ
        );

        console.log(this.camera.position);

        const lookAtTarget = this.calculateLookAt();
        this.camera.lookAt(lookAtTarget);
    }
}

export { MyCameraController };
