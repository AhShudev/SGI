import * as THREE from 'three';
import { MyRoute } from './MyRoute.js';


class MyTrack {

  constructor() {
    //Curve related attributes
    this.segments = 200;
    this.width = 35;
    this.textureRepeat = 1;
    this.closedCurve = true;

    this.initialPosition = null;
    
    // Defines the points for the track
    this.path = new THREE.CatmullRomCurve3(this.createPath());

    this.object = new THREE.Object3D();
    this.buildCurve();

    this.routes = [];
    this.createRoutes();
  }

  /**
   * Creates a closed route for the track.
   * @returns {Array<THREE.Vector3>} List of points on the track.
   */
  createPath() {
    this.initialPosition = new THREE.Vector3(-150.0, 0.0, -150.0);
    return [
        new THREE.Vector3(-150, 125, -150), // Starting point
        new THREE.Vector3(-50, 125, -250), 
        new THREE.Vector3(50, 125, -250), 
        new THREE.Vector3(150, 125, -150), 
        new THREE.Vector3(200, 125, 150),  
        new THREE.Vector3(150, 125, 250),  
        new THREE.Vector3(50, 125, 300),  
        new THREE.Vector3(-50, 125, 300), 
        new THREE.Vector3(-150, 125, 250), 
        new THREE.Vector3(-200, 125, 150),
        new THREE.Vector3(-150, 125, -150), // Close the Track 
    ];
  }

  /**
    * Creates the necessary elements for the curve
    */
  buildCurve() {
    this.createCurveMaterialsTextures();
    this.createCurveObjects();
  }
    
  /**
    * Create materials for the curve elements: the mesh, the line and the wireframe
    */
  createCurveMaterialsTextures() {
    const texture = new THREE.TextureLoader().load("scene/textures/track.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.MeshPhongMaterial({ map: texture });
    this.material.map.repeat.set(3, 3);
  }
    
  /**
    * Creates the mesh, the line and the wireframe used to visualize the curve
    */
  createCurveObjects() {
    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      16,
      this.closedCurve
    );
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotateZ(Math.PI);
    this.mesh.scale.set(1, 0.2, 1);
    this.mesh.receiveShadow = true; 
    this.object.add(this.mesh);
  }

  /**
   * Find the closest point no track based on a given position
   * @param {*} position 
   * @returns Closest Point
   */
  getClosestPoint(position) {
    let closestT = 0;
    let minDistance = Infinity;

    // Iterates over segments to find the closest point
    const divisions = 1000; 
    for (let i = 0; i <= divisions; i++) {
      const t = i / divisions;
      const point = this.path.getPointAt(t);
      const distance = position.distanceTo(point);

      if (distance < minDistance) {
        minDistance = distance;
        closestT = t;
      }
    }

    return closestT;
  }

  /**
   * Routes for autonomous balloons
   */
  createRoutes() {
    const route1 = new MyRoute([
      new THREE.Vector3(-150, 0, -150), 
      new THREE.Vector3(-190, 10, 140), 
      new THREE.Vector3(-140, 10, 240), 
      new THREE.Vector3(-40, 10, 290), 
      new THREE.Vector3(60, 10, 290),  
      new THREE.Vector3(170, 10, 240),  
      new THREE.Vector3(190, 10, 140),  
      new THREE.Vector3(140, 10, -140), 
      new THREE.Vector3(60, 10, -240),
      new THREE.Vector3(-40, 10, -240),
      new THREE.Vector3(-150, 0, -150),
    ], 50);

    const route2 = new MyRoute([
      new THREE.Vector3(-150, 0, -150), 
      new THREE.Vector3(-210, 10, 160),
      new THREE.Vector3(-160, 10, 260),
      new THREE.Vector3(-60, 10, 310),
      new THREE.Vector3(40, 10, 310),
      new THREE.Vector3(160, 10, 260), 
      new THREE.Vector3(210, 10, 160),
      new THREE.Vector3(130, 10, -160),
      new THREE.Vector3(40, 10, -230),
      new THREE.Vector3(-60, 10, -225),  
      new THREE.Vector3(-150, 0, -150), 
    ], 35);

    const route3 = new MyRoute([
      new THREE.Vector3(-150, 0, -150), 
      new THREE.Vector3(-210, 10, 130),
      new THREE.Vector3(-130, 10, 230),
      new THREE.Vector3(-30, 10, 280),
      new THREE.Vector3(70, 10, 280),
      new THREE.Vector3(160, 10, 230),
      new THREE.Vector3(180, 10, 130),
      new THREE.Vector3(130, 10, -130),
      new THREE.Vector3(70, 10, -230),
      new THREE.Vector3(-30, 10, -230),  
      new THREE.Vector3(-150, 0, -150), 
    ], 45);

    this.routes.push(route1);
    this.routes.push(route2);
    this.routes.push(route3);
  }
}

export { MyTrack };
