import * as THREE from 'three';
import { MySprite } from './MySprite.js';
import { MyGame } from './MyGame.js';

class MyMenu {
    constructor(app, reader, texture) {
        this.app = app;
        this.reader = reader;
        this.texture = texture;
        this.fontSize = 0.3;
        this.padding = 0.1;
        const columns = 16; 
        const rows = 16;   
        this.sprite = new MySprite(this.texture, columns, rows);

        this.playerName = "";
        this.playerBalloon = null;
        this.opponentBalloon = null;

        this.game = null;

        this.initMenu();
    }

    initMenu() {
        // Create the menu plane
        const planeGeometry = new THREE.PlaneGeometry(15, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x5c5957 });
        this.menuPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.menuPlane.position.set(300, 100, -306)
        this.app.scene.add(this.menuPlane);
        this.app.setCameraFollowTarget(this.menuPlane);
        this.app.activeCamera.position.set(300, 100, -300);

        // Game name and authors
        this.addTextToMenu("FLAMING BALLOONS", -3, 4, this.menuPlane);
        this.addTextToMenu("By Elton Tamele & Maureen Ah-shu", -6, 3.5, this.menuPlane);
        this.addTextToMenu("SGI-FEUP", -1.25, -4, this.menuPlane);

        // Players name
        this.addTextToMenu("Player Name:", -7, 2, this.menuPlane);
        this.playerNameDisplay = this.addTextToMenu(this.playerName || "null", -2, 2, this.menuPlane);

        // Add player balloon and opponent
        this.addTextToMenu("Player Balloon:", -7, 1, this.menuPlane);
        this.playerBalloonDisplay = this.addTextToMenu("null", -6.5, 0, this.menuPlane);
        this.addButton("Choose", -2.5, 0, this.menuPlane, () => this.showBalloonParkingLot(this.reader.getPlayerBalloons(), "player"));

        this.addTextToMenu("Opponent Balloon:", 0.5, 1, this.menuPlane);
        this.opponentBalloonDisplay = this.addTextToMenu("null", 1, 0, this.menuPlane);
        this.addButton("Choose", 5.0, 0, this.menuPlane, () => this.showBalloonParkingLot(this.reader.getOpponentBalloons(), "opponent"));


        // Start Button
        this.startButton = this.addButton("Start", 0.15, -2.75, this.menuPlane, () => {
            if (this.isStartEnabled()) {
                this.startGame();
            } else {
                alert("Please complete all fields before starting the game.");
            }
        });

