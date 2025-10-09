import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null
        this.table = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        this.diffuseColor =  "rgb(128,128,128)"
        this.specularColor = "rgb(0,0,0)"
        this.shininess = 0

        // number of samples to use for the curves 
        this.numberOfSamples = 32

        this.mapSize = 4096

        // initialize all objects materials
        this.initMaterials();
    }

    /**
     * initialize objects texture and materials
     */
    initMaterials() {
        // plane related attributes
        this.planeTexture = new THREE.TextureLoader().load('textures/floor.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.RepeatWrapping;

        this.diffusePlaneColor =  "rgb(128,128,128)"
        this.specularPlaneColor = "rgb(0,0,0)"
        this.planeShininess = 30

        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor,
            emissive: "#000000", 
            shininess: this.planeShininess,
            map: this.planeTexture 
        })


        // Walls Material and Texture
        this.wallTexture = new THREE.TextureLoader().load('textures/walls.jpg');
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;

        this.wallMaterial = new THREE.MeshPhongMaterial({ 
            map: this.wallTexture 
        });

        // Paintings Materials and Texture
        this.painting1Texture = new THREE.TextureLoader().load('textures/students.jpg');
        this.painting2Texture = new THREE.TextureLoader().load('textures/painting.JPG');

        this.painting1Material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x000000,
            shininess: 30,
            map: this.painting1Texture
        });

        this.painting2Material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x000000,
            shininess: 30,
            map: this.painting2Texture 
        })

        // Landscape Material and Texture
        this.landscapeTexture = new THREE.TextureLoader().load('textures/landscape.jpg');
        this.landscapeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 30,
            map: this.landscapeTexture
        });

        // Beetle Painting Texture
        this.beetlePaintingTexture = new THREE.TextureLoader().load('textures/frame.jpg');
        this.beetlePaintingMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 30,
            map: this.beetlePaintingTexture
        });

        // Carpet Material and Texture
        this.carpetTexture = new THREE.TextureLoader().load('textures/carpet.jpg');
        this.carpetMaterial = new THREE.MeshPhongMaterial({
            map: this.carpetTexture
        });
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
            specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        this.pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        this.pointLight.position.set( 5, 20, 5 );
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = this.mapSize;
        this.pointLight.shadow.mapSize.height = this.mapSize;
        this.pointLight.shadow.camera.near = 0.5;
        this.pointLight.shadow.camera.far = 100;
        this.app.scene.add( this.pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555, 4 );
        this.app.scene.add( ambientLight );

        this.buildBox()
    
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.planeMesh.position.x = 5;     // +++
        this.planeMesh.position.z = 5;     // +++
        this.planeMesh.receiveShadow = true;
        this.app.scene.add( this.planeMesh );

        // Create Walls
        let wall = new THREE.PlaneGeometry( 10, 5 );
        this.wall1Mesh = new THREE.Mesh( wall, this.wallMaterial );
        this.wall2Mesh = new THREE.Mesh( wall, this.wallMaterial );
        this.wall2Mesh.rotation.y = Math.PI;
        this.wall3Mesh = new THREE.Mesh( wall, this.wallMaterial );
        this.wall3Mesh.rotation.y = -Math.PI / 2;
        this.wall4Mesh = new THREE.Mesh( wall, this.wallMaterial );
        this.wall4Mesh.rotation.y = Math.PI / 2;

        this.wall1Mesh.position.set(5, 2.5, 0);
        this.wall2Mesh.position.set(5, 2.5, 10);
        this.wall3Mesh.position.set(10, 2.5, 5);
        this.wall4Mesh.position.set(0, 2.5, 5);

        this.app.scene.add( this.wall1Mesh );
        this.app.scene.add( this.wall2Mesh );
        this.app.scene.add( this.wall3Mesh );
        this.app.scene.add( this.wall4Mesh );

        // Create a Table above the Floor (Plane Mesh)
        this.table = new MyTable(this)
        this.table.position.x = 5;
        this.table.position.z = 5;
        this.app.scene.add(this.table)

        // Add paintings to wall
        let painting = new THREE.PlaneGeometry( 2, 3 );

        this.painting1Mesh = new THREE.Mesh( painting, this.painting1Material );
        this.painting1Mesh.position.set(-2, 0, 0.01);

        this.painting2Mesh = new THREE.Mesh( painting, this.painting2Material );
        this.painting2Mesh.position.set(2, 0, 0.01);

        this.wall2Mesh.add(this.painting1Mesh);
        this.wall2Mesh.add(this.painting2Mesh);

        // Add landscape to wall
        let landscape = new THREE.PlaneGeometry( 4, 2.5 );
        this.landscapeMesh = new THREE.Mesh( landscape, this.landscapeMaterial );
        this.landscapeMesh.position.set(0.0, 0, 0.01);
        this.wall1Mesh.add(this.landscapeMesh);

        // Add a spotlight
        const spotLightAngle = 40 * (Math.PI / 180);
        this.spotLight = new THREE.SpotLight(0xffe4a8, 9.5, 8.25, spotLightAngle, 0, 0);
        this.spotLight.position.set(3, 6, 8);
        this.spotLight.target = this.table.cakeMesh;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = this.mapSize;
        this.spotLight.shadow.mapSize.height = this.mapSize;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 100;
        this.spotLight.shadow.camera.left = -15;
        this.spotLight.shadow.camera.right = 15;
        this.spotLight.shadow.camera.bottom = -15;
        this.spotLight.shadow.camera.top = 15;
        
        // Add the SpotLight and its helper to the scene
        this.app.scene.add(this.spotLight);
        const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.app.scene.add(spotLightHelper);

        // Add the beetle painting on the wall
        this.beetlePainting = new THREE.PlaneGeometry( 4.5, 3 );
        this.beetlePaintingMesh = new THREE.Mesh( this.beetlePainting, this.beetlePaintingMaterial );
        this.beetlePaintingMesh.position.set(0, 0, 0.01);
        this.wall4Mesh.add(this.beetlePaintingMesh);
        this.drawBeetlePainting();

        // Add carpet to the floor
        this.drawCarpet();
    }

    /**
     * Draws the Beetle Painting on the Wall
     */
    drawBeetlePainting() {
        let arcs = [];

        // Left wheel
        arcs.push(new THREE.CubicBezierCurve3(
            new THREE.Vector3(-0.5, -0.15, 0),
            new THREE.Vector3(-0.4, 0.5, 0),
            new THREE.Vector3(0.4, 0.5, 0),
            new THREE.Vector3(0.5, -0.15, 0)
        ));

        // Right wheel
        arcs.push(new THREE.CubicBezierCurve3(
            new THREE.Vector3(1.5, -0.15, 0), // Starting point
            new THREE.Vector3(1.6, 0.5, 0),   // Control point
            new THREE.Vector3(2.4, 0.5, 0),   // Control point
            new THREE.Vector3(2.5, -0.15, 0)  // End Point
        ));

        // Back of the car
        arcs.push(new THREE.CubicBezierCurve3(
            new THREE.Vector3(-0.5, -0.15, 0), // Starting point
            new THREE.Vector3(-0.4, 0.75, 0),   // Control point
            new THREE.Vector3(0.2, 1.225, 0),   // Control point
            new THREE.Vector3(1.0, 1.25, 0)     // End Point
        ));
    
        // Window
        arcs.push(new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(1.0, 1.25, 0),  // Starting point
            new THREE.Vector3(1.6, 1.2, 0), // Control point
            new THREE.Vector3(1.7, 0.6, 0)   // End Point
        ));

        // Top of the car
        arcs.push(new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(1.7, 0.6, 0),  // Starting point
            new THREE.Vector3(2.4, 0.55, 0), // Control point
            new THREE.Vector3(2.5, -0.15, 0)   // End Point
        ));


        arcs.forEach((curve) => {
            const points = curve.getPoints(this.numberOfSamples);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0x000000 });
            const line = new THREE.Line(geometry, material);
            line.position.set(-1.15, -0.5, 0.05);
            this.beetlePaintingMesh.add(line);
        });
    }

    /**
     * Adds carpet to the floor
     */
    drawCarpet() {
        let carpet = new THREE.PlaneGeometry( 5, 5 );
        const carpetMesh = new THREE.Mesh( carpet, this.carpetMaterial );
        carpetMesh.rotation.x = -Math.PI / 2;
        carpetMesh.position.y = 0.01;
        carpetMesh.position.x = 5;     
        carpetMesh.position.z = 5;    
        carpetMesh.receiveShadow = true;
        this.app.scene.add( carpetMesh );
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };