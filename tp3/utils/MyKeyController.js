import * as THREE from 'three';


class MyKeyController {

    constructor(balloon, game) {
        this.balloon = balloon;     
        this.game = game;
        this.keyState = {}; 
        this.inputDisabled = false;        

        // Add listeners for key presses and releases
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    /**
     * Marks key as pressed
     */
    onKeyDown(event) {
        this.keyState[event.key.toLowerCase()] = true; 
    }

    /**
     * Marks key as released
     */
    onKeyUp(event) {
        this.keyState[event.key.toLowerCase()] = false; 
    }

    disableInput() {
        this.keyState = {}; //Resets the state of the keys
        this.inputDisabled = true;
    }
    
    enableInput() {
        this.inputDisabled = false;
    }

    /**
     * Checks the status of the keys and updates balloon position
     */
    update() {
        if (this.keyState[' ']) { // Spacebar
            this.game.togglePause();
            this.keyState[' '] = false; // Avoid multiple calls by pressing
        }
    
        if (this.keyState['escape']) { // Tecla Esc
            this.game.exitToMenu();
            this.keyState['escape'] = false; 
        }

        if (this.inputDisabled) return;

        if (this.keyState['w']) this.balloon.updatePosition('W');
        if (this.keyState['s']) this.balloon.updatePosition('S');
        if (this.keyState['a']) this.balloon.updatePosition('A');
        if (this.keyState['d']) this.balloon.updatePosition('D');

        this.balloon.switchLayers();
    }
    
}

export { MyKeyController };
