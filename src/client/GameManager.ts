//importing prerquisite libraries
import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import Stats from '/jsm/libs/stats.module'
import { GUI } from '/jsm/libs/dat.gui.module'
import '/cannon/cannon.min'
import { Sphere } from './Sphere.js'
import { Maze } from './Maze.js'


class Labyrinth {
    async main() {

        //CANVAS
        const canvas = document.querySelector('#c');

        //SCENE AND WORLD PHYSICS
        let scene: THREE.Scene = new THREE.Scene();
        let world = new CANNON.World();
        
        const block = "block", none = "none";

        //OVERLAY MENU
        const overlay = document.getElementById('overlay');
        overlay.style.display = none;

        const instruction = document.getElementById('instruction');
        instruction.style.display = block;

        //LIGHTS
        let spotLight: THREE.SpotLight = new THREE.SpotLight();
        spotLight.position.set(0, 40, -50);
        spotLight.angle = - Math.PI / 5;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.intensity = 0;
        scene.add(spotLight);

        let ambientLight: THREE.AmbientLight = new THREE.AmbientLight();
        ambientLight.intensity = 1;
        scene.add(ambientLight);

        //CAMERA AND RENDERER
        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        //Default camera position
        camera.position.y = 80;
        camera.position.x = 0;
        camera.position.z = 1;
        
        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        //ORBIT CONTROLS
        const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
        controls.screenSpacePanning = true;
        controls.target.z = 1;

        //Setting default physics values for the world
        world.gravity.set(0, -9.82, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 10;

        let mazeObj = new Maze;
        let mazeMesh = await mazeObj.createMaze();
        scene.add(mazeMesh.scene);
        for (let i = 0; i < mazeObj.world.bodies.length; i++)
            world.addBody(mazeObj.world.bodies[i]);
        let sphereObj = new Sphere;
        let sphereMesh: THREE.Mesh = await sphereObj.createSphere(1, 32, 32);
        scene.add(sphereMesh);
        const sphereBody: CANNON.Body = await sphereObj.createBody(1);
        world.addBody(sphereBody);
        // creating audio listener

        const listener = new THREE.AudioListener();
        camera.add(listener);

        // create a global audio source
        const sound = new THREE.Audio(listener);

        const audioLoader = new THREE.AudioLoader();

        //Load a sound and set it as the Audio object's buffer
        audioLoader.load("sounds/Child's Nightmare.ogg", function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.01);

            sound.play();

        },
            // onProgress callback
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },

            // onError callback
            function (err) {
                console.log('An error has occured');
            }

        );

        //resize renderer on window resize
        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            render();
        }

        //stats panel
        const stats = Stats();
        document.body.appendChild(stats.dom);

        //GUI panel
        // const gui = new GUI();
        // const physicsFolder = gui.addFolder("Physics")
        // physicsFolder.add(world.gravity, "x", -10.0, 10.0, 0.1)
        // physicsFolder.add(world.gravity, "z", -10.0, 10.0, 0.1)
        // physicsFolder.open()

        //clock
        const clock: THREE.Clock = new THREE.Clock();

        let flag = 0;
        const UP = 87, DOWN = 83, LEFT = 68, RIGHT = 65, ESCAPE = 27;

        //listener for key press
        document.addEventListener("keydown", onDocumentKeyDown, false);
        function onDocumentKeyDown(event) {

            //zooming in camera to sphere on key press
            let zoom = setInterval(zoomCamera, 5);

            //setting default gravity  
            world.gravity.set(0, -12, 0);
            let keyCode = event.which;
            if (keyCode == UP) {            //UP
                spotLight.target = sphereMesh;
                world.gravity.z = -8;
            } else if (keyCode == DOWN) {     //DOWN  
                spotLight.target = sphereMesh;
                world.gravity.z = 8;
            } else if (keyCode == RIGHT) {     //RIGHT
                spotLight.target = sphereMesh;
                world.gravity.x = -8;
            } else if (keyCode == LEFT) {     //LEFT
                spotLight.target = sphereMesh;
                world.gravity.x = 8;
            } else if (keyCode == 32) { // RESET GRAVITY TO 0
                world.gravity.set(0, -12, 0);
            } else if (keyCode == ESCAPE) { // PAUSE MENU
                if (flag != 1) {
                    flag = 1;
                    cancelAnimationFrame(myReq);
                    sound.pause();
                    const overlay = document.getElementById('overlay');
                    overlay.style.display = block;

                    let menu = document.getElementById('menu');
                    menu.style.display = none;

                    let specialBox = document.getElementById('end');
                    specialBox.style.display = none;

                    let pause = document.getElementById('pause');
                    pause.style.display = block;

                    const reset = document.getElementById('reset');
                    reset.addEventListener('click', reload);

                }
                else {
                    flag = 0;
                    sound.play();
                    animate();
                    overlay.style.display = none;
                }
            }
        };

        // //Function to zoom in to the sphere and reduce lights to only spotlight
        let zoomCamera = function () {
            spotLight.intensity = 0.3;
            ambientLight.intensity = 0.7;
            spotLight.target = sphereMesh;
            spotLight.position.z = sphereMesh.position.z;
            spotLight.position.x = sphereMesh.position.x;
            camera.position.x = sphereMesh.position.x;
            camera.position.y = sphereMesh.position.y + 20;
            camera.position.z = sphereMesh.position.z + 4;
            controls.target.x = sphereMesh.position.x;
            controls.target.y = sphereMesh.position.y;
            controls.target.z = sphereMesh.position.z;
        }
        let myReq, score=10000;

        //Function to animate every frame and render it
        let animate = function () {
            myReq = requestAnimationFrame(animate);

            controls.update();

            let delta = clock.getDelta();
            if (delta > .1) delta = .1;
            world.step(delta);
            score--;
            sphereMesh.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z);
            sphereMesh.quaternion.set(sphereBody.quaternion.x, sphereBody.quaternion.y, sphereBody.quaternion.z, sphereBody.quaternion.w);
            setInterval(zoomCamera, 15000);
            render();
            if (sphereMesh.position.z > 50) {
                end();
            }
            stats.update();
        };
        function render() {
            renderer.render(scene, camera)
        }
        animate();

        // Function to display end screen once the game is over
        let end = () => {
            document.removeEventListener("keydown", onDocumentKeyDown);
            cancelAnimationFrame(myReq);
            sound.stop();

            const overlay = document.getElementById('overlay');
            overlay.style.display = block;

            let menu = document.getElementById('menu');
            menu.style.display = none;
            if(score<0)
            score=0;
            const levelTitle = document.getElementById('score');
            levelTitle.innerHTML = '<h1>Score: ' + score + ' Points</h1>';

            let specialBox = document.getElementById('end');
            specialBox.style.display = block;

            let pause = document.getElementById('pause');
            pause.style.display = none;
            const playAgain = document.getElementById('playAgain');

            playAgain.addEventListener('click', reload);
        }
        let reload = () => {
            location.reload()
        }
    }
}

let gameObj = new Labyrinth;
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', gameObj.main);