import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';

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
    init() {
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', false).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5);
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective II', 'Left', 'Top', 'Front', 'Right', 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord");

        // add a folder to the gui interface for the point light
        const lightFolder = this.datgui.addFolder('Point Light');
        lightFolder.addColor(this.contents.pointLight, 'color').name('Color');
        lightFolder.add(this.contents.pointLight, 'intensity', 0, 1000).name('Intensity');
        lightFolder.add(this.contents.pointLight.position, 'x', -10, 10).name('X Position');
        lightFolder.add(this.contents.pointLight.position, 'y', 0, 20).name('Y Position');
        lightFolder.add(this.contents.pointLight.position, 'z', -10, 10).name('Z Position');
        lightFolder.add({ toggle: true }, 'toggle').name('Toggle Light').onChange((value) => {
            this.contents.pointLight.intensity = value ? 500 : 0; 
        });

        // Add SpotLight controls
        const spotLightFolder = this.datgui.addFolder('SpotLight');
        spotLightFolder.addColor({ color: this.contents.spotLight.color.getHex() }, 'color')
            .name('Color')
            .onChange((value) => { this.contents.spotLight.color.set(value); });
        spotLightFolder.add(this.contents.spotLight, 'intensity', 0, 40)
            .name("Intensity (cd)")
            .onChange((value) => { this.contents.spotLight.intensity = value; });
        spotLightFolder.add(this.contents.spotLight, 'distance', 0, 20)
            .name("Distance")
            .onChange((value) => { this.contents.spotLight.distance = value; });
        // Convert angle from degrees to radians
        spotLightFolder.add({ angle: THREE.MathUtils.radToDeg(this.contents.spotLight.angle) }, 'angle', 0, 90)
            .name("Spot Angle (°)")
            .onChange((value) => { this.contents.spotLight.angle = THREE.MathUtils.degToRad(value); });
        spotLightFolder.add(this.contents.spotLight, 'penumbra', 0, 1)
            .name("Penumbra")
            .onChange((value) => { this.contents.spotLight.penumbra = value; });
        spotLightFolder.add(this.contents.spotLight, 'decay', 0, 2)
            .name("Decay")
            .onChange((value) => { this.contents.spotLight.decay = value; });
        spotLightFolder.add(this.contents.spotLight.position, 'x', -10, 10)
            .name("Position X")
            .onChange((value) => { this.contents.spotLight.position.x = value; });
        spotLightFolder.add(this.contents.spotLight.position, 'y', -10, 10)
            .name("Position Y")
            .onChange((value) => { this.contents.spotLight.position.y = value; });
        spotLightFolder.add({ toggle: true }, 'toggle').name('Toggle Light').onChange((value) => {
            this.contents.spotLight.intensity = value ? 9.5 : 0; 
        });

        // add a folder to the gui interface for the table
        const tableFolder = this.datgui.addFolder('Table');
        tableFolder.add(this.contents.table, 'visible').name('Table Visibility');
        tableFolder.add(this.contents.table.position, 'x', 1, 9).name('Move Table X');
        tableFolder.add(this.contents.table.position, 'z', 2, 8).name('Move Table Z');
        // Control for the visibility of elements on the table
        tableFolder.add(this.contents.table.cakeMesh, 'visible').name('Cake Visibility');
        tableFolder.add(this.contents.table.paperMesh, 'visible').name('News Visibility');
        tableFolder.add(this.contents.table.jarMesh, 'visible').name('Jar Visibility');
        tableFolder.add(this.contents.table.spiralSpringMesh, 'visible').name('Spiral Visibility');
        tableFolder.add(this.contents.table.juiceMesh, 'visible').name('Juice Visibility');
        tableFolder.add(this.contents.table.cupMesh, 'visible').name('Cup Visibility');
    }
}

export { MyGuiInterface };