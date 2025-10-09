import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {}

    /**
     * Updates the gui interface
     */
    updateGUI(){
        // Check if camera folder exists and then update it
        if (this.cameraFolder) {
            this.cameraFolder.destroy();
        }
        this.cameraFolder = this.datgui.addFolder("Camera");
        this.cameraControls();

        // Check if objects folder exists and then update it
        if (this.objectsFolder) {
            this.objectsFolder.destroy();
        }
        this.objectsFolder = this.datgui.addFolder("Objects");
        this.objectsControls();
    }


    /**
     * Initialize camera controls in the GUI
     */
    cameraControls() {
        if (!this.app.cameras) {
            console.warn("No cameras loaded in contents.");
            return;
        }

        // Retrieve cameras from the contents
        const cameraNames = Object.keys(this.app.cameras);

        // Add a dropdown to select the active camera
        this.cameraFolder.add(this.app, 'activeCameraName', cameraNames)
            .name("Active Camera")
            .onChange((cameraName) => this.setActiveCamera(cameraName));
    }

    /**
     * Set the active camera in the app
     * @param {string} cameraName The name of the camera to activate
     */
    setActiveCamera(cameraName) {
        if (this.app.cameras[cameraName]) {
            this.app.setActiveCamera(cameraName);
        } else {
            console.warn(`Camera ${cameraName} not found.`);
        }
    }


    objectsControls() {
        if (!this.contents || !this.contents.gameReader || !this.contents.gameReader.objects) {
            console.warn("No objects found in gameReader.");
            return;
        }
    
        // Create a main folder in the GUI interface
        const objectFolder = this.datgui.addFolder('Objects');
        const objects = this.contents.gameReader.objects;

        // Add controls for each object
        for (const [name, object] of Object.entries(objects)) {
            const objFolder = objectFolder.addFolder(object.name);
    
            const positionFolder = objFolder.addFolder('Position');
            positionFolder.add(object.object.position, 'x', -100, 100).name('X').step(0.1);
            positionFolder.add(object.object.position, 'y', -100, 100).name('Y').step(0.1);
            positionFolder.add(object.object.position, 'z', -100, 100).name('Z').step(0.1);
    
            const rotationFolder = objFolder.addFolder('Rotation');
            rotationFolder.add(object.object.rotation, 'x', 0, Math.PI * 2).name('X').step(0.01);
            rotationFolder.add(object.object.rotation, 'y', 0, Math.PI * 2).name('Y').step(0.01);
            rotationFolder.add(object.object.rotation, 'z', 0, Math.PI * 2).name('Z').step(0.01);

            const scaleFolder = objFolder.addFolder('Scale');
            scaleFolder.add(object.object.scale, 'x', 0.1, 10).name('X').step(0.1);
            scaleFolder.add(object.object.scale, 'y', 0.1, 10).name('Y').step(0.1);
            scaleFolder.add(object.object.scale, 'z', 0.1, 10).name('Z').step(0.1);
    
            objFolder.add(object.object, 'visible').name('Visibility');
        }
    }
    

}

export { MyGuiInterface };