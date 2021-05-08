var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as THREE from '/build/three.module.js';
import '/cannon/cannon.min';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader';
export class Maze {
    constructor() {
        this.world = new CANNON.World();
        this.mazeBody1 = new CANNON.Body({ mass: 0 });
    }
    createMaze() {
        return __awaiter(this, void 0, void 0, function* () {
            let mazeMesh;
            let mazeBody;
            //Create plane and applying Cannon body
            const planeShape = new CANNON.Plane();
            const planeBody = new CANNON.Body({ mass: 0 });
            planeBody.addShape(planeShape);
            planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
            planeBody.position.y = -3;
            this.world.addBody(planeBody);
            //Loading a GLTF model and applying Cannon body respective to the model
            const gltfLoader = new GLTFLoader();
            mazeMesh = yield gltfLoader.loadAsync('models/maze1.glb.gltf');
            mazeMesh.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const mazeShape = CreateTrimesh(child.geometry);
                    mazeBody = new CANNON.Body({ mass: 0 });
                    mazeBody.addShape(mazeShape);
                    if (child.name == 'Mesh_100') //checking for plane
                        mazeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
                    mazeBody.position.x = child.position.x;
                    mazeBody.position.y = child.position.y;
                    mazeBody.position.z = child.position.z;
                    this.mazeBody1.addShape(mazeShape);
                    this.world.addBody(mazeBody);
                }
            });
            //Creating Cannon bodies for respective vertices
            function CreateTrimesh(geometry) {
                const vertices = geometry.attributes.position.array;
                const indices = Object.keys(vertices).map(Number);
                return new CANNON.Trimesh(vertices, indices);
            }
            return mazeMesh;
        });
    }
}
