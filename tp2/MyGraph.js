import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyGraph {
    constructor(scene, materials) {
        this.scene = scene; // Scene Three.js
        this.materials = materials; // Loaded materials
        this.nodes = {}; // Store created objects

        this.builder = new MyNurbsBuilder();

        this.defaultMaterial = null;
    }

    /**
     * Initializes the graph with scene data.
     * @param {Object} graph - YASF file graph.
     * @param {string} rootId - Root node ID.
     */
    init(graph, rootId) {
        this.buildNode(graph, rootId);
    }

    /**
     * Recursively constructs a node and its children.
     * @param {Object} graph - YASF graph.
     * @param {string} nodeId - Current node ID.
     * @param {Array} transforms - Array of transformations if it exists.
     */
    buildNode(graph, nodeId, transforms = null) {
        const node = graph[nodeId];

        if (!node) {
            console.warn(`Nó não encontrado: ${nodeId}`);
            return;
        }

        const object = this.createNodeObject(node, graph, transforms);

        if (node.children) {
            this.processNodeChildren(node, object, graph);
        }

        // Adds the object to the scene and node dictionary
        this.scene.add(object);
        this.nodes[nodeId] = object;
    }

    /**
     * Creates the object corresponding to the current node.
     * @param {Object} node - Graph node.
     * @param {Object} graph - YASF graph.
     * @param {Array} transforms - Transformations inherited from the father.
     * @returns {Object} Three.js object created.
     */
    createNodeObject(node, graph, transforms) {
        let object;

        if (node.type === 'lod') {
            object = this.createLODNode(node, graph);
        } else {
            object = new THREE.Object3D();
        }

        if (node.transforms) {
            this.applyTransforms(object, node.transforms);
        }
        if (transforms) {
            this.applyTransforms(object, transforms);
        }

        if (node.materialref) {
            this.defaultMaterial = node.materialref;
        }

        return object;
    }

    /**
     * Creates a LOD node and processes its levels of detail.
     * @param {Object} node - LOD type node.
     * @param {Object} graph - YASF graph.
     * @returns {LOD} LOD object created.
     */
    createLODNode(node, graph) {
        const object = new THREE.LOD();

        for (const level of node.lodNodes) {
            const childNode = graph[level.nodeId];
            if (childNode) {
                this.buildNode(graph, level.nodeId, childNode.transforms);

                if (this.nodes[level.nodeId]) {
                    object.addLevel(this.nodes[level.nodeId], level.mindist);
                }
            }
        }

        return object;
    }

    /**
     * Processes the children of a node, adding them to the parent object.
     * @param {Object} node - Current node.
     * @param {Object3D} parentObject - Parent object.
     * @param {Object} graph - YASF graph.
     */
    processNodeChildren(node, parentObject, graph) {
        for (const childKey in node.children) {
            const child = node.children[childKey];

            switch (child.type) {
                case 'noderef':
                    this.processNodeRef(child, graph, parentObject);
                    break;
                case 'pointlight':
                case 'spotlight':
                case 'directionallight':
                    const light = this.createLight(child);
                    if (light) {
                        parentObject.add(light);
                    }
                    break;
                default:
                    const primitive = this.createPrimitive(
                        child,
                        child.materialref ? child.materialref.materialId : this.defaultMaterial.materialId,
                        true,  // castShadow
                        true   // receiveShadow
                    );

                    if (child.transforms) {
                        this.applyTransforms(primitive, child.transforms);
                    }

                    if (primitive) {
                        parentObject.add(primitive);
                    }
            }
        }
    }

    /**
     * Processes a node of type noderef.
     * @param {Object} child - Child node of type noderef.
     * @param {Object} graph - YASF graph.
     * @param {Object3D} parentObject - Parent object.
     */
    processNodeRef(child, graph, parentObject) {
        if (child.materialref) {
            this.defaultMaterial = child.materialref;
        }

        this.buildNode(graph, child.nodeId, child.transforms);

        if (this.nodes[child.nodeId]) {
            parentObject.add(this.nodes[child.nodeId]);
        }
    }

    
    /**
     * Applies transformations to an object.
     * @param {THREE.Object3D} object - Object to be transformed.
     * @param {Array} transforms - List of transformations.
     */
    applyTransforms(object, transforms) {
        for (const transform of transforms) {
            if (transform.type === 'translate') {
                object.position.set(
                    transform.amount.x,
                    transform.amount.y,
                    transform.amount.z
                );
            } else if (transform.type === 'rotate') {
                object.rotation.set(
                    THREE.MathUtils.degToRad(transform.amount.x),
                    THREE.MathUtils.degToRad(transform.amount.y),
                    THREE.MathUtils.degToRad(transform.amount.z)
                );
            } else if (transform.type === 'scale') {
                object.scale.set(
                    transform.amount.x,
                    transform.amount.y,
                    transform.amount.z
                );
            }
        }
    }

    createPrimitive(primitive, materialId, castShadow = false, receiveShadow = false) {
        let objPrimitive;
        let material;

        if (materialId) {
            material = this.materials[materialId];
        }

        // Selects primitive based on subtype
        switch (primitive.type) {
            case 'rectangle':
                objPrimitive = this.createRectangle(primitive, material);
                break;
            case 'triangle':
                objPrimitive = this.createTriangle(primitive, material);
                break;
            case 'cylinder':
                objPrimitive = this.createCylinder(primitive, material);
                break;
            case 'box':
                objPrimitive = this.createBox(primitive, material);
                break;
            case 'sphere':
                objPrimitive = this.createSphere(primitive, material);
                break;
            case 'polygon':
                objPrimitive = this.createPolygon(primitive, material);
                break;
            case 'nurbs':
                objPrimitive = this.createNurbs(primitive, material);
                break;
            default:
                console.warn(`Unknown primitive subtype: ${primitive.subtype}`);
                return null;
        }
    
        // Configure the shadows
        objPrimitive.castShadow = castShadow;
        objPrimitive.receiveShadow = receiveShadow;
        objPrimitive.name = `${primitive.subtype}_obj`;
    
        return objPrimitive;
    }
    
    createRectangle(parameters, material) {
        const width = parameters.xy2.x - parameters.xy1.x;
        const height = parameters.xy2.y - parameters.xy1.y;
        const geometry = new THREE.PlaneGeometry(width, height);
        return new THREE.Mesh(geometry, material);
    }
    
    createTriangle(parameters, material) {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            parameters.xyz1.x, parameters.xyz1.y, parameters.xyz1.z,
            parameters.xyz2.x, parameters.xyz2.y, parameters.xyz2.z,
            parameters.xyz3.x, parameters.xyz3.y, parameters.xyz3.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        return new THREE.Mesh(geometry, material);
    }
    
    createCylinder(parameters, material) {
        const geometry = new THREE.CylinderGeometry(
            parameters.base,
            parameters.top,
            parameters.height,
            parameters.slices,
            parameters.stacks || 1, // Stacks default to 1 if not specified
            parameters.capsclose || false, // Close (default is false)
            parameters.thetaStart || 0, // Start angle (default is 0)
            parameters.thetaLength || Math.PI * 2 // Arc length (default is full circle)
        );
    
        return new THREE.Mesh(geometry, material);
    }
    
    createBox(parameters, material) {
        const width = Math.abs(parameters.xyz2.x - parameters.xyz1.x);
        const height = Math.abs(parameters.xyz2.y - parameters.xyz1.y);
        const depth = Math.abs(parameters.xyz2.z - parameters.xyz1.z);
    
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        return new THREE.Mesh(geometry, material);
    }
      
    createSphere(parameters, material) {
        const geometry = new THREE.SphereGeometry(
            parameters.radius,
            parameters.slices,
            parameters.stacks,
            parameters.thetastart || 0,
            parameters.thetalength || Math.PI * 2, 
            parameters.phistart || 0, 
            parameters.philength || Math.PI 
        );
    
        return new THREE.Mesh(geometry, material);
    }
    
    createPolygon(parameters, material) {
        const geometry = new THREE.ShapeGeometry(new THREE.Shape(parameters.points));
        return new THREE.Mesh(geometry, material);
    }

    createNurbs(parameters, material) {
        // Checks if required parameters are available
        const { degree_u, degree_v, parts_u, parts_v, controlpoints } = parameters;
    
        if (!degree_u || !degree_v || !parts_u || !parts_v || !controlpoints) {
            console.error("Parâmetros NURBS incompletos:", parameters);
            return new THREE.Object3D();
        }
    
        // Validates the format of control points
        if (!Array.isArray(controlpoints) || controlpoints.length === 0) {
            console.error("Control points inválidos:", controlpoints);
            return new THREE.Object3D();
        }
        
        // Converts control points to the THREE.NURBSSurface format
        const controlPointsForNURBS = [];
        for (let i = 0; i <= degree_u; i++) {
            const row = [];
            for (let j = 0; j <= degree_v; j++) {
                const index =  i * (degree_v + 1) + j;
                const cp = controlpoints[index];
                row.push([cp.x, cp.y, cp.z, cp.w || 1.0]);
            }
            controlPointsForNURBS.push(row);
        }

        const data = this.builder.build(
            controlPointsForNURBS,
            degree_u,
            degree_v,
            parts_u,
            parts_v,
            material
        );

        return new THREE.Mesh(data, material);
    }   

    /**
     * Creates a light based on the data provided in the node.
     * @param {Object} lightData - Light node data.
     */
    createLight(lightData) {
        let light, visual;
    
        switch (lightData.type) {
            case 'pointlight':
                light = new THREE.PointLight(
                    new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b),
                    lightData.intensity || 1,
                    lightData.distance || 1000,
                    lightData.decay || 2
                );

                const sphereSize = 0.5;
                visual = new THREE.PointLightHelper( light, sphereSize );
                break;
    
            case 'spotlight':
                light = new THREE.SpotLight(
                    new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b),
                    lightData.intensity || 1,
                    lightData.distance || 1000,
                    lightData.angle,
                    lightData.penumbra || 1,
                    lightData.decay || 2
                );
                light.target.position.set(
                    lightData.target.x,
                    lightData.target.y,
                    lightData.target.z
                );

                visual = new THREE.SpotLightHelper(light);
                break;
    
            case 'directionallight':
                light = new THREE.DirectionalLight(
                    new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b),
                    lightData.intensity || 1
                );

                visual = new THREE.DirectionalLightHelper(light)
                break;
    
            default:
                console.warn(`Tipo de luz desconhecido: ${lightData.type}`);
                return;
        }
    
        // Common configuration for all lights
        if (lightData.position) {
            light.position.set(lightData.position.x, lightData.position.y, lightData.position.z);
        }
        if (lightData.castshadow) {
            light.castShadow = true;
            if (light.shadow) {
                light.shadow.mapSize.width = lightData.shadowmapsize || 512;
                light.shadow.mapSize.height = lightData.shadowmapsize || 512;
                light.shadow.camera.far = lightData.shadowfar || 500.0;
    
                if (lightData.type === 'directionallight') {
                    light.shadow.camera.left = lightData.shadowleft || -5;
                    light.shadow.camera.right = lightData.shadowright || 5;
                    light.shadow.camera.bottom = lightData.shadowbottom || -5;
                    light.shadow.camera.top = lightData.shadowtop || 5;
                }
            }
        }

         // Adds the visual object as a child of the light
        if (visual) {
            light.add(visual);
        }
    
        return light;
    }
    
}

export { MyGraph };
