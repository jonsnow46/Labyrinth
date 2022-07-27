import express from "express";
import path from "path";
import http from "http";

const port: number = 3005;

class App {

    private server: http.Server;
    private port: number;

    constructor(port: number) {
        this.port = port;
        const app = express();
        app.use(express.static(path.join(__dirname, '../client')));
        app.use('/build/three.module.js', express.static(path.join(__dirname, '../../node_modules/three/build/three.module.js')));
        app.use('/Maze.js', express.static(path.join(__dirname, '../../dist/client/Maze.js')));
        app.use('/Sphere.js', express.static(path.join(__dirname, '../../dist/client/Sphere.js')));
        app.use('/GameManager', express.static(path.join(__dirname, '../../dist/client/GameManager.js')));
        app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/controls/OrbitControls.js')));
        app.use('/jsm/loaders/GLTFLoader', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js')));
        app.use('/jsm/libs/stats.module', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/libs/stats.module.js')));
        app.use('/jsm/libs/dat.gui.module', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/libs/dat.gui.module.js')));
        app.use('/cannon/cannon.min', express.static(path.join(__dirname, '../../node_modules/cannon/build/cannon.min.js')));
        app.use('/jsm/loaders/SVGLoader', express.static(path.join(__dirname, '../../node_modules/three/examples/jsm/loaders/SVGLoader.js')));

        this.server = new http.Server(app);
        this.server = new http.Server(app);
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        })
    }

}

new App(port).Start()