document.body.style.cursor = 'none'

/* three.js terrain */
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as CANNON from 'cannon-es';

// https://threejs.org/examples/?q=pointerlock#misc_controls_pointerlock

let path = 'Simon'

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;


let prevTime = performance.now();
const velocity = new THREE.Vector3(); 
const direction = new THREE.Vector3();
const speed = 10;
const moveSpeed = 300 * 2.5;

// Canvas
const canvas = document.querySelector('canvas.webgl');
const clock = new THREE.Clock();


// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.y = 10;
camera.position.x = -56.026;
camera.position.z = -310.555;
camera.rotation.y = 4;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '50%';
renderer.domElement.style.left = '50%';
renderer.domElement.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(renderer.domElement);

renderer.setAnimationLoop(animate);

const controls = new PointerLockControls(camera, renderer.domElement);

scene.add(controls.object); 
const onKeyDown = function (event) {

    switch (event.code) {


        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyD':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyA':
            moveRight = true;
            break;

        case 'Space':
            if (canJump === true) velocity.y += 200;
            canJump = false;
            break;

    }

};

const onKeyUp = function (event) {

    switch (event.code) {


        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyD':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyA':
            moveRight = false;
            break;

    }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyT') {
        if (path === 'Simon') {
            camera.position.y = 10;
            camera.position.x = 635.7920;
            camera.position.z = 11.0339;

            path = 'Daniel';
        } else {
            camera.position.y = 10;
            camera.position.x = -56.026;
            camera.position.z = -310.555;

            path = 'Simon';
        }
    }
});


document.addEventListener('click', function () {


    controls.lock();

});

controls.addEventListener('lock', function () {
    console.log("locked");

});


// Background music
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const backgroundMusic = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('static/Sound/Background.mp3', function (buffer) {
    backgroundMusic.setBuffer(buffer);
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(0.05); 
});

document.addEventListener('click', () => {
    if (!backgroundMusic.isPlaying) {
        backgroundMusic.play();
    }
});

// Footstep sound
const footstepSound = new THREE.Audio(audioListener);
audioLoader.load('static/Sound/Footsteps.mp3', function (buffer) {
    footstepSound.setBuffer(buffer);
    footstepSound.setLoop(true);
    footstepSound.setVolume(0.2);
});

function updateFootstepSound() {
    if (moveForward || moveBackward || moveLeft || moveRight) {
        if (!footstepSound.isPlaying) {
            footstepSound.play();
        }
    } else {
        if (footstepSound.isPlaying) {
            footstepSound.stop();
        }
    }
}

// Models
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = false; 
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(100, 100, 5)
scene.add(directionalLight)

const raycaster = new THREE.Raycaster();
const collisionObjects = [];
const limitedCollisionObjects = collisionObjects.slice(0, 10);

const interactiveObjects = [];

const raycasterD = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
    if (event.button === 0) {
        raycasterD.setFromCamera(mouse, camera);
        const intersects = raycasterD.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const distance = intersects[0].distance;

            if (distance < 15) { 
                showInfoWindow(object);
            }
        }
    }
}

function showInfoWindow(object) {
    const infoWindow = document.createElement('div');
    infoWindow.style.position = 'fixed'; 
    infoWindow.style.top = '10%';
    infoWindow.style.left = '0'; 
    infoWindow.style.width = '25%'; 
    infoWindow.style.height = 'auto';
    infoWindow.style.padding = '5px';
    infoWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; 
    infoWindow.style.color = 'white';
    infoWindow.style.borderRight = '2px solid white';
    infoWindow.style.overflowY = 'auto';
    infoWindow.style.zIndex = '1000'; 
    infoWindow.style.fontSize = '0.4rem'; 
    infoWindow.style.lineHeight = '0.6rem'; 
    infoWindow.style.transition = 'left 0.3s ease'; 
    infoWindow.innerHTML = `
        <h3 style="margin: 0 0 5px 0; font-size: 0.6rem;">Object Information</h3>
        <p><strong>Name:</strong> ${object.parent.name || 'Unnamed Object'}</p>
        <p><strong>Description:</strong> ${object.parent.description || 'No description available.'}</p>
        <p style="margin-top: 5px;">Press "X" to close this window.</p>
    `;
    document.body.appendChild(infoWindow);

    setTimeout(() => {
        infoWindow.style.left = '0';
    }, 10);

    function closeInfoWindow(event) {
        if (event.code === 'KeyX') {
            infoWindow.style.left = '-25%';
            setTimeout(() => {
                document.body.removeChild(infoWindow);
            }, 300); 
            document.removeEventListener('keydown', closeInfoWindow);
        }
    }

    document.addEventListener('keydown', closeInfoWindow);
}

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);

