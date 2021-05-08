import * as THREE from '/build/three.module.js'
import '/cannon/cannon.min'
export class Sphere {

    world = new CANNON.World()

    //Create sphere
    async createSphere(x, y, z) {

        let sphereMesh: THREE.Mesh = new THREE.Mesh()
        const textureSphere = new THREE.TextureLoader().load('textures/silver-metal-texture-background_46250-2560.jpg');
        textureSphere.wrapS = THREE.RepeatWrapping;
        textureSphere.wrapT = THREE.RepeatWrapping;
        textureSphere.repeat.set(1, 1);
        const phongMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x2b4bff, map: textureSphere })
        const sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(x, y, z)
        sphereMesh = new THREE.Mesh(sphereGeometry, phongMaterial)
        sphereMesh.position.x = 22
        sphereMesh.position.y = 3
        sphereMesh.position.z = 48
        sphereMesh.castShadow = true
        sphereMesh.material.metalness = .3
        sphereMesh.material.roughness = 0.3
        
        return sphereMesh;
    }
    //Create cannon body 
    async createBody(x) {

        const sphereShape: CANNON.Sphere = new CANNON.Sphere(x)
        const sphereBody: CANNON.Body = new CANNON.Body({ mass: 1 });
        sphereBody.addShape(sphereShape)
        sphereBody.position.x = 22
        sphereBody.position.y = 3
        sphereBody.position.z = 48
        return sphereBody
    }
}