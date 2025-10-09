import * as THREE from 'three';
import { MyBalloon } from './MyBalloon.js';
import { MyTrack } from './MyTrack.js';
import { MyObstacle } from './MyObstacle.js';
import { MyPowerUp } from './MyPowerUp.js';
import { MyLoader } from './../MyLoader.js';

/**
 * 
 */
class MyReader {

    /**
     * 
     * @param {*} scene 
     * @param {*} materials 
     */
    constructor(scene, materials) {
        this.scene = scene; 
        this.materials = materials; 
        this.loader = new MyLoader(this.materials); // YASF Objects Loader
        this.objects = []; 
        this.balloons = [];
        this.playerBalloons = [];
        this.opponentBalloons = [];
        this.track = null;
        this.powerUps = [];
        this.obstacles = [];
    }

    /**
     * Interprets YASF data and instantiates corresponding objects.
     * @param {Object} yasfData - YASF JSON data.
     */
    loadFromYASF(yasfData) {
        // Load balloons
        if (yasfData.balloons) {
            this.loadBalloons(yasfData, yasfData.balloons.children);
        }

        // Load Track 
        this.loadTrack();

        // Load Power-Ups
        if (yasfData.powerups) {
            this.loadPowerUps(yasfData, yasfData.powerups.children);
        }

        // Load Obstacles
        if (yasfData.obstacles) {
            this.loadObstacles(yasfData, yasfData.obstacles.children);
        }
    }

    /**
     * Loads the balloons defined in YASF.
     * @param {Array} graph - YASF file graph
     * @param {Array} balloonData - Balloon data in YASF file.
     */
    loadBalloons(graph, balloonData) {
        // Load all the balloons
        Object.values(balloonData).forEach((data) => {
            const balloon = new MyBalloon(graph, data, this.loader);
            this.objects.push(balloon);
            this.balloons.push(balloon);
        });

        this.setBalloonsMaterials();
    
        // Divide the balloons between player and opponent
        this.playerBalloons = this.balloons.slice(0, 3); 
        this.opponentBalloons = this.balloons.slice(3, 6);
        
        this.setBalloonsNames()
    }
    

    /**
     * Loads Track into the scene.
     */
    loadTrack() {
        const track = new MyTrack();
        this.scene.add(track.object);
        this.objects.push(track);

        this.track = track;
        this.readOpponentRoute();
    }

    /**
     * Load the power-ups in the scene.
     * @param {Array} graph - YASF file graph
     * @param {Array} powerUpData - Power-Ups data in YASF file.
     */
    loadPowerUps(graph, powerUpData) {
        Object.values(powerUpData).forEach((data) => {
            const powerUp = new MyPowerUp(graph, data, this.loader);
            this.scene.add(powerUp.object);
            this.objects.push(powerUp);
            this.powerUps.push(powerUp);
        });

        if (this.powerUps.length >= 3) {
            this.powerUps[0].object.position.set(-100, 0, -200);
            this.powerUps[1].object.position.set(175, 0, 0);
            this.powerUps[2].object.position.set(-100, 0, 275);
        }
    }

    /**
     * Loads obstacles into the scene.
     * @param {Array} graph - YASF file graph
     * @param {Array} obstacleData - Obstacles data in YASF file.
     */
    loadObstacles(graph, obstacleData) {
        Object.values(obstacleData).forEach((data) => {
            const obstacle = new MyObstacle(graph, data, this.loader);
            this.scene.add(obstacle.object);
            this.objects.push(obstacle);
            this.obstacles.push(obstacle);
        });

        if (this.obstacles.length >= 4) {
            this.obstacles[0].object.position.set(0, 0, -275);
            this.obstacles[1].object.position.set(162, 0, 200);
            this.obstacles[2].object.position.set(-175, 0, 135);
            this.obstacles[3].object.position.set(173, 0, -114);
        }
    }

    /**
     * Returns all loaded objects.
     * @returns {Array} - List of loaded objects.
     */
    getLoadedObjects() {
        return this.objects;
    }

    /**
     * Returns loaded player balloons.
     * @returns player balloons.
     */
    getPlayerBalloons() {
        return this.playerBalloons;
    }

    /**
     * Returns a specific loaded player balloon.
     * @returns player balloon.
     */
    findPlayerBalloon(name) {
        return this.playerBalloons.find((balloon) => balloon.object.name === name) || null;
    }

    /**
     * Returns loaded opponent balloons.
     * @returns opponent balloons.
     */
    getOpponentBalloons() {
        return this.opponentBalloons
    }

    /**
     * Returns a specific loaded opponent balloon.
     * @returns opponent balloons.
     */
    findOpponentBalloon(name) {
        return this.opponentBalloons.find((balloon) => balloon.object.name === name) || null;
    }

    /**
     * Returns the loaded track.
     * @returns Loaded Track
     */
    getTrack() {
        return this.track;
    }

    /**
     * Returns the loaded powerUps.
     * @returns Loaded PowerUps list.
     */
    getPowerUps() {
        return this.powerUps;
    }

    /**
     * Returns the loaded obstacles.
     * @returns Loaded PowerUps list.
     */
    getObstacles() {
        return this.obstacles;
    }

    /**
     * Defines routes for each of the loaded opponents balloons.
     */
    readOpponentRoute() {
        if (!this.opponentBalloons || !this.track || !this.track.routes) {
            return;
        }
    
        this.opponentBalloons.forEach((balloon, index) => {
            if (index < this.track.routes.length) {
                balloon.route = this.track.routes[index]; 
            } 
        });
    }

    setBalloonsNames() {
        if (this.playerBalloons) {
            this.playerBalloons[0].object.name = "angry";
            this.playerBalloons[1].object.name = "pinguim";
            this.playerBalloons[2].object.name = "colours";
        }

        if (this.opponentBalloons) {
            this.opponentBalloons[0].object.name = "bird";
            this.opponentBalloons[1].object.name = "bright";
            this.opponentBalloons[2].object.name = "mozaic";
        }
    }

    setBalloonsMaterials() {
        this.balloons.forEach((balloon, index) => {
            const newMaterial = this.materials[`balloon${index + 1}material`];
            if (!newMaterial) {
                return;
            }
            if (balloon.object.material) {
                balloon.object.material.dispose(); 
            }
            let updatedCount = 0;
            balloon.object.traverse((child) => {
                if (updatedCount >= 2) return; 
                if (child.isMesh) {
                    if (child.material) {
                        child.material.dispose();
                    }
                    child.material = newMaterial
                    updatedCount++;
                }
            });
        });
    }
}

export { MyReader };
