import * as THREE from 'three';
import { MyKeyController } from './utils/MyKeyController.js';
import { MyCameraController } from './utils/MyCameraController.js';
import { MyHUD } from './MyHUD.js';
import { MyWindHUD } from './MyWindHUD.js';


class MyGame {

    constructor(app, reader, menu, playerName, playerBalloon, opponentBalloon) {
        this.app = app;
        this.reader = reader;
        this.menu = menu;
        this.playerName = playerName;
        this.playerBalloon = playerBalloon;
        this.opponentBalloon = opponentBalloon;

        // Objects
        this.balloonController = null;
        this.cameraController = null;
        this.player = null;
        this.opponent = null;
        this.hud = null;
        this.windHUD = null;
        this.track = null;
        this.powerUps = null;
        this.obstacles = null;

        // Game State
        this.gameState = "Running"
        this.elapsedTime = 0;
        this.startTime = Date.now();
        this.playerLapsCompleted = 0;
        this.totalLaps = 3;
        this.vouchers = 0;

        // Track progress
        this.previousPlayerCheckpoint = 0;
        this.playerLapValidation = true;
        this.previousOpponentCheckpoint = 0;
        this.opponentLapValidation = true;
        this.opponentLapsCompleted = 0;

        this.winner = "";
        this.loser = "";
        this.winnerTime = 0;

        this.initObjects();
    }

    initObjects () {
        this.player = this.reader.findPlayerBalloon(this.playerBalloon);
        this.app.scene.add(this.player.object)
        this.opponent = this.reader.findOpponentBalloon(this.opponentBalloon);
        this.app.scene.add(this.opponent.object)
        this.opponent.route.start();

        this.keyController = new MyKeyController(this.player, this);
        this.app.activeCamera.position.set(0, 150, 0);
        this.app.setCameraFollowTarget(this.player);


        this.track = this.reader.getTrack();
        this.player.position.copy(this.track.initialPosition);

        this.powerUps = this.reader.getPowerUps();
        this.obstacles = this.reader.getObstacles();
        
        //this.cameraController = new MyCameraController(this.app.activeCamera, this.player, this.track);

        // Adds hud visualization
        this.hud = new MyHUD(this.app.scene, this.app.activeCamera);
        this.windHUD = new MyWindHUD();
    }

    update () {
        if (this.gameState === "Paused") {
            this.hud.updateHUD(this.elapsedTime, this.playerLapsCompleted, this.totalLaps, this.vouchers, this.gameState);
            this.keyController.update();
            return; 
        }

        if(this.player && this.gameState === "Running") {
            const now = Date.now();
            this.elapsedTime = (now - this.startTime) / 1000;

            this.checkPlayerLapCompletion();
            this.checkOpponentLapCompletion()

            this.keyController.update();
            //this.cameraController.update(); 
            this.checkIfBalloonIsOffTrack();

            const point = this.opponent.route.getPositionAtTime();
            this.opponent.object.position.copy(point);

            this.powerUps.forEach((powerUp) => {
                powerUp.update();
                this.checkCollisionWithPowerUp(powerUp);
            });

            this.obstacles.forEach((obstacle) => {
                this.checkCollisionWithObstacle(obstacle);
            });

            this.hud.updateHUD(this.elapsedTime, this.playerLapsCompleted, this.totalLaps, this.vouchers, this.gameState);
            this.windHUD.updateWindHUD(this.player.getWindLayer());
        }
    }

    /**
     * Check if the player has completed a lap
     */
    checkPlayerLapCompletion() {
        const balloonPosition = this.player.object.position;
        const closestT = this.track.getClosestPoint(balloonPosition);
    
        if (closestT > 0.9 && this.previousPlayerCheckpoint < 0.1 && this.playerLapValidation) {
            this.playerLapsCompleted += 1;
            this.previousPlayerCheckpoint = 0; 
            this.playerLapValidation = false; 
    
            // Check if the game is finished
            if (this.playerLapsCompleted > this.totalLaps) {
                this.gameState = "Finished";
                this.winner = this.playerName;
                this.loser = "Opponent";
                this.winnerTime = this.elapsedTime;

                this.menu.endMenu(this.playerName, this.playerBalloon, this.opponentBalloon, this.winner, this.loser, this.winnerTime);
            } 
        } else {
            this.previousPlayerCheckpoint = closestT; 
        }
    
        // Enables validation for a new lap when passing through the intermediate lane
        if (closestT > 0.4 && closestT < 0.6) {
            this.playerLapValidation = true;
        }
    }


    /**
     * Check if the player has completed a lap
     */
    checkOpponentLapCompletion() {
        const balloonPosition = this.opponent.object.position;
        const closestT = this.track.getClosestPoint(balloonPosition);
    
        if (closestT > 0.9 && this.previousOpponentCheckpoint < 0.1 && this.opponentLapValidation) {
            this.opponentLapsCompleted += 1;
            this.previousOpponentCheckpoint = 0;
            this.opponentLapValidation = false; 
    
            // Check if the game is finished
            if (this.opponentLapsCompleted > this.totalLaps) {
                this.gameState = "Finished";
                this.winner = "Opponent";
                this.loser = this.playerName;
                this.winnerTime = this.elapsedTime;

                this.menu.endMenu(this.playerName, this.playerBalloon, this.opponentBalloon, this.winner, this.loser, this.winnerTime);
            }
        } else {
            this.previousOpponentCheckpoint = closestT; 
        }
    
        // Enables validation for a new lap when passing through the intermediate lane
        if (closestT > 0.4 && closestT < 0.6) {
            this.opponentLapValidation = true;
        }
    }
    

    checkIfBalloonIsOffTrack() {
        const balloonPosition = this.player.position;
    
        // Calculates the closest point on the track
        const closestT = this.track.getClosestPoint(balloonPosition);
        const trackCenter = this.track.path.getPointAt(closestT);
    
        const balloonXZ = new THREE.Vector3(balloonPosition.x, 0, balloonPosition.z);
        const trackCenterXZ = new THREE.Vector3(trackCenter.x, 0, trackCenter.z);
    
        // Calculates distance in the XZ plane
        const distanceToTrackCenter = balloonXZ.distanceTo(trackCenterXZ);
    
        // Checks if the balloon is off the track and return it to the center
        const outOftrack = (this.track.width / 2) + 35; 
        if (distanceToTrackCenter > outOftrack) {
            this.player.position.set(trackCenter.x, 0, trackCenter.z);
            this.player.object.position.set(trackCenter.x, 0, trackCenter.z);
        }
    }

    checkCollisionWithPowerUp(powerUp) {
        const distance = this.player.object.position.distanceTo(powerUp.object.position);
        const collisionThreshold = 10;
        if (distance < collisionThreshold) {
            this.vouchers += 1;

            // Removes the power-up from the scene to avoid multiple collisions
            this.app.scene.remove(powerUp.object);
            this.powerUps = this.powerUps.filter((p) => p !== powerUp);
        }
    }
    
    checkCollisionWithObstacle(obstacle) {
        const distance = this.player.object.position.distanceTo(obstacle.object.position);
        const collisionThreshold = 10; 
        if (distance < collisionThreshold) {
            if (this.vouchers > 0) {
                this.vouchers -= 1;
            } else {
                this.stopPlayer();
            }
        }
    }

    stopPlayer() {
        const timeToStop = 3000; 
    
        // Disables player movement
        this.keyController.disableInput();
    
        setTimeout(() => {
            this.keyController.enableInput();
        }, timeToStop);
    }

    togglePause() {
        if (this.gameState === "Running") {
            this.gameState = "Paused";
        } else if (this.gameState === "Paused") {
            this.gameState = "Running";
        }
    }

    exitToMenu() {
        this.gameState = "Exited";
        this.menu.initMenu();
    }

    updateFirstPersonCamera() {
        if (!this.cameras.firstPerson || !this.playerBalloon) return;
    
        // Updates the camera position to follow the balloon
        const balloonPosition = this.playerBalloon.object.position.clone();
        this.cameras.firstPerson.position.copy(balloonPosition);
    
        // Sets the camera direction to the front of the balloon
        const forwardVector = new THREE.Vector3(0, 0, -1);
        forwardVector.applyQuaternion(this.playerBalloon.quaternion);
        const target = balloonPosition.clone().add(forwardVector);
        this.cameras.firstPerson.lookAt(target);
    }
}

export { MyGame };
