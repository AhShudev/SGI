import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraph } from './MyGraph.js';
/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app;
        this.axis = null;
        this.graph = null;

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        //this.reader.open("scenes/demo/demo.json");
        this.reader.open("scenes/t02_g05/scene.json");
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
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        // Initialize global settings
        this.setGlobalSettings(data.yasf.globals);

        // Set up the camera
        if (data.yasf.cameras) {
            this.app.cameras = this.loadCameras(data.yasf.cameras);
            this.app.setActiveCamera(data.yasf.cameras.initial)
        }

        // Load textures and materials
        this.textures = this.loadTextures(data.yasf.textures);
        this.materials = this.loadMaterials(data.yasf.materials, this.textures);

        this.graph = new MyGraph(this.app.scene, this.materials);
        this.graph.init(data.yasf.graph, data.yasf.graph.rootid);

        this.app.gui.updateGUI();

        // Start rendering
        this.app.render();
    }

    /**
     * Set global settings like background color
     * @param {Object} globals - Global settings from JSON
     */
    setGlobalSettings(globals) {
        const backgroundColor = globals.background;
        this.app.scene.background = new THREE.Color(backgroundColor.r, backgroundColor.g, backgroundColor.b);

        const ambientLight = new THREE.AmbientLight(globals.ambient);
        this.app.scene.add(ambientLight);

        const fogColor = new THREE.Color(globals.fog.color.r, globals.fog.color.g, globals.fog.color.b);
        this.app.scene.fog = new THREE.Fog(fogColor, globals.fog.near, globals.fog.far);

        if (globals.skybox) {
            this.setSkybox(globals.skybox);
        }
    }

    /**
    * Configure skybox
    * @param {Object} skybox - Skybox data
    */
    setSkybox(skybox) {
        const textureLoader = new THREE.TextureLoader();

        // Load skybox textures
        const materials = [
            new THREE.MeshBasicMaterial({ map: textureLoader.load(skybox.front), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: textureLoader.load(skybox.back), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: textureLoader.load(skybox.up), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: textureLoader.load(skybox.down), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: textureLoader.load(skybox.left), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: textureLoader.load(skybox.right), side: THREE.BackSide })
        ];

        // Creates the skybox cube with the specified size
        const geometry = new THREE.BoxGeometry(skybox.size.x, skybox.size.y, skybox.size.z);
        const skyboxMesh = new THREE.Mesh(geometry, materials);

        // Sets the skybox position based on the center
        skyboxMesh.position.set(skybox.center.x, skybox.center.y, skybox.center.z);

        // Add the skybox to the scene
        this.app.scene.add(skyboxMesh);
    }

    /**
     * Load cameras from the scene data
     * @param {Object} cameraData - Camera settings from JSON
     * @returns {Object} - An object with all loaded cameras
     */
    loadCameras(cameraData) {
        const cameras = {};

        for (let key in cameraData) {
            if (key === 'initial') {
                continue;
            }
            
            const camSettings = cameraData[key];
            let camera;

            if (camSettings.type === 'perspective') {
                camera = new THREE.PerspectiveCamera(
                    camSettings.angle,
                    window.innerWidth / window.innerHeight,
                    camSettings.near,
                    camSettings.far
                );
            } else if (camSettings.type === 'orthogonal') {
                camera = new THREE.OrthographicCamera(
                    camSettings.left,
                    camSettings.right,
                    camSettings.top,
                    camSettings.bottom,
                    camSettings.near,
                    camSettings.far
                );
            } else {
                console.warn(`Unknown camera type: ${camSettings.type}`);
                continue;
            }

            camera.position.set(
                camSettings.location.x,
                camSettings.location.y,
                camSettings.location.z
            );
            camera.lookAt(
                camSettings.target.x,
                camSettings.target.y,
                camSettings.target.z
            );

            cameras[key] = camera;
        }

        return cameras;
    }

    /**
     * Load textures from JSON data
     * @param {Object} textureData - Texture data from JSON
     * @returns {Object} - A dictionary of textures
     */
    loadTextures(textureData) {
        const loader = new THREE.TextureLoader();
        const textures = {};

        for (const key in textureData) {
            const data = textureData[key];

            if (data.isVideo) {
                // Carrega textura de vídeo
                const video = document.createElement('video');
                video.src = data.filepath;
                video.loop = true; // Loop por padrão
                video.muted = true; // Sem áudio por padrão
                video.play();

                const videoTexture = new THREE.VideoTexture(video);
                videoTexture.wrapS = THREE.RepeatWrapping;
                videoTexture.wrapT = THREE.RepeatWrapping;
                videoTexture.minFilter = THREE.LinearFilter; // Melhor filtro para vídeos
                videoTexture.magFilter = THREE.LinearFilter;

                textures[key] = videoTexture;
            } else if (data.mipmap0) {
                // Carrega mipmaps personalizados
                const mipmaps = [];
                let mipmapLevel = 0;
                while (data[`mipmap${mipmapLevel}`]) {
                    mipmaps.push(loader.load(data[`mipmap${mipmapLevel}`]));
                    mipmapLevel++;
                }

                const baseTexture = loader.load(data.filepath);
                baseTexture.mipmaps = mipmaps; // Define mipmaps manualmente
                baseTexture.generateMipmaps = false; // Impede geração automática
                baseTexture.minFilter = THREE.LinearMipmapLinearFilter;

                baseTexture.wrapS = THREE.RepeatWrapping;
                baseTexture.wrapT = THREE.RepeatWrapping;

                textures[key] = baseTexture;
            } else {
                // Carrega textura padrão
                const texture = loader.load(data.filepath);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                textures[key] = texture;
            }
        }

        return textures;
    }


    /**
     * Create materials from JSON data using loaded textures
     * @param {Object} materialData - Material data from JSON
     * @param {Object} textures - Loaded textures
     * @returns {Object} - A dictionary of materials
     */
    loadMaterials(materialData, textures) {
        const materials = {};
        for (const key in materialData) {
            const matInfo = materialData[key];
            const color = matInfo.color ? new THREE.Color(matInfo.color.r, matInfo.color.g, matInfo.color.b) : new THREE.Color(1, 1, 1); // Default to white
            const specular = matInfo.specular ? new THREE.Color(matInfo.specular.r, matInfo.specular.g, matInfo.specular.b) : new THREE.Color(0.5, 0.5, 0.5); // Default to gray
            const emissive = matInfo.emissive ? new THREE.Color(matInfo.emissive.r, matInfo.emissive.g, matInfo.emissive.b) : new THREE.Color(0, 0, 0); // Default to black

            const material = new THREE.MeshPhongMaterial({
                color: color,
                specular: specular,
                emissive: emissive,
                shininess: matInfo.shininess !== undefined ? matInfo.shininess : 30, // Default shininess
                transparent: matInfo.transparent !== undefined ? matInfo.transparent : false,
                opacity: matInfo.opacity !== undefined ? matInfo.opacity : 1.0,
                wireframe: matInfo.wireframe || false,
                flatShading: matInfo.shading || false, // Updated property: 'flatShading' replaces 'shading' in Three.js
                map: matInfo.textureref ? textures[matInfo.textureref] || null : null,
                bumpMap: matInfo.bumpMap ? textures[matInfo.bumpMap] || null : null,
                bumpScale: matInfo.bumpScale !== undefined ? matInfo.bumpScale : 1.0,
                side: matInfo.twosided ? THREE.DoubleSide : THREE.FrontSide, // Use appropriate side value
            });

            if (matInfo.specularref && textures[matInfo.specularref]) {
                material.specularMap = textures[matInfo.specularref];
            }

            if (matInfo.texlength_s || matInfo.texlength_t) {
                // Adjust texture repeat if texlength_s or texlength_t is specified
                if (material.map) {
                    material.map.repeat.set(1 / (matInfo.texlength_s || 1), 1 / (matInfo.texlength_t || 1));
                    material.map.wrapS = THREE.RepeatWrapping;
                    material.map.wrapT = THREE.RepeatWrapping;
                }
            }

            materials[key] = material;
        }
        return materials;
    }

    update() {
    }
}

export { MyContents };
