// Set up the scene, camera, and renderer as global variables.
var scene, camera, light, renderer, model, controls;

init();
animate();

function init() {

    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 20000);

    camera.position.set(163, 59, 16);
    scene.add(camera);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    renderer.setClearColor(0xffffff, 1);

    light = new THREE.PointLight(0xffffff);
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;
    light.castShadow = true;
    scene.add(light);

    scene.add(makeSkybox([
        'assets/skybox/left.png', // right
        'assets/skybox/right.png', // left
        'assets/skybox/top.png', // top
        'assets/skybox/bottom.png', // bottom
        'assets/skybox/back.png', // back
        'assets/skybox/front.png' // front
    ], 5000));

    mapRender();

    controls = new THREE.OrbitControls(camera, renderer.domElement);


}


function animate() {
    requestAnimationFrame(animate);
    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;
    renderer.render(scene, camera);
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
    // Geometry: walls
    var UNITSIZE = 250,
        WALLHEIGHT = UNITSIZE / 2.5,
        map = [ // 1  2  3  4  5  6  7  8  9
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ], // 0
            [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, ], // 1
            [1, 1, 0, 0, 2, 0, 0, 0, 0, 1, ], // 2
            [1, 0, 0, 0, 0, 2, 0, 0, 0, 1, ], // 3
            [1, 0, 0, 2, 0, 0, 2, 0, 0, 1, ], // 4
            [1, 0, 0, 0, 2, 0, 0, 0, 1, 1, ], // 5
            [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, ], // 6
            [1, 1, 1, 0, 0, 1, 0, 0, 1, 1, ], // 7
            [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, ], // 8
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ], // 9
        ],
        mapW = map.length,
        mapH = map[0].length,
        units = mapW;


    var floor;
    var loader = new THREE.TextureLoader();
    var texture = loader.load('assets/floor-1.jpg', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(50, 50);
    });
    floor = new THREE.Mesh(
        new THREE.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
        new THREE.MeshLambertMaterial({
            map: texture
        })
    );
    scene.add(floor);

    var cube = new THREE.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var materials = [
        new THREE.MeshLambertMaterial({ /*color: 0x00CCAA,*/
            map: THREE.ImageUtils.loadTexture('assets/wall-1.jpg')
        }),
        new THREE.MeshLambertMaterial({ /*color: 0xC5EDA0,*/
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