interactiveObjects.forEach(mesh => {
    if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        const boundingBox = mesh.geometry.boundingBox.clone();
        boundingBox.expandByScalar(2);
        mesh.geometry.boundingBox = boundingBox;
    }
});

gltfLoader.load(
    'static/models/Path/Path1/Path.gltf',
    (gltf) => {
        console.log('success ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            //console.log("tetstststs")
            //console.log(mesh.name);
            mesh.scale.set(3, 3, 3);
            mesh.position.y += 2.2;
            mesh.position.x += 5;
            mesh.position.z += -260;

            function allDescendents(node) {
                for (let i = 0; i < node.children.length; i++) {
                    let child = node.children[i];
                    console.log(child.name);
                    allDescendents(child);
                    //the name does not wqual as it is _1, _2 ...
                    if (child.isMesh && child.name.startsWith('WallRooft')) {
                        //  console.log("herer")
                        collisionObjects.push(child);
                    }
                }
            }

            allDescendents(mesh);

        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

gltfLoader.load(
    'static/models/Path/Path2/Daniel.gltf',
    (gltf) => {
        console.log('success_2 ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            // console.log("tetstststs")
            //console.log(mesh.name);
            mesh.scale.set(12, 12, 12);
            mesh.position.y += 7;
            mesh.position.x += 800;


            function allDescendents(node) {
                for (let i = 0; i < node.children.length; i++) {
                    let child = node.children[i];
                    console.log(child.name);
                    allDescendents(child);
                    if (child.isMesh) {
                        // collisionObjects.push(child);
                    }
                }
            }

            allDescendents(mesh);

        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

gltfLoader.load(
    'static/models/Path/Floor2/Daniel.gltf',
    (gltf) => {
        console.log('success_2 ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            // console.log("tetstststs")
            //console.log(mesh.name);
            mesh.scale.set(12, 12, 12);
            mesh.position.y += 7;
            mesh.position.x += 800;


        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

gltfLoader.load(
    'static/models/Path/car/Daniel.gltf',
    (gltf) => {
        console.log('success_2 ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {

            //console.log(mesh.name);
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 10.2;
            mesh.position.x = 704;
            mesh.position.z = 121;


        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);


gltfLoader.load(
    'static/models/Path/figures/MK5/Untitled.gltf',
    (gltf) => {
        console.log('success_2 ')
        let modelArray = gltf.scene.children;


        modelArray.forEach(mesh => {
            //console.log(mesh.name);
            mesh.scale.set(2, 2, 2);
            mesh.position.y += 10.2;
            mesh.position.x = 704;
            mesh.position.z = 121;


        });
        for (const childmodel of modelArray) {
            scene.add(childmodel)
        }
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
);

const chairConfigs = [
    {
        position: { x: -70.5, y: 0.5, z: -328 },
        rotationY: Math.PI / 4, 
        scale: { x: 8, y: 8, z: 8 }
    },
    {
        position: { x: -77, y: 0.5, z: -309 },
        rotationY: Math.PI / 2,
        scale: { x: 8, y: 8, z: 8 }
    },
    {
        position: { x: -52, y: 0.5, z: -335 },
        rotationY: Math.PI * 2, // 
        scale: { x: 8, y: 8, z: 8 }
    }
];

gltfLoader.load(
    'static/models/Simon Models/Chair/ArmChair_01_1k.gltf',
    (gltf) => {
        console.log('Chair models loaded successfully');

        chairConfigs.forEach((config) => {
            const chair = gltf.scene.clone();

            chair.position.set(config.position.x, config.position.y, config.position.z);

            chair.rotation.y = config.rotationY;

            chair.scale.set(config.scale.x, config.scale.y, config.scale.z);

            scene.add(chair);
        });
    },
    (progress) => {
        console.log('Loading chair models progress:', progress);
    },
    (error) => {
        console.error('Error loading chair models:', error);
    }
);



/** Soap Box Exhibit */

/** Soap Box Table */
gltfLoader.load(
    'static/models/Simon Models/Table/side_table_tall_01_1k.gltf', 
    (gltf) => {
        console.log('Table model loaded successfully');

        const table = gltf.scene;

        table.position.set(335, 0.5, -210);

        table.scale.set(10, 7, 10); 

        scene.add(table);
    },
    (progress) => {
        console.log('Loading table model progress:', progress);
    },
    (error) => {
        console.error('Error loading table model:', error);
    }
);

/** Soap Box Model */

let soapBox; 
gltfLoader.load(
    'static/models/Simon Models/SoapBox/soapbox-asset.gltf',
    (gltf) => {
        console.log('Soap box model loaded successfully');

        soapBox = gltf.scene;

        const soapBoxTexture = textureLoader.load(
            'static/models/Simon Models/SoapBox/soapbox_texture.png', 
            () => console.log('Texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading texture:', error)
        );

        soapBox.traverse((child) => {
            if (child.isMesh) {
                child.material.map = soapBoxTexture;
                child.material.needsUpdate = true;

                interactiveObjects.push(child);

                soapBox.name = "Soap Box";
                soapBox.description = "A beautifully crafted soap box with intricate details.";
            }
        });

        soapBox.position.set(335, 8.5, -210); 

        soapBox.scale.set(3.5, 3.5, 3.5);

        scene.add(soapBox);
    },
    (progress) => {
        console.log('Loading soap box model progress:', progress);
    },
    (error) => {
        console.error('Error loading soap box model:', error);
    }
);

/** Soap Box Frames */
const soapBoxFrameConfigs = [
    {
        position: { x: 362, y: 13, z: -195 },
        rotationY: -Math.PI / 2,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/frame/soapbox_texture.png',
        name: "Soap Box 2D render",
        description: "The original 2D render of the soap box. It was printed out and folded to create a real, physical box."
    },
    {
        position: { x: 362, y: 13, z: -225 },
        rotationY: -Math.PI / 2,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/frame/soapbox_blender.png',
        name: "Soap Box Blender Render",
        description: "A 3D rendered version of the soapbox, made on blender."
    }
];

soapBoxFrameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf',
        (gltf) => {
            console.log(`Soap Box frame ${index + 1} loaded successfully`);

            const frame = gltf.scene;
            frame.position.set(config.position.x, config.position.y, config.position.z);
            frame.rotation.y = config.rotationY;
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);
            scene.add(frame);

            const photoTexture = textureLoader.load(config.texturePath);
            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);
            photo.position.set(0, 0, 0.01);
            frame.add(photo);

            frame.traverse((child) => {
                if (child.isMesh) {
                    interactiveObjects.push(child);
                    frame.name = config.name;
                    frame.description = config.description; 
                }
            });
        }
    );
});

/** Unibank and Additional Frames Configuration */
const unibankFrameConfigs = [
    {
        position: { x: 171, y: 13, z: -420 },
        rotationY: -Math.PI / 10 - Math.PI / 45,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/unibank/Unibank Black.png',
        name: "Unibank Logo",
        description: "A logo made for a made-up company called Unibank."
    },
    {
        position: { x: 211, y: 13, z: -404.6 },
        rotationY: -Math.PI / 10 - Math.PI / 45,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/unibank/Unistore.png',
        name: "Unistore Logo",
        description: "A mockup of a storefront with the Unibank logo as its sign."
    },
    {
        position: { x: 131, y: 13, z: -435 },
        rotationY: -Math.PI / 10 - Math.PI / 45,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/unibank/Graphite_Drawn_Logo_Mockup.png',
        name: "Graphite Unibank Logo",
        description: "A mockup of papers with the Unibank logo."
    }
];

unibankFrameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf',
        (gltf) => {
            console.log(`Unibank frame ${index + 1} loaded successfully`);

            const frame = gltf.scene;
            frame.position.set(config.position.x, config.position.y, config.position.z);
            frame.rotation.y = config.rotationY;
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);
            scene.add(frame);

            const photoTexture = textureLoader.load(config.texturePath);
            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);
            photo.position.set(0, 0, 0.01);
            frame.add(photo);

            frame.traverse((child) => {
                if (child.isMesh) {
                    interactiveObjects.push(child);
                    frame.name = config.name;
                    frame.description = config.description; 
                }
            });
        }
    );
});


/**Car Pics Exhibit */
const frameConfigs = [
    // Back Wall
    {
        position: { x: -228, y: 11, z: -11 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Ferrari-2.jpg',
        name: "Ferrari Side Profile",
        description: "A stunning Ferrari captured in a sleek side profile."
    },
    {
        position: { x: -228, y: 11, z: -25.875 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Ferrari.jpg',
        name: "Ferrari Close-Up",
        description: "A close-up of a Ferrari showcasing its iconic design."
    },
    {
        position: { x: -228, y: 11, z: -40.75 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Fiat.jpg',
        name: "Classic Fiat",
        description: "A classic Fiat, a symbol of timeless automotive design."
    },
    {
        position: { x: -228, y: 11, z: -55.625 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Fiat_Yellow.jpg',
        name: "Yellow Fiat",
        description: "A vibrant yellow Fiat, radiating charm and personality."
    },
    {
        position: { x: -228, y: 11, z: -70.5 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Oldporsche.jpg',
        name: "Vintage Porsche",
        description: "A vintage Porsche, a masterpiece of engineering and style."
    },
    {
        position: { x: -228, y: 11, z: -85.375 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenOJ.jpg',
        name: "Orange McLaren",
        description: "A bold McLaren in orange, exuding speed and power."
    },
    {
        position: { x: -228, y: 11, z: -100.25 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenTail.jpg',
        name: "McLaren Rear View",
        description: "The rear view of a McLaren, highlighting its aerodynamic design."
    },
    {
        position: { x: -228, y: 11, z: -115.125 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenUTT.jpg',
        name: "McLaren Concept",
        description: "A unique McLaren concept, blending innovation and artistry."
    },

    // Left Wall
    {
        position: { x: -216, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/Old.jpg',
        name: "Classic Car",
        description: "A nostalgic look at a classic car from a bygone era."
    },
    {
        position: { x: -201.125, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheBlack.jpg',
        name: "Black Porsche",
        description: "A sleek black Porsche, epitomizing elegance and performance."
    },
    {
        position: { x: -186.25, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/McLaren-2.png',
        name: "McLaren",
        description: "A sideangle view of a McLaren, edited using Lightroom and Photoshop AI for the backgroundColor."
    },
    {
        position: { x: -171.375, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheFront.jpg',
        name: "Porsche Front View",
        description: "The front view of a Porsche, a true icon of automotive design."
    },
    {
        position: { x: -156.5, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheGrey.jpg',
        name: "Gray Porsche",
        description: "A gray Porsche, blending sophistication with power."
    },
    {
        position: { x: -141.625, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheNeon.jpg',
        name: "Neon Porsche",
        description: "A neon-lit Porsche, a modern take on a classic design."
    },
    {
        position: { x: -126.75, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/Rari.jpg',
        name: "Ferrari",
        description: "A Ferrari in its full glory, a symbol of speed and luxury."
    },

    // Right Wall
    {
        position: { x: -216, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariRain.jpg',
        name: "Ferrari in Rain",
        description: "A Ferrari captured in the rain, blending beauty with nature."
    },
    {
        position: { x: -201.125, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariSnow.jpg',
        name: "Ferrari in Snow",
        description: "A Ferrari in the snow, a striking contrast of power and serenity."
    },
    {
        position: { x: -186.25, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariTail.jpg',
        name: "Ferrari Rear View",
        description: "The tail view of a Ferrari, showcasing its aerodynamic curves."
    },
    {
        position: { x: -171.375, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/RariY.jpg',
        name: "Yellow Ferrari",
        description: "A Ferrari in yellow, a bold statement of style and performance."
    },
    {
        position: { x: -156.5, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/SkylineXKimlee.jpg',
        name: "Nissan Skyline",
        description: "A Nissan Skyline, a legend in the world of sports cars."
    },
    {
        position: { x: -141.625, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/UnknownCar.jpg',
        name: "Unknown Car",
        description: "An unknown car, a mystery waiting to be unraveled."
    },
    {
        position: { x: -126.75, y: 11, z: -128 },
        rotationY: Math.PI * 2,
        texturePath: 'static/models/Simon Models/cars/Vette.jpg',
        name: "Corvette",
        description: "A Corvette, a true American classic."
    }
];

frameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', 
        (gltf) => {
            console.log(`Frame ${index + 1} model loaded successfully`);

            const frame = gltf.scene;

            frame.position.set(config.position.x, config.position.y, config.position.z);

            frame.rotation.y = config.rotationY;

            frame.scale.set(22, 22, 22); 

            scene.add(frame);

            const photoGeometry = new THREE.PlaneGeometry(0.55, 0.39); 
            const photoTexture = textureLoader.load(
                config.texturePath,
                () => console.log(`Photo texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading photo texture for frame ${index + 1}:`, error)
            );

            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(photoGeometry, photoMaterial);

            photo.position.set(0, 0, 0.01);
            frame.add(photo);

            frame.traverse((child) => {
                if (child.isMesh) {
                    interactiveObjects.push(child);
                    frame.name = config.name;
                    frame.description = config.description;
                }
            });

            console.log(`Photo added to frame ${index + 1}`);
        },
        (progress) => {
            console.log(`Loading frame ${index + 1} model progress:`, progress);
        },
        (error) => {
            console.error(`Error loading frame ${index + 1} model:`, error);
        }
    );
});

/** Isometric Drawings */
const isometricFrameConfigs = [
    {
        position: { x: 157, y: 13, z: 78 },
        rotationY: Math.PI / 12 + Math.PI,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs Night.png',
        name: "Isometric Suburbs Night",
        description: "A serene isometric view of a suburban neighborhood at night."
    },
    {
        position: { x: 103, y: 13, z: 45 },
        rotationY: Math.PI / 6 + Math.PI / 4 + Math.PI / 12 + Math.PI / 18,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs.png',
        name: "Isometric Suburbs Day",
        description: "A bright and colorful isometric depiction of a suburban area during the day."
    },
    {
        position: { x: 191, y: 13, z: 24 },
        rotationY: Math.PI / 3 + Math.PI / 4 + Math.PI,
        scale: { x: 40, y: 40, z: 40 },
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs Night-01.png',
        name: "Isometric Suburbs Alternate Night",
        description: "An alternate isometric view of a suburban neighborhood under the night sky."
    }
];

isometricFrameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf',
        (gltf) => {
            console.log(`Isometric frame ${index + 1} loaded successfully`);

            const frame = gltf.scene;
            frame.position.set(config.position.x, config.position.y, config.position.z);
            frame.rotation.y = config.rotationY;
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);
            scene.add(frame);

            const photoTexture = textureLoader.load(config.texturePath);
            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);
            photo.position.set(0, 0, 0.01);
            frame.add(photo);

            frame.traverse((child) => {
                if (child.isMesh) {
                    interactiveObjects.push(child);
                    frame.name = config.name;
                    frame.description = config.description; 
                }
            });
        }
    );
});


function addCustomDescriptions() {
    interactiveObjects.forEach((object) => {
        if (object.name.includes("Soap Box")) {
            object.parent.name = "Soap Box";
            object.parent.description = "A beautifully crafted soap box with intricate details.";
        } else if (object.name.includes("Soap Box Photo Frame 1")) {
            object.parent.name = "Soap Box Photo Frame 1";
            object.parent.description = "A photo frame showcasing the soap box in its full glory.";
        } else if (object.name.includes("Soap Box Photo Frame 2")) {
            object.parent.name = "Soap Box Photo Frame 2";
            object.parent.description = "A second photo frame showcasing the soap box from another angle.";
        } else if (object.name.includes("Unibank Frame")) {
            object.parent.name = `Unibank Frame ${object.name.split(" ")[2]}`;
            object.parent.description = `A Unibank photo displayed in frame ${object.name.split(" ")[2]}.`;
        } else if (object.name.includes("Car Photo Frame")) {
            object.parent.name = `Car Photo Frame ${object.name.split(" ")[3]}`;
            object.parent.description = `A car photo displayed in frame ${object.name.split(" ")[3]}.`;
        } else if (object.name.includes("Isometric Drawing Frame")) {
            object.parent.name = `Isometric Drawing Frame ${object.name.split(" ")[3]}`;
            object.parent.description = `An isometric drawing displayed in frame ${object.name.split(" ")[3]}.`;
        }
    });
}

addCustomDescriptions();

function movementUpdate() {
    controls.object.position.y = 10;
    const time = performance.now();
    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * speed * delta;
        velocity.z -= velocity.z * speed * delta;

        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * moveSpeed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * moveSpeed * delta;

        const originalPosition = controls.object.position.clone();
        
        controls.moveForward(- velocity.z * delta);
        controls.moveRight(velocity.x * delta);
        
        raycaster.ray.origin.copy(controls.object.position);
        raycaster.ray.origin.y = 10;

        const rayDirections = [
            new THREE.Vector3(1, 0, 0),  
            new THREE.Vector3(-1, 0, 0), 
            new THREE.Vector3(0, 0, 1),  
            new THREE.Vector3(0, 0, -1), 
        ];
        
        let collision = false;
        

        for (const rayDir of rayDirections) {
            raycaster.set(raycaster.ray.origin, rayDir);
            const intersections = raycaster.intersectObjects(limitedCollisionObjects, false);
            
            if (intersections.length > 0 && intersections[0].distance < 3) {
                collision = true;
                console.log("Collision detected in direction:", rayDir);
                break;
            }
        }

        if (collision) {
            console.log("Reverting to original position");
            controls.object.position.copy(originalPosition);

            velocity.x = 0;
            velocity.z = 0;
        }

        if (!moveForward && !moveBackward && !moveLeft && !moveRight) {
            velocity.x = 0;
            velocity.z = 0;
        }

        updateFootstepSound();
    }
    
    prevTime = time;
}

let lastTime = 0;
function animate(time) {
    if (time - lastTime > 16) { 
        if (controls.isLocked === true) {
            movementUpdate();
        }

        if (soapBox) {
            soapBox.rotation.y += 0.05; 
        }

        const positionDisplay = document.getElementById('position-display');
        if (positionDisplay) {
            const { x, y, z } = camera.position;
            positionDisplay.textContent = `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`;
        }

        renderer.render(scene, camera);
        lastTime = time;
    }
    requestAnimationFrame(animate);
}
animate();