import * as THREE from '/build/three.module.js'
import '/cannon/cannon.min'
import { GLTFLoader } from '/jsm/loaders/GLTFLoader'
export class Maze {

    world = new CANNON.World()
    mazeBody1 = new CANNON.Body({ mass: 0 });
    async createMaze() {

        let mazeMesh: THREE.Object3D
        let mazeBody: CANNON.Body
        //Create plane and applying Cannon body

        const planeShape = new CANNON.Plane()
        const planeBody = new CANNON.Body({ mass: 0 })
        planeBody.addShape(planeShape)
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
        planeBody.position.y = -3;
        this.world.addBody(planeBody)
        //Loading a GLTF model and applying Cannon body respective to the model

        const gltfLoader: GLTFLoader = new GLTFLoader();
        mazeMesh = await gltfLoader.loadAsync('models/maze1.glb.gltf');

        mazeMesh.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const mazeShape = CreateTrimesh((child as THREE.Mesh).geometry)
                mazeBody = new CANNON.Body({ mass: 0 });
                mazeBody.addShape(mazeShape)
                if (child.name == 'Mesh_100') //checking for plane
                    mazeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
                mazeBody.position.x = child.position.x
                mazeBody.position.y = child.position.y
                mazeBody.position.z = child.position.z
                this.mazeBody1.addShape(mazeShape)
                this.world.addBody(mazeBody)
            }
        });

        //Creating Cannon bodies for respective vertices
        function CreateTrimesh(geometry: THREE.BufferGeometry): CANNON.Trimesh {
            const vertices: number[] = <number[]>geometry.attributes.position.array
            const indices: number[] = Object.keys(vertices).map(Number);
            return new CANNON.Trimesh(vertices, indices);
        }

        return mazeMesh;
    }
}