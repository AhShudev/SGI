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
        this.selectedObject = null; // Object currently selected
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
    init() {
    }

    /**
     * Updates the gui interface
     */
    updateGUI(){
        // Check if camera folder exists and then update it
        if (this.cameraFolder) {
            this.cameraFolder.destroy();
        }
        this.cameraFolder = this.datgui.addFolder("Camera");
        this.initCameraControls();

        // Check if objects folder exists and then update it
        if (this.objectsFolder) {
            this.objectsFolder.destroy();
        }
        this.objectsFolder = this.datgui.addFolder("Objects");
        this.initObjectsControls();

        // Check if lights folder exists and then update it
        if (this.lightsFolder) {
            this.lightsFolder.destroy();
        }
        this.lightsFolder = this.datgui.addFolder("Lights");
        this.initLightsControls();
    }

    /**
     * Initialize camera controls in the GUI
     */
    initCameraControls() {
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

    /**
     * Initialize objects controls in the GUI
     */
    initObjectsControls() {
        // Get object names from the scene graph
        const objectNames = Object.keys(this.contents.graph.nodes);
        const objectSelector = { selected: "" };

        // Dropdown to select objects
        this.objectsFolder.add(objectSelector, 'selected', objectNames)
            .name("Select Object")
            .onChange((name) => this.selectObject(name));

        // Transformation controls
        const folderTransforms = this.objectsFolder.addFolder("Transforms");
        folderTransforms.open();

        const transforms = {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        };

        // Position
        const folderPosition = folderTransforms.addFolder("Translate");
        folderPosition.add(transforms.position, 'x', -10, 10, 0.1).name("Position X").onChange((v) => this.updateTransform('position', 'x', v));
        folderPosition.add(transforms.position, 'y', -10, 10, 0.1).name("Position Y").onChange((v) => this.updateTransform('position', 'y', v));
        folderPosition.add(transforms.position, 'z', -10, 10, 0.1).name("Position Z").onChange((v) => this.updateTransform('position', 'z', v));

        // Rotation
        const folderRotation = folderTransforms.addFolder("Rotate");
        folderRotation.add(transforms.rotation, 'x', 0, Math.PI * 2, 0.01).name("Rotation X").onChange((v) => this.updateTransform('rotation', 'x', v));
        folderRotation.add(transforms.rotation, 'y', 0, Math.PI * 2, 0.01).name("Rotation Y").onChange((v) => this.updateTransform('rotation', 'y', v));
        folderRotation.add(transforms.rotation, 'z', 0, Math.PI * 2, 0.01).name("Rotation Z").onChange((v) => this.updateTransform('rotation', 'z', v));

        // Scale
        const folderScale = folderTransforms.addFolder("Scale");
        folderScale.add(transforms.scale, 'x', 0.1, 5, 0.1).name("Scale X").onChange((v) => this.updateTransform('scale', 'x', v));
        folderScale.add(transforms.scale, 'y', 0.1, 5, 0.1).name("Scale Y").onChange((v) => this.updateTransform('scale', 'y', v));
        folderScale.add(transforms.scale, 'z', 0.1, 5, 0.1).name("Scale Z").onChange((v) => this.updateTransform('scale', 'z', v));

        // Visibility control
        const materialVis = { visible: true };
        this.objectsFolder.add(materialVis, 'visible').name("Visible").onChange((v) => this.updateVisibility(v));

        // Add control for total wireframe
        const wireframeSet = { wireframe: false };
        this.objectsFolder.add(wireframeSet, 'wireframe').name("Wireframe").onChange((value) => this.setWireframeAll(value));
    }

    /**
     * Update object transform
     * @param {string} type Transform type (position, rotation, scale)
     * @param {string} axis Transform axis (x, y, z)
     * @param {number} value New value for the transform
     */
    updateTransform(type, axis, value) {
        if (this.selectedObject) {
            this.selectedObject[type][axis] = value;
        } else {
            console.warn("No object selected or object not found.");
        }
    }

    /**
     * Update object visibility
     * @param {boolean} visible New visibility state
     */
    updateVisibility(isVisible) {
        if (this.selectedObject) {
            this.selectedObject.visible = isVisible;
        } else {
            console.warn("No object selected or object not found.");
        }
    }

    /**
     * Select an object in the scene by name
     * @param {string} name The name of the object
     */
    selectObject(name) {
        this.selectedObject = this.contents.graph.nodes[name];
        if (this.selectedObject) {
            console.log(`Selected object: ${name}`);
        } else {
            console.warn(`Object ${name} not found.`);
        }
    }

    /**
     * Enable or disable wireframe for all objects in the scene
     * @param {boolean} value - Whether to enable wireframe mode
     */
    setWireframeAll(value) {
        if (!this.contents || !this.contents.graph) {
            console.warn("Contents or graph not initialized.");
            return;
        }

        // Recursive function to apply wireframe to compatible objects
        const applyWireframe = (object) => {
            // Handle meshes with material
            if (object.isMesh) {
                if (object.material && !Array.isArray(object.material)) {
                    object.material.wireframe = value;
                    object.material.needsUpdate = true; // Update material
                } else if (Array.isArray(object.material)) {
                    object.material.forEach(mat => {
                        mat.wireframe = value;
                        mat.needsUpdate = true;
                    });
                }
            } else if (object.children && object.children.length > 0) {
                // Recursively apply wireframe to children
                object.children.forEach(child => applyWireframe(child));
            } else {
                console.warn(`Object ${object.name || object.id} does not support wireframe.`);
            }
        };

        // Iterate through all nodes in the graph
        for (const nodeId in this.contents.graph.nodes) {
            const object = this.contents.graph.nodes[nodeId];
            applyWireframe(object);
        }
    }

    /**
     * Initialize lights controls in the GUI
     */
    initLightsControls() {
        if (!this.contents || !this.contents.graph || !this.contents.graph.nodes) {
            console.warn("Graph nodes not initialized or no contents.");
            return;
        }

         // Recursive function to find light objects
        const findLights = (object, lightsSet) => {
            if (object.isLight && !lightsSet.has(object)) {
                lightsSet.add(object);
            }
            if (object.children && object.children.length > 0) {
                object.children.forEach(child => findLights(child, lightsSet));
            }
        };

        // Use a Set to track unique lights
        const lightsSet = new Set();

        // Iterate through all nodes in the graph and collect lights
        for (const nodeId in this.contents.graph.nodes) {
            const object = this.contents.graph.nodes[nodeId];
            findLights(object, lightsSet);
        }

        // Convert Set to array
        const lights = Array.from(lightsSet);

        // Add GUI controls for each light
        lights.forEach(light => {
            const lightFolder = this.lightsFolder.addFolder(light.type);

            // Visibility control
            lightFolder.add(light, 'visible').name("Visible");

            // Intensity control (if applicable)
            if (light.intensity !== undefined) {
                lightFolder.add(light, 'intensity', 0, 10, 0.1).name("Intensity");
            }

            // Color control (if applicable)
            if (light.color) {
                const color = { color: `#${light.color.getHexString()}` }; // Convert color to hex format
                lightFolder.addColor(color, 'color')
                    .name("Color")
                    .onChange((value) => {
                        light.color.set(value); // Update light color
                    });
            }
        });
    }

}

export { MyGuiInterface };