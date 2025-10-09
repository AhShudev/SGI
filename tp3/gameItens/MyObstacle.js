import * as THREE from 'three';


class MyObstacle {
    constructor(graph, obstacleData, loader) {
        this.graph = graph;
        this.obstacleData = obstacleData;
        this.loader = loader;

        // Load the obstacle model
        this.object = this.loader.loadNode(this.graph, this.obstacleData.nodeId);
    }

}

export { MyObstacle };