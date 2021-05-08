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
export class Sphere {
    constructor() {
        this.world = new CANNON.World();
    }
    //Create sphere
    createSphere(x, y, z) {
        return __awaiter(this, void 0, void 0, function* () {
            let sphereMesh = new THREE.Mesh();
            const textureSphere = new THREE.TextureLoader().load('textures/silver-metal-texture-background_46250-2560.jpg');
            textureSphere.wrapS = THREE.RepeatWrapping;
            textureSphere.wrapT = THREE.RepeatWrapping;
            textureSphere.repeat.set(1, 1);
            const phongMaterial = new THREE.MeshStandardMaterial({ color: 0x2b4bff, map: textureSphere });
            const sphereGeometry = new THREE.SphereGeometry(x, y, z);
            sphereMesh = new THREE.Mesh(sphereGeometry, phongMaterial);
            sphereMesh.position.x = 22;
            sphereMesh.position.y = 3;
            sphereMesh.position.z = 48;
            sphereMesh.castShadow = true;
            sphereMesh.material.metalness = .3;
            sphereMesh.material.roughness = 0.3;
            return sphereMesh;
        });
    }
    //Create cannon body 
    createBody(x) {
        return __awaiter(this, void 0, void 0, function* () {
            const sphereShape = new CANNON.Sphere(x);
            const sphereBody = new CANNON.Body({ mass: 1 });
            sphereBody.addShape(sphereShape);
            sphereBody.position.x = 22;
            sphereBody.position.y = 3;
            sphereBody.position.z = 48;
            return sphereBody;
        });
    }
}
