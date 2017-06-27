// Set up the scene, camera, and renderer as global variables.
var scene, camera, lights, renderer, model, player, controls, movementControls, MOVESPEED = 10, LOOKSPEED = 5;
var UNITSIZE = 500,
    WALLHEIGHT = UNITSIZE / 1.5,
    map = [ // 1  2  3  4  5  6  7  8  9
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ], // 0
        [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, ], // 1
        [1, 1, 0, 0, 2, 0, 0, 0, 0, 1, 1, ], // 2
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1, ], // 3
        [1, 0, 0, 2, 0, 0, 2, 0, 0, 1, 1, ], // 4
        [1, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1, ], // 5
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, ], // 6
        [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, ], // 7
        [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, ], // 8
        [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, ], // 9
    ],
    // map = createMap(20, 20),
    mapW = map.length,
    mapH = map[0].length,
    units = mapW,
    mouse = {
        x: 0,
        y: 0
    };

init();
animate();

function init() {
    // scene
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0xffffff, 1);
    document.body.appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 20000);
    // camera.position.set(235.5, 115, 214.5);
    camera.position.set(3000, 115, 2035);
    scene.add(camera);

  //   // Camera moves with mouse, flies around with WASD/arrow keys
	// controls = new THREE.FirstPersonControls(camera); // Handles camera control
	// controls.movementSpeed = MOVESPEED; // How fast the player can walk around
	// controls.lookSpeed = LOOKSPEED; // How fast the player can look around with the mouse
	// controls.lookVertical = false; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
	// controls.noFly = true; // Don't allow hitting R or F to go up or down

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    // lights: PointLight
    lights = new THREE.PointLight(0xffffff);
    lights.intensity = 2;
    lights.distance = 1500;
    lights.decay = 2;
    lights.position.x = camera.position.x;
    lights.position.y = camera.position.y;
    lights.position.z = camera.position.z;
    lights.castShadow = true;
    scene.add(lights);

    // lights: AmbientLight
    var ambient = new THREE.AmbientLight(0x404040); // soft white light
    ambient.intensity = 1;
    scene.add(ambient);

    //setting up spotlight to cast light
    // lights = new THREE.SpotLight(0xffffff);
    // lights.position.x = camera.position.x;
    // lights.position.y = camera.position.y;
    // lights.position.z = camera.position.z;
    // lights.castShadow = true;
    // lights.intensity = 2;
    // lights.angle = Math.PI / 3;
    // lights.penumbra = 1;
    // lights.decay = 1;
    // lights.distance = 1000;
    // lights.shadow.mapSize.width = 1024;
    // lights.shadow.mapSize.height = 1024;
    // lights.shadow.camera.near = 1;
    // lights.shadow.camera.far = 200;
    // scene.add(lights);


    scene.add(makeSkybox([
        'assets/skybox/left.png', // right
        'assets/skybox/right.png', // left
        'assets/skybox/top.png', // top
        'assets/skybox/bottom.png', // bottom
        'assets/skybox/back.png', // back
        'assets/skybox/front.png' // front
    ], 8000));
    mapRender();
    spawnPlayer();
    attachListener();
    movementControls = new Control(camera);
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
}


function animate() {
    requestAnimationFrame(animate);
    lights.position.x = camera.position.x;
    lights.position.y = camera.position.y;
    lights.position.z = camera.position.z;
    player.position.x = camera.position.x + 130;
    player.position.y = camera.position.y / 1.5;
    player.position.z = camera.position.z - 200;

    renderer.render(scene, camera);
    movementControls.update();
    // controls.update();
}

function makeSkybox(urls, size) {
    var skyboxCubemap = new THREE.CubeTextureLoader().load(urls);
    skyboxCubemap.format = THREE.RGBFormat;
    var skyboxShader = THREE.ShaderLib['cube'];
    skyboxShader.uniforms['tCube'].value = skyboxCubemap;
    return new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.ShaderMaterial({
            fragmentShader: skyboxShader.fragmentShader,
            vertexShader: skyboxShader.vertexShader,
            uniforms: skyboxShader.uniforms,
            depthWrite: false,
            side: THREE.DoubleSide
        })
    );
}

function mapRender() {
    // Geometry: floor
    var floor;
    var loader = new THREE.TextureLoader();
    var texture = loader.load('assets/floor-1.jpg', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(50, 50);
    });
    floor = new THREE.Mesh(
        new THREE.CubeGeometry(units * (UNITSIZE + 250), 10, units * (UNITSIZE + 250)),
        new THREE.MeshLambertMaterial({
            map: texture
        })
    );
    scene.add(floor);

    //Geometry: walls
    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var materials = [
        new THREE.MeshLambertMaterial({
            // color: 0x00CCAA,
            map: THREE.ImageUtils.loadTexture('assets/wall-1.jpg')
        }),
        new THREE.MeshLambertMaterial({
            // color: 0xC5EDA0,
            map: THREE.ImageUtils.loadTexture('assets/wall-2.jpg')
        }),
        new THREE.MeshLambertMaterial({
            color: 0xFBEBCD
        }),
    ];
    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j]) {
                var wall = new THREE.Mesh(cube, materials[map[i][j] - 1]);
                wall.position.x = (i - units / 2) * UNITSIZE;
                wall.position.y = WALLHEIGHT / 2;
                wall.position.z = (j - units / 2) * UNITSIZE;
                scene.add(wall);
            }
        }
    }
}

function spawnPlayer() {
    var i = parseInt(Math.random() * 10),
        j = parseInt(Math.random() * 10);
    if (map[i][j] == 0) {
        var x = (i - units / 2) * UNITSIZE;
        var z = (j - units / 2) * UNITSIZE;
        camera.position.x = x;
        camera.position.z = z;

        var loader = new THREE.TextureLoader();
        var pMaterial = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('assets/gun.png'),
            transparent: true
        });
        player = new THREE.Mesh(new THREE.PlaneGeometry(128, 128), pMaterial);
        // player.overdraw = true;
        scene.add(player);
    } else {
        spawnPlayer();
    }
}

function attachListener() {
    document.getElementsByTagName('body')[0].addEventListener('keydown', function(event) {
        movementControls.setMove(event.keyCode);
    });

    document.getElementsByTagName('body')[0].addEventListener('keyup', function(event) {
        movementControls.resetMove(event.keyCode);
    });

    document.getElementsByTagName('body')[0].addEventListener('mousemove', function(event) {
        var delx = 0,
            dely = 0;

        delx = mouse.x - event.clientX;
        dely = mouse.y - event.clientY;

        // delx=delx<0?delx*-1:delx,
        // dely=dely<0?dely*-1:dely;

        movementControls.lookAround(delx / 100);
        player.position.x += delx / 100;
        mouse.x = event.clientX;
        mouse.y = event.clientY;

    });
}
