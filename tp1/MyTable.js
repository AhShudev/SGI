import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';


class MyTable extends THREE.Object3D {

    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

        this.builder = new MyNurbsBuilder();
        this.paperMesh = null;
        this.jarMesh = null;
        this.flowerMesh = null;
        this.samplesU = 30; 
        this.samplesV = 30;

        this.initMaterials();
        this.drawTable();
    }

    initMaterials() {
        // Table Top Material and Texture
        this.tableTopTexture = new THREE.TextureLoader().load('textures/table.jpg');
        this.tableTopTexture.wrapS = THREE.RepeatWrapping;
        this.tableTopTexture.wrapT = THREE.RepeatWrapping;

        this.tableTopMaterial = new THREE.MeshPhongMaterial({
            color: 0x7d5d38,
            specular: 0x000000,
            emissive: "#000000", 
            shininess: 30,
            map: this.tableTopTexture 
        }); 

        // Table Legs Specular Material 
        this.tableLegMaterial = new THREE.MeshPhongMaterial({ color: 0x6d2a09, specular: 0x555555, shininess: 30 });

        // Plate Material and Texture
        this.plate1Texture = new THREE.TextureLoader().load('textures/prato1.png');
        this.plate2Texture = new THREE.TextureLoader().load('textures/prato2.png');

        this.plateCakeMaterial = new THREE.MeshPhongMaterial({
            color: 0xd9f6fc,
            specular: 0x555555,
            shininess: 10,
            map: this.plate1Texture
        }); 

        this.plateSliceMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x555555,
            shininess: 10,
            map: this.plate2Texture
        }); 


        // Cake Material and Texture
        this.cakeTexture = new THREE.TextureLoader().load('textures/cake.jpg');
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;

        this.cakeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffcc99,
            map: this.cakeTexture,
            side: THREE.DoubleSide
        }); 

        // Cake Slice Material and Texture
        this.cakeSliceTexture = new THREE.TextureLoader().load('textures/cake-slice.jpg');
        this.cakeSliceTexture.wrapS = THREE.RepeatWrapping;
        this.cakeSliceTexture.wrapT = THREE.RepeatWrapping;

        this.cakeSliceMaterial = new THREE.MeshPhongMaterial({
            color: 0xffcc99,
            map: this.cakeSliceTexture,
            side: THREE.DoubleSide
        }); 

        // Candle Material 
        this.candleMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} );

        // Flame Material and Texture
        this.flameTexture = new THREE.TextureLoader().load('textures/vela.png');
        this.flameTexture.wrapS = THREE.RepeatWrapping;
        this.flameTexture.wrapT = THREE.RepeatWrapping;

        this.flameMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFF00,
            shininess: 30,
            map: this.flameTexture
        });

        // Spiral Spring Material
        this.spiralSpringTexture = new THREE.TextureLoader().load('textures/spiral.jpg');
        this.spiralSpringTexture.wrapS = THREE.RepeatWrapping;
        this.spiralSpringTexture.wrapT = THREE.RepeatWrapping;
        this.spiralSpringMaterial = new THREE.MeshPhongMaterial({
            color: 0x999999,
            shininess: 30,
            map: this.spiralSpringTexture
        });

        // Newspaper texture
        this.newspaperTexture = new THREE.TextureLoader().load('textures/newspaper.jpg');
        this.newspaperTexture.wrapS = this.newspaperTexture.wrapT = THREE.RepeatWrapping;
        this.newspaperTexture.anisotropy = 16;
        this.newspaperTexture.colorSpace = THREE.SRGBColorSpace;
        this.newspaperMaterial = new THREE.MeshPhongMaterial({
            map: this.newspaperTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });

        // Jar texture
        this.jarTexture = new THREE.TextureLoader().load('textures/jar.png');
        this.jarTexture.wrapS = this.jarTexture.wrapT = THREE.RepeatWrapping;
        this.jarTexture.anisotropy = 16;
        this.jarTexture.colorSpace = THREE.SRGBColorSpace;
        this.jarMaterial = new THREE.MeshPhongMaterial({
            map: this.jarTexture,
            side: THREE.DoubleSide,
            opacity: 0.6
        });

        // Flower Stem texture
        this.stemTexture = new THREE.TextureLoader().load('textures/flower_stem.png');
        this.stemTexture.wrapS = this.stemTexture.wrapT = THREE.RepeatWrapping;
        this.stemMaterial = new THREE.MeshPhongMaterial({
            map: this.stemTexture,
            side: THREE.DoubleSide
        });

        // Flower Center texture
        this.centerTexture = new THREE.TextureLoader().load('textures/flower_center.jpg');
        this.centerTexture.wrapS = this.centerTexture.wrapT = THREE.RepeatWrapping;
        this.centerMaterial = new THREE.MeshPhongMaterial({
            map: this.centerTexture,
            side: THREE.DoubleSide
        });

        // Flower Petal texture
        this.petalTexture = new THREE.TextureLoader().load('textures/flower_petal.jpg');
        this.petalTexture.wrapS = this.petalTexture.wrapT = THREE.RepeatWrapping;
        this.petalMaterial = new THREE.MeshPhongMaterial({
            map: this.petalTexture,
            side: THREE.DoubleSide
        });

        // Cup texture
        this.cupTexture = new THREE.TextureLoader().load('textures/cup.png');
        this.cupTexture.wrapS = this.cupTexture.wrapT = THREE.RepeatWrapping;
        this.cupMaterial = new THREE.MeshPhongMaterial({
            map: this.cupTexture,
            side: THREE.DoubleSide,
            opacity: 0.8
        });

        // Juice texture
        this.juiceTexture = new THREE.TextureLoader().load('textures/juice.jpg');
        this.juiceTexture.wrapS = this.juiceTexture.wrapT = THREE.RepeatWrapping;
        this.juiceMaterial = new THREE.MeshPhongMaterial({
            map: this.juiceTexture,
            side: THREE.DoubleSide
        });

        // Knife texture
        this.knifeBladeTexture = new THREE.TextureLoader().load('textures/knife-blade.jpg');
        this.knifeBladeTexture.wrapS = this.knifeBladeTexture.wrapT = THREE.RepeatWrapping;
        this.knifeBladeMaterial = new THREE.MeshPhongMaterial({
            map: this.knifeBladeTexture,
            side: THREE.DoubleSide,
            shininess: 30
        });

        this.knifeHandleTexture = new THREE.TextureLoader().load('textures/knife-handle.jpg');
        this.knifeHandleTexture.wrapS = this.knifeHandleTexture.wrapT = THREE.RepeatWrapping;
        this.knifeHandleMaterial = new THREE.MeshPhongMaterial({
            map: this.knifeHandleTexture,
            side: THREE.DoubleSide,
            shininess: 30
        });
    }

    /**
     * Initializes the table geometries and mesh
     */
    drawTable() {
    
        // Create Geometry and Mesh of the table top and legs
        const tableTop = new THREE.BoxGeometry( 1.5, 2.5, 0.1 );
        const tableLeg = new THREE.CylinderGeometry( 0.1, 0.1, 1, 32 );

        this.tableTopMesh = new THREE.Mesh( tableTop, this.tableTopMaterial );
        this.tableTopMesh.rotation.x = -Math.PI / 2;
        this.tableTopMesh.position.y = 1;
        // cast and receives shadows
        this.tableTopMesh.receiveShadow = true;
        this.tableTopMesh.castShadow = true;

        this.tableLeg1Mesh = new THREE.Mesh( tableLeg, this.tableLegMaterial );
        this.tableLeg1Mesh.position.set(0.5, 0.5, 1);

        this.tableLeg2Mesh = new THREE.Mesh( tableLeg, this.tableLegMaterial );
        this.tableLeg2Mesh.position.set(0.5, 0.5, -1);

        this.tableLeg3Mesh = new THREE.Mesh( tableLeg, this.tableLegMaterial );
        this.tableLeg3Mesh.position.set(-0.5, 0.5, 1);

        this.tableLeg4Mesh = new THREE.Mesh( tableLeg, this.tableLegMaterial );
        this.tableLeg4Mesh.position.set(-0.5, 0.5, -1);
        
        this.add(this.tableTopMesh);
        this.add(this.tableLeg1Mesh);
        this.add(this.tableLeg2Mesh);
        this.add(this.tableLeg3Mesh);
        this.add(this.tableLeg4Mesh);

        this.drawPlate();
        this.drawSpiralSpring();
        this.drawCurvedNewspaper();
        this.drawCurvedJar();
        this.drawCup();
        this.drawJuice();
    }

    drawPlate() {
        // Create Geometry and Mesh of the plates
        const plate = new THREE.CylinderGeometry( 0.3, 0.3, 0.01, 32 );
        this.cakePlateMesh = new THREE.Mesh( plate, this.plateCakeMaterial );
        this.cakePlateMesh.rotation.x = Math.PI / 2;
        this.cakePlateMesh.position.set(0.25, 0.25, 0.05);
        // cast and receives shadows
        this.cakePlateMesh.receiveShadow = true;
        this.cakePlateMesh.castShadow = true;

        const miniplate = new THREE.CylinderGeometry( 0.15, 0.15, 0.01, 32 );

        this.plate1Mesh = new THREE.Mesh( miniplate, this.plateSliceMaterial );
        this.plate1Mesh.rotation.x = Math.PI / 2;
        this.plate1Mesh.position.set(0.4, -0.7, 0.05);

        this.plate2Mesh = new THREE.Mesh( miniplate, this.plateSliceMaterial );
        this.plate2Mesh.rotation.x = Math.PI / 2;
        this.plate2Mesh.position.set(-0.25, -0.5, 0.05);

        this.plate3Mesh = new THREE.Mesh( miniplate, this.plateSliceMaterial );
        this.plate3Mesh.rotation.x = Math.PI / 2;
        this.plate3Mesh.position.set(0, 0.85, 0.05);

        // Add plates as a child of the table
        this.tableTopMesh.add(this.cakePlateMesh);
        this.tableTopMesh.add(this.plate1Mesh);
        this.tableTopMesh.add(this.plate2Mesh);
        this.tableTopMesh.add(this.plate3Mesh);

        // Create cake above the plates
        this.drawCake();

        // Create a knife above the plate3
        this.drawKnife();
    }

    drawCake() {
        // Create Geometry and Mesh of the cake
        const cake = new THREE.CylinderGeometry( 0.2, 0.2, 0.15, 32, 1, false, 0, Math.PI * 5 / 3 );
        this.cakeMesh = new THREE.Mesh( cake, this.cakeMaterial );
        this.cakeMesh.position.set(0, 0.081, 0);
        this.cakeMesh.castShadow = true;

        const cakeSlice = new THREE.CylinderGeometry( 0.1, 0.1, 0.15, 32, 1, false, 0, Math.PI / 5 );

        this.cakeSlice1Mesh = new THREE.Mesh( cakeSlice, this.cakeMaterial );
        this.cakeSlice1Mesh.position.set(0.01, 0.01, -0.05);
        this.cakeSlice1Mesh.rotation.z = Math.PI / 2;

        this.cakeSlice2Mesh = new THREE.Mesh( cakeSlice, this.cakeMaterial );
        this.cakeSlice2Mesh.position.set(0.01, 0.01, -0.05);
        this.cakeSlice2Mesh.rotation.z = Math.PI / 2;

        // Add cake as a child of the plate
        this.cakePlateMesh.add(this.cakeMesh);
        this.plate1Mesh.add(this.cakeSlice1Mesh);
        this.plate2Mesh.add(this.cakeSlice2Mesh);

        // Add a PlaneGeometry to cover the inside of the cake
        const cakeCover = new THREE.PlaneGeometry(0.20, 0.15);
        const cakeCoverMaterial = new THREE.MeshPhongMaterial({ map: this.cakeSliceTexture, side: THREE.DoubleSide });
        
        const cakeCover1Mesh = new THREE.Mesh(cakeCover, cakeCoverMaterial);
        cakeCover1Mesh.position.set(0, 0, 0.1);
        cakeCover1Mesh.rotation.y = -Math.PI / 2;
        this.cakeMesh.add(cakeCover1Mesh);

        const cakeCover2Mesh = new THREE.Mesh(cakeCover, cakeCoverMaterial);
        cakeCover2Mesh.position.set(-0.0868, 0, 0.05);
        cakeCover2Mesh.rotation.y = Math.PI / 6;
        this.cakeMesh.add(cakeCover2Mesh);
        

        // Repeat the proccess for the slices 
        const sliceCover = new THREE.PlaneGeometry(0.12, 0.15);
        const sliceCoverMaterial = new THREE.MeshPhongMaterial({ map: this.cakeSliceTexture, side: THREE.DoubleSide });

        const sliceCover1Mesh = new THREE.Mesh(sliceCover , sliceCoverMaterial);
        sliceCover1Mesh.position.set(0.025, 0, 0.035);
        sliceCover1Mesh.rotation.y = (-Math.PI / 5) - 0.30;
        this.cakeSlice1Mesh.add(sliceCover1Mesh);

        const sliceCover2Mesh = new THREE.Mesh(sliceCover , sliceCoverMaterial);
        sliceCover2Mesh.position.set(0.025, 0, 0.035);
        sliceCover2Mesh.rotation.y = (-Math.PI / 5) - 0.30;
        this.cakeSlice2Mesh.add(sliceCover2Mesh);

        // Add candle and flame to the cake
        this.addCandle();
    }

    addCandle() {
        // Creates the candle (small cylinder)
        const candle = new THREE.CylinderGeometry( 0.01, 0.01, 0.05, 16 );
        this.candleMesh = new THREE.Mesh( candle, this.candleMaterial );
        this.candleMesh.position.set(0, 0.1, 0);

        // Creates the candle flame (cone)
        const flame = new THREE.ConeGeometry( 0.02, 0.04, 16 );
        this.flameMesh = new THREE.Mesh( flame, this.flameMaterial );
        this.flameMesh.position.set(0, 0.045, 0); 

        // Add the candle and flame as child of the cake
        this.cakeMesh.add(this.candleMesh);
        this.candleMesh.add(this.flameMesh);
    }

    drawSpiralSpring() {
        const radius = 0.2;  
        const height = 1;    
        const turns = 6;     
        const segments = 100;

        const points = [];

        // Creates spiral points
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * turns * Math.PI * 2; // Angle in radians
            const x = Math.cos(angle) * radius;                 // Coordinate X
            const y = (i / segments) * height;                  // Coordinate Y (height)
            const z = Math.sin(angle) * radius;                 // Coordinate Z

            points.push(new THREE.Vector3(x, y, z));
        }

        // Creates the CatmullRom curve with the spiral points
        const curve = new THREE.CatmullRomCurve3(points);

        // Creates spring geometry and mesh
        const spiralSpring = new THREE.TubeGeometry(curve, 200, 0.05, 8, false); 
        this.spiralSpringMesh = new THREE.Mesh(spiralSpring, this.spiralSpringMaterial);
        this.spiralSpringMesh.scale.set(0.25, 0.25, 0.25); 
        this.spiralSpringMesh.position.set(-0.45, 0.75, 0.115);
        // cast and receives shadows
        this.spiralSpringMesh.receiveShadow = true;
        this.spiralSpringMesh.castShadow = true;

        // Add to table top
        this.tableTopMesh.add(this.spiralSpringMesh);
    }

    drawCurvedNewspaper() {
        if (this.paperMesh !== null) {
            this.tableTopMesh.remove(this.paperMesh);
        }
        this.paperMesh = new THREE.Group();

        const leftPageControlPoints = [
            [   // U = 0 (left side of the left page)
                [-2.5, -1.0, 0.5, 1],    // V = 0 (bottom-left)
                [-2.5,  0.5, 2.0, 1],    // V = 1 (top-left)
            ],
            [   // U = 0.5 (center of the left page)
                [0.0, -1.0, 1.0, 1],     // V = 0 (bottom-center, higher curve)
                [0.0,  0.5, 2.5, 1],     // V = 1 (top-center)
            ],
            [   // U = 1 (middle spine of the left page)
                [2.0, -1.0, 0.5, 1],     // V = 0 (bottom-spine)
                [2.0,  0.5, 2.0, 1],     // V = 1 (top-spine)
            ],
        ];
        
        const rightPageControlPoints = [
            [   // U = 0 (middle spine of the right page)
                [2.0, -1.0, 0.5, 1],     // V = 0 (bottom-spine)
                [2.0,  0.5, 2.0, 1],     // V = 1 (top-spine)
            ],
            [   // U = 0.5 (center of the right page)
                [4.5, -1.0, 1.0, 1],     // V = 0 (bottom-center, higher curve)
                [4.5,  0.5, 2.5, 1],     // V = 1 (top-center)
            ],
            [   // U = 1 (right edge of the right page)
                [6.5, -1.0, 0.5, 1],     // V = 0 (bottom-right)
                [6.5,  0.5, 2.0, 1],     // V = 1 (top-right)
            ],
        ];

        const orderU = 2;
        const orderV = 1;

        // Build the NURBS surface for the left page
        const leftPageData = this.builder.build(
            leftPageControlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.newspaperMaterial
        );
        const leftPageMesh = new THREE.Mesh(leftPageData, this.newspaperMaterial);
        leftPageMesh.rotation.x = Math.PI - 3.0 / 4;
        leftPageMesh.scale.set(0.08, 0.16, 0.16);
        leftPageMesh.position.set(-0.4, -0.85, 0.285);
        leftPageMesh.castShadow = true;

        // Build the NURBS surface for the right page
        const rightPageData = this.builder.build(
            rightPageControlPoints,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.newspaperMaterial
        );
        const rightPageMesh = new THREE.Mesh(rightPageData, this.newspaperMaterial);
        rightPageMesh.rotation.x = Math.PI - 3.0 / 4;
        rightPageMesh.scale.set(0.08, 0.16, 0.16);
        rightPageMesh.position.set(-0.4, -0.85, 0.285);
        rightPageMesh.castShadow = true;

        // Add the two main pages to the scene
        this.paperMesh.add(leftPageMesh);
        this.paperMesh.add(rightPageMesh);

        // Create extra thin pages for realism
        const pageGap = 0.005;  // Small gap between extra pages
        for (let i = 1; i <= 5; i++) {
            const extraLeftPageMesh = leftPageMesh.clone();
            extraLeftPageMesh.position.z -= i * pageGap;
            this.paperMesh.add(extraLeftPageMesh);

            const extraRightPageMesh = rightPageMesh.clone();
            extraRightPageMesh.position.z -= i * pageGap;
            this.paperMesh.add(extraRightPageMesh);
        }

        this.tableTopMesh.add(this.paperMesh)
    }

    drawCurvedJar() {
        if (this.jarMesh !== null) {
            this.tableTopMesh.remove(this.jarMesh);
        }
        this.jarMesh = new THREE.Group();
     
        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 2
        let orderV = 2
        // build nurb #1
            controlPoints =
            [ // U = 0
                [ // V = ​​0.1.2
                    [-1.25, -2.0, 0, 1 ], 
                    [-0.25,  1.0, 0, 1 ], 
                    [-0.5,  2.0, 0, 1 ]  
                ],
                // U = 1
                [ // V = ​​0.1.2
                    [ 0.0, -2.0, 2, 1 ], 
                    [ 0.0,  1.0, -0.5, 1 ], 
                    [ 0.0,  2.0, 1.0, 1 ]                                                 
                ],
                // U = 2
                [ // V = ​​0.1.2
                    [ 1.25, -2.0, 0, 1 ], 
                    [ 0.25,  1.0, 0, 1 ],    
                    [ 0.5,  2.0, 0, 1 ]                                                
                ]
            ]
       
        surfaceData = this.builder.build(controlPoints,
                      orderU, orderV, this.samplesU,
                      this.samplesV, this.jarMaterial)  
        mesh = new THREE.Mesh( surfaceData, this.jarMaterial );
        mesh.rotation.x = Math.PI / 2
        mesh.scale.set( 0.08, 0.08 , 0.08 )
        mesh.position.set( -0.4, 0, 0.216 )
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.jarMesh.add(mesh)

        // build nurb #2
        controlPoints =
        [ // U = 0
            [ // V = ​​0.1.2
                [1.25, -2.0, 0, 1 ], 
                [0.25,  1.0, 0, 1 ], 
                [0.5,  2.0, 0, 1 ]  
            ],
            // U = 1
            [ // V = ​​0.1.2
                [ 0.0, -2.0, -2, 1 ], 
                [ 0.0,  1.0, 0.5, 1 ], 
                [ 0.0,  2.0, -1.0, 1 ]                                                 
            ],
            // U = 2
            [ // V = ​​0.1.2
                [-1.25, -2.0, 0, 1 ], 
                [-0.25,  1.0, 0, 1 ],    
                [-0.5,  2.0, 0, 1 ]                                                
            ]
        ]
   
        surfaceData = this.builder.build(controlPoints,
                    orderU, orderV, this.samplesU,
                    this.samplesV, this.jarMaterial)  
        mesh = new THREE.Mesh( surfaceData, this.jarMaterial );
        mesh.rotation.x = Math.PI / 2
        mesh.scale.set( 0.08, 0.08, 0.08 )
        mesh.position.set( -0.4, 0, 0.216 )
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.jarMesh.add(mesh)

        // Adds a circular base to close the bottom of the jar
        const baseGeometry = new THREE.CircleGeometry(1.35, 32); 
        const baseMesh = new THREE.Mesh(baseGeometry, this.jarMaterial);
        baseMesh.position.set(-0.4, 0, 0.056); 
        baseMesh.scale.set( 0.08, 0.08, 0.08);
        this.jarMesh.add(baseMesh);
        this.tableTopMesh.add(this.jarMesh);

        // Add the flowers inside the jar
        this.drawFlower();
    }

    drawFlower() {
        if (this.flowerMesh !== null) {
            this.app.scene.remove(this.flowerMesh);
        }
        this.flowerMesh = new THREE.Group();
    
        // Creates the stem as a curve
        const stemPoints = [
            new THREE.Vector3(0, -1, 0),  // Start of the stem at the bottom of the jar
            new THREE.Vector3(0.1, -0.5, 0.1), // Stem curve
            new THREE.Vector3(0.1, 0.0, 0.05), // Stem curve
            new THREE.Vector3(0.15, 0.2, -0.1), // Stem curve
            new THREE.Vector3(0.15, 0.3, 0.15), // Stem curve
            new THREE.Vector3(0.2, 0.5, 0.1) // Stem tip near the petals
        ];
        const stemCurve = new THREE.CatmullRomCurve3(stemPoints);
        
        // Stem geometry and material
        const stemGeometry = new THREE.TubeGeometry(stemCurve, 20, 0.05, 8, false);
        const stemMesh = new THREE.Mesh(stemGeometry, this.stemMaterial);
        stemMesh.position.set(0, 0, 0);
        stemMesh.receiveShadow = true;
        stemMesh.castShadow = true;
    
        // Center of the flower
        const centerGeometry = new THREE.SphereGeometry( 0.3, 32, 16 );
        const centerMesh = new THREE.Mesh(centerGeometry, this.centerMaterial);
        centerMesh.position.set(0.2, 0.75, 0.15); 
        centerMesh.rotation.z = Math.PI / 2;
        centerMesh.castShadow = true;
    
        // Adds the stem and center to the flower 
        this.flowerMesh.add(stemMesh);
        this.flowerMesh.add(centerMesh);
    
        // Creats petals around the center
        const numPetal = 8; 
        const petalGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32, 1);
    
        for (let i = 0; i < numPetal; i++) {
            const petalMesh = new THREE.Mesh(petalGeometry, this.petalMaterial);
    
            // Petal position around the center
            const angle = (i / numPetal) * Math.PI * 2; // Angle to distribute petals
            const petalRadius = 0.4; // Distance from center
            petalMesh.position.set(
                0.2 + Math.cos(angle) * petalRadius,
                0.75,
                0.15 + Math.sin(angle) * petalRadius
            );
    
            petalMesh.rotation.y = Math.PI / 2;

            petalMesh.castShadow = true;
            this.flowerMesh.add(petalMesh);
        }
        this.flowerMesh.rotation.x = Math.PI / 2;
        this.flowerMesh.position.set(-0.415, 0.01, 0.4);
        this.flowerMesh.scale.set(0.15, 0.15, 0.15);
    
        // Add the flower to the jar
        this.jarMesh.add(this.flowerMesh);
    }

     /**
     * Draws a cup on the table
     */
     drawCup() {
        // Create a cylinder geometry for the cup body
        const cupGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
        this.cupMesh = new THREE.Mesh(cupGeometry, this.cupMaterial);
        this.cupMesh.position.set(0.5, 0.1, 0.2);
        this.cupMesh.rotation.x = Math.PI / 2;
        this.cupMesh.castShadow = true;

        // Create a torus for the cup handle
        const handleGeometry = new THREE.TorusGeometry(0.05, 0.015, 16, 100);
        const handleMesh = new THREE.Mesh(handleGeometry, this.cupMaterial);
        handleMesh.position.set(0.12, 0.01, 0.01);
        handleMesh.rotation.z = Math.PI / 2;
        handleMesh.castShadow = true;

        // Add handle to cup and add cup to the scene
        this.cupMesh.add(handleMesh);

        // Create a circle for the juice on top of the cup
        const juiceGeometry = new THREE.CircleGeometry(0.095, 32); 
        const juiceMaterial = new THREE.MeshBasicMaterial({ color: 0xf4c071 });
        const juiceMesh = new THREE.Mesh(juiceGeometry, juiceMaterial);
        juiceMesh.rotation.x = -Math.PI / 2; 
        juiceMesh.position.set(0, 0.105, 0); 

        // Add juice to the top of the cup
        this.cupMesh.add(juiceMesh);

        this.cupMesh.scale.set(0.5, 0.5, 0.5);
        this.cupMesh.position.set(0.25, -0.3, 0.095);
        this.tableTopMesh.add(this.cupMesh);
    }

    /**
     * Draws a juice box on the table
     */
    drawJuice() {
        // Create a box geometry for the juice box
        const juiceGeometry = new THREE.BoxGeometry(0.1, 0.25, 0.05);
        this.juiceMesh = new THREE.Mesh(juiceGeometry, this.juiceMaterial);
        this.juiceMesh.position.set(0.5, 0.68, 0.175);
        this.juiceMesh.rotation.x = Math.PI / 2;
        this.juiceMesh.castShadow = true;

        // Create a small cylinder for the cap on top of the juice box
        const capGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.008, 32);
        const capMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); 
        const capMesh = new THREE.Mesh(capGeometry, capMaterial);
        capMesh.position.set(0.035, 0.13, 0); 

        // Add the cap as a child of the juice box
        this.juiceMesh.add(capMesh);

        // Add juice box to the scene
        this.tableTopMesh.add(this.juiceMesh);
    }

    /**
     * Draws a knife on the plate
     */
    drawKnife() {
        // Create a box geometry for the knife blade
        const bladeGeometry = new THREE.BoxGeometry(0.15, 0.02, 0.005);
        const bladeMesh = new THREE.Mesh(bladeGeometry, this.knifeBladeMaterial);
        bladeMesh.position.set(0.3, 0.27, 0.07); 

        // Create a box geometry for the knife handle
        const handleGeometry = new THREE.BoxGeometry(0.05, 0.02, 0.02);
        const handleMesh = new THREE.Mesh(handleGeometry, this.knifeHandleMaterial);
        handleMesh.position.set(0.08, 0.0, 0.0); 

        // Add handle to the blade and then add the knife to the plate
        bladeMesh.add(handleMesh);
        bladeMesh.position.set(0.02, 0.025, 0.0); 

        this.plate3Mesh.add(bladeMesh);
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };