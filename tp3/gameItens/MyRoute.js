import * as THREE from 'three';

class MyRoute {
    constructor(points, duration = 40) {
        this.points = points; 
        this.duration = duration; 
        this.spline = new THREE.CatmullRomCurve3(points); 
        this.startTime = null; 
    }

    /**
     * Ensures that the animation starts from the starting point.
     */
    start() {
        this.startTime = Date.now(); 
    }

    /**
     * Gets the position at a specific time based on duration.
     * @returns {THREE.Vector3} - The interpolated position.
     */
    getPositionAtTime() {
        if (this.startTime === null) {
            return this.spline.getPointAt(0); 
        }

        // Calculates elapsed time since start in seconds
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const t = (elapsedTime % this.duration) / this.duration; 
        return this.spline.getPointAt(t); 
    }
}

export { MyRoute };