        // Keyboard listening for name entry
        window.addEventListener("keydown", (event) => this.handleKeyboardInput(event));
    }

    addTextToMenu(text, x, y, plane) {
        const textMesh = this.sprite.createTextMesh(text, this.fontSize, this.padding);
        textMesh.position.set(x, y, 0.05);
        plane.add(textMesh);
        return textMesh;
    }

    handleKeyboardInput(event) {
        if (event.key === "Backspace") {
            this.playerName = this.playerName.slice(0, -1);
        } else if (event.key.length === 1) {
            this.playerName += event.key;
        }

        this.updatePlayerNameDisplay();
    }

    updatePlayerNameDisplay() {
        this.menuPlane.remove(this.playerNameDisplay);
        this.playerNameDisplay = this.addTextToMenu(this.playerName || "null", -2, 2, this.menuPlane);
    }

    updatePlayerBalloon(index) {
        let balloonName = ""
        switch(index) {
            case 1: balloonName = "angry"; break;
            case 2: balloonName = "pinguim"; break;
            case 3: balloonName = "colours"; break;
        }
        this.playerBalloon = balloonName;
        this.menuPlane.remove(this.playerBalloonDisplay);
        this.playerBalloonDisplay = this.addTextToMenu(balloonName || "null", -6.5, 0, this.menuPlane);
    }

    updateOpponentBalloon(index) {
        let opponentName = ""
        switch(index) {
            case 1: opponentName = "bird"; break;
            case 2: opponentName = "bright"; break;
            case 3: opponentName = "mozaic"; break;
        }
        this.opponentBalloon = opponentName;
        this.menuPlane.remove(this.opponentBalloonDisplay);
        this.opponentBalloonDisplay = this.addTextToMenu(opponentName || "null", 1, 0, this.menuPlane);
    }

    addButton(label, x, y, plane, onClick) {
        const buttonGeometry = new THREE.PlaneGeometry(3, 1);
        const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.position.set(x, y, 0.03);

        const textMesh = this.addTextToMenu(label, x - 0.8, y + 0.02, plane);

        button.userData.onClick = onClick;
        plane.add(button);

        // Mouse Click
        window.addEventListener("click", (event) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, this.app.activeCamera);
            const intersects = raycaster.intersectObject(button);
            if (intersects.length > 0 && button.userData.onClick) {
                button.userData.onClick();
            }
        });

        return button;
    }

    showBalloonParkingLot(balloons, owner) {
        const parkingLotPlaneGeometry = new THREE.PlaneGeometry(15, 10);
        const parkingLotPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const parkingLotPlane = new THREE.Mesh(parkingLotPlaneGeometry, parkingLotPlaneMaterial);
        parkingLotPlane.position.set(250, 100, -256);
        this.app.scene.add(parkingLotPlane);
    
        // Configure the camera to view the parking lot
        this.app.activeCamera.position.set(250, 100, -250);
        this.app.setCameraFollowTarget(parkingLotPlane);
    
        const balloonMeshes = [];
        const spacing = 5; 
    
        balloons.forEach((balloon, index) => {
            const balloonMesh = balloon.object.clone(); 
            balloonMesh.scale.set(0.15, 0.15, 0.15);
            balloonMesh.position.set(-spacing + index * spacing, 0, 0.1);
            balloonMesh.userData.index = index+1; 
            balloonMeshes.push(balloonMesh);
            parkingLotPlane.add(balloonMesh); 
        });
    
        // Function to handle balloon selection
        const onSelectBalloon = (event) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            raycaster.setFromCamera(mouse, this.app.activeCamera);
    
            // Check intersections
            const intersects = raycaster.intersectObjects(balloonMeshes, true); 
            if (intersects.length > 0) {
                let selectedBalloon = intersects[0].object;
                while (selectedBalloon.parent && !selectedBalloon.userData.index) {
                    selectedBalloon = selectedBalloon.parent; // Climb the hierarchy
                }
    
                // Retrieves the index of the selected balloon
                const selectedIndex = selectedBalloon.userData.index;
                if (selectedIndex !== undefined) {
                    if (owner === "player") {
                        this.updatePlayerBalloon(selectedIndex);
                    } else {
                        this.updateOpponentBalloon(selectedIndex);
                    }
    
                    // Clear the parking lot and restore the main scene
                    this.app.scene.remove(parkingLotPlane);
                    window.removeEventListener("click", onSelectBalloon);
    
                    this.app.activeCamera.position.set(300, 100, -300);
                    this.app.setCameraFollowTarget(this.menuPlane);
                } else {
                    console.warn("Balloon index not found.");
                }
            }
        };
    
        window.addEventListener("click", onSelectBalloon);
    }

    isStartEnabled() {
        return this.playerName && this.playerBalloon && this.opponentBalloon;
    }

    startGame() {
        console.log("Game Starting");
        this.game = new MyGame(this.app, this.reader, this, this.playerName, this.playerBalloon, this.opponentBalloon);
    }



    endMenu(playerName, playerBalloon, opponentBalloon, winner, loser, winnerTime) {
        if (this.menuPlane) {
            this.app.scene.remove(this.menuPlane);
        }

        // Creates final menu plane
        const planeGeometry = new THREE.PlaneGeometry(15, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
        this.endMenuPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.endMenuPlane.position.set(300, 100, -306);
        this.app.scene.add(this.endMenuPlane);
        this.app.setCameraFollowTarget(this.endMenuPlane);
        this.app.activeCamera.position.set(300, 100, -300);

        // Race results
        this.addTextToMenu("Race Results", -2, 4, this.endMenuPlane);
        this.addTextToMenu(`Player: ${playerName}`, -6, 2, this.endMenuPlane);
        this.addTextToMenu(`Player Balloon: ${playerBalloon}`, -6, 1.0, this.endMenuPlane);
        this.addTextToMenu(`Opponent Balloon: ${opponentBalloon}`, -6, 0, this.endMenuPlane);
        this.addTextToMenu(`Winner: ${winner}`, -6, -1, this.endMenuPlane);
        this.addTextToMenu(`Loser: ${loser}`, -6, -2, this.endMenuPlane);
        this.addTextToMenu(`Winner Time: ${winnerTime}s`, -6, -3, this.endMenuPlane);

        // Adds buttons to restart and return to the home menu
        this.addButton("Restart", 4, 2, this.endMenuPlane, () => this.restartRace());
        this.addButton("Menu", 4, -2, this.endMenuPlane, () => this.returnToMainMenu());
    }
    
    restartRace() {
        if (this.game) {
            this.game = null;
        }
        this.game = new MyGame(this.app, this.reader, this, this.playerName, this.playerBalloon, this.opponentBalloon);
    }
    
    returnToMainMenu() {
        if (this.game) {
            this.playerName = "";
            this.playerBalloon = null;
            this.opponentBalloon = null;

            this.game = null;
        }
        this.app.scene.remove(this.endMenuPlane);
        this.initMenu();
    }
    
}

export { MyMenu };
