import * as THREE from 'three';

class MyHUD {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera; 
    
        this.hudElements = new THREE.Object3D();
        this.createHUD();
    
        this.scene.add(this.hudElements);
    }
    

    /**
     * Creates the visual elements of the HUD
     */
    createHUD() {
        this.createTextElement("Elapsed Time: 00:00", new THREE.Vector3(-5, 3, -5), "time");
        this.createTextElement("Laps: 1/3", new THREE.Vector3(-5, 2.5, -5), "laps");
        this.createTextElement("Vouchers: 0", new THREE.Vector3(-5, 2, -5), "vouchers");
        this.createTextElement("Status: Running", new THREE.Vector3(-5, 1.5, -5), "status");
    }

    /**
     * Creates a text element on the HUD
     * @param {string} text - Text to be displayed
     * @param {THREE.Vector3} position - Position in 3D space
     * @param {string} id - Element identifier (for future updates)
     */
    createTextElement(text, position, id) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 128;

        context.fillStyle = "white";
        context.font = "48px Arial";
        context.fillText(text, 10, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);

        sprite.position.copy(position);
        sprite.scale.set(4, 1, 1);
        sprite.userData.id = id;

        this.hudElements.add(sprite);
    }

    /**
     * Updates HUD elements based on game state
     */
    updateHUD(elapsedTime, lapsCompleted, totalLaps, vouchers, gameStatus) {
        this.updateTextElement("time", `Elapsed Time: ${this.formatTime(elapsedTime)}`);
        this.updateTextElement("laps", `Laps: ${lapsCompleted}/${totalLaps}`);
        this.updateTextElement("vouchers", `Vouchers: ${vouchers}`);
        this.updateTextElement("status", `Status: ${gameStatus}`);

        this.updateHUDPosition();
    }

    /**
     * Updates a text element in the HUD
     * @param {string} id - Element identifier
     * @param {string} newText - New text to be displayed
     */
    updateTextElement(id, newText) {
        const element = this.hudElements.children.find((child) => child.userData.id === id);
        if (element) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = 512;
            canvas.height = 128;

            context.fillStyle = "white";
            context.font = "48px Arial";
            context.fillText(newText, 10, 64);

            element.material.map.dispose();
            element.material.map = new THREE.CanvasTexture(canvas);
        }
    }

    /**
     * Formats elapsed time in MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} - Formatted time
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    /**
     * Updates HUD position to follow camera
     */
    updateHUDPosition() {
        this.hudElements.position.copy(this.camera.position);
        this.hudElements.quaternion.copy(this.camera.quaternion);
    }
}

export { MyHUD };
