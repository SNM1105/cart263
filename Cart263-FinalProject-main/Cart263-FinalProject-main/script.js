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
const velocity = new THREE.Vector3(); //movement of camera
const direction = new THREE.Vector3(); //direction
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


// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2); // Half the resolution
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '50%';
renderer.domElement.style.left = '50%';
renderer.domElement.style.transform = 'translate(-50%, -50%)'; // Center align the canvas
document.body.appendChild(renderer.domElement);

renderer.setAnimationLoop(animate);

const controls = new PointerLockControls(camera, renderer.domElement);

scene.add(controls.object); //add camera to the scene
const onKeyDown = function (event) {
    // console.log(event.code);

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
    backgroundMusic.setVolume(0.05); // Adjust volume as needed
});

// Start playback after user interaction
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
    footstepSound.setVolume(0.2); // Adjust volume as needed
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
directionalLight.castShadow = false; // Disable shadows
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(100, 100, 5)
scene.add(directionalLight)

// const objects = []

// Raycasting
const raycaster = new THREE.Raycaster();
const collisionObjects = [];
const limitedCollisionObjects = collisionObjects.slice(0, 10); // Limit collision objects for raycasting

// Array to store interactive objects
const interactiveObjects = [];

// Detect if the cursor is looking at an object and close enough
const raycasterD = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
    if (event.button === 0) { // Check if the left mouse button is clicked
        raycasterD.setFromCamera(mouse, camera);
        const intersects = raycasterD.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const distance = intersects[0].distance;

            if (distance < 15) { // Increased interaction distance
                showInfoWindow(object); // Show information about the object
            }
        }
    }
}

function showInfoWindow(object) {
    const infoWindow = document.createElement('div');
    infoWindow.style.position = 'fixed'; // Fixed position for consistent placement
    infoWindow.style.top = '10%'; // Leave some space at the top
    infoWindow.style.left = '0'; // Align to the left side of the screen
    infoWindow.style.width = '25%'; // Restrict to 25% of the screen width (left half)
    infoWindow.style.height = 'auto'; // Adjust height based on content
    infoWindow.style.padding = '5px'; // Smaller padding for a compact look
    infoWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Slightly transparent background
    infoWindow.style.color = 'white';
    infoWindow.style.borderRight = '2px solid white';
    infoWindow.style.overflowY = 'auto';
    infoWindow.style.zIndex = '1000'; // Ensure it appears above other elements
    infoWindow.style.fontSize = '0.4rem'; // Much smaller font size for compact text
    infoWindow.style.lineHeight = '0.6rem'; // Adjust line height for better spacing
    infoWindow.style.transition = 'left 0.3s ease'; // Smooth transition for sliding in
    infoWindow.innerHTML = `
        <h3 style="margin: 0 0 5px 0; font-size: 0.6rem;">Object Information</h3>
        <p><strong>Name:</strong> ${object.parent.name || 'Unnamed Object'}</p>
        <p><strong>Description:</strong> ${object.parent.description || 'No description available.'}</p>
        <p style="margin-top: 5px;">Press "X" to close this window.</p>
    `;
    document.body.appendChild(infoWindow);

    // Slide the info window into view
    setTimeout(() => {
        infoWindow.style.left = '0';
    }, 10);

    function closeInfoWindow(event) {
        if (event.code === 'KeyX') {
            // Slide the info window out of view
            infoWindow.style.left = '-25%'; // Move it off-screen
            setTimeout(() => {
                document.body.removeChild(infoWindow);
            }, 300); // Wait for the transition to complete
            document.removeEventListener('keydown', closeInfoWindow);
        }
    }

    document.addEventListener('keydown', closeInfoWindow);
}

// Add event listeners for interaction
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);

// Expand the bounding boxes of interactive objects for easier clicking
interactiveObjects.forEach(mesh => {
    if (mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        const boundingBox = mesh.geometry.boundingBox.clone();
        boundingBox.expandByScalar(2); // Expand the bounding box
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
            // console.log("tetstststs")
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
            // console.log("tetstststs")
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

// Define chair configurations
const chairConfigs = [
    {
        position: { x: -70.5, y: 0.5, z: -328 },
        rotationY: Math.PI / 4, // Rotate 45 degrees
        scale: { x: 8, y: 8, z: 8 }
    },
    {
        position: { x: -77, y: 0.5, z: -309 },
        rotationY: Math.PI / 2, // Rotate 90 degrees
        scale: { x: 8, y: 8, z: 8 }
    },
    {
        position: { x: -52, y: 0.5, z: -335 },
        rotationY: Math.PI * 2, // 
        scale: { x: 8, y: 8, z: 8 }
    }
];

// Load and configure chairs
gltfLoader.load(
    'static/models/Simon Models/Chair/ArmChair_01_1k.gltf', // Path to the chair model
    (gltf) => {
        console.log('Chair models loaded successfully');

        chairConfigs.forEach((config) => {
            // Clone the chair model for each configuration
            const chair = gltf.scene.clone();

            // Set position
            chair.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            chair.rotation.y = config.rotationY;

            // Set scale
            chair.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Add the chair to the scene
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
// Load and configure table
gltfLoader.load(
    'static/models/Simon Models/Table/side_table_tall_01_1k.gltf', // Replace with the actual path to your table model
    (gltf) => {
        console.log('Table model loaded successfully');

        // Access the table model
        const table = gltf.scene;

        // Set the position of the table
        table.position.set(335, 0.5, -210);

        // Optionally set the scale if needed
        table.scale.set(10, 7, 10); // Adjust scale as necessary

        // Add the table to the scene
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

let soapBox; // Declare the soap box globally so it can be accessed in the animation loop

gltfLoader.load(
    'static/models/Simon Models/SoapBox/soapbox-asset.gltf', // Replace with the actual path to your soap box model
    (gltf) => {
        console.log('Soap box model loaded successfully');

        // Access the soap box model
        soapBox = gltf.scene;

        // Load the texture
        const soapBoxTexture = textureLoader.load(
            'static/models/Simon Models/SoapBox/soapbox_texture.png', // Replace with the correct path to your PNG
            () => console.log('Texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading texture:', error)
        );

        // Apply the texture to the soap box material
        soapBox.traverse((child) => {
            if (child.isMesh) {
                child.material.map = soapBoxTexture;
                child.material.needsUpdate = true;

                // Add to interactive objects
                interactiveObjects.push(child);

                // Assign name and description
                soapBox.name = "Soap Box";
                soapBox.description = "A beautifully crafted soap box with intricate details.";
            }
        });

        // Set the position of the soap box relative to the table
        soapBox.position.set(335, 8.5, -210); // Adjust Y to place it on top of the table

        // Optionally set the scale if needed
        soapBox.scale.set(3.5, 3.5, 3.5); // Adjust scale as necessary

        // Add the soap box to the scene
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

// Load and configure Soap Box frames dynamically
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
                    frame.name = config.name; // Assign custom name
                    frame.description = config.description; // Assign custom description
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

// Load and configure Unibank frames dynamically
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
                    frame.name = config.name; // Assign custom name
                    frame.description = config.description; // Assign custom description
                }
            });
        }
    );
});


/**Car Pics Exhibit */
// Define frame configurations
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

// Load and configure car photo frames dynamically
frameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Path to the frame model
        (gltf) => {
            console.log(`Frame ${index + 1} model loaded successfully`);

            // Access the frame model
            const frame = gltf.scene;

            // Set position
            frame.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            frame.rotation.y = config.rotationY;

            // Scale the frame
            frame.scale.set(22, 22, 22); // Restored original scale for the frames

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the photo
            const photoGeometry = new THREE.PlaneGeometry(0.55, 0.39); // Restored original dimensions for the photos
            const photoTexture = textureLoader.load(
                config.texturePath, // Use the texture path from the configuration
                () => console.log(`Photo texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading photo texture for frame ${index + 1}:`, error)
            );

            // Apply the texture to the photo material
            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(photoGeometry, photoMaterial);

            // Position the photo inside the frame
            photo.position.set(0, 0, 0.01); // Slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame

            // Add to interactive objects
            frame.traverse((child) => {
                if (child.isMesh) {
                    interactiveObjects.push(child);
                    frame.name = config.name; // Use the custom name
                    frame.description = config.description; // Use the custom description
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

// Load and configure Isometric frames dynamically
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
                    frame.name = config.name; // Assign custom name
                    frame.description = config.description; // Assign custom description
                }
            });
        }
    );
});

// Add custom descriptions for all assets
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

// Call this function after all objects are loaded
addCustomDescriptions();

function movementUpdate() {
    controls.object.position.y = 10;
    const time = performance.now();
    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        // Apply friction
        velocity.x -= velocity.x * speed * delta;
        velocity.z -= velocity.z * speed * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        // Get movement direction
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // This ensures consistent movements in all directions

        // Update velocity based on input
        if (moveForward || moveBackward) velocity.z -= direction.z * moveSpeed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * moveSpeed * delta;

        // Store the original position before movement
        const originalPosition = controls.object.position.clone();
        
        // Apply movement
        controls.moveForward(- velocity.z * delta);
        controls.moveRight(velocity.x * delta);
        
        // After movement, check for collisions
        raycaster.ray.origin.copy(controls.object.position);
        raycaster.ray.origin.y = 10;
        
        // Create multiple raycasters for different directions
        const rayDirections = [
            new THREE.Vector3(1, 0, 0),   // right
            new THREE.Vector3(-1, 0, 0),  // left
            new THREE.Vector3(0, 0, 1),   // forward
            new THREE.Vector3(0, 0, -1),  // backward
        ];
        
        let collision = false;
        
        // Check for collisions in all directions
        for (const rayDir of rayDirections) {
            raycaster.set(raycaster.ray.origin, rayDir);
            const intersections = raycaster.intersectObjects(limitedCollisionObjects, false);
            
            if (intersections.length > 0 && intersections[0].distance < 3) {
                collision = true;
                console.log("Collision detected in direction:", rayDir);
                break;
            }
        }
        
        // If collision detected, revert to original position
        if (collision) {
            console.log("Reverting to original position");
            controls.object.position.copy(originalPosition);
            
            // Reset velocity to prevent "building up" momentum that causes the shooting effect
            velocity.x = 0;
            velocity.z = 0;
        }

        // Reset velocity if no movement keys are pressed
        if (!moveForward && !moveBackward && !moveLeft && !moveRight) {
            velocity.x = 0;
            velocity.z = 0;
        }

        // Update footstep sound
        updateFootstepSound();
    }
    
    prevTime = time;
}

// Throttle animation loop to ~60 FPS
let lastTime = 0;
function animate(time) {
    if (time - lastTime > 16) { // ~60 FPS
        if (controls.isLocked === true) {
            movementUpdate();
        }

        // Rotate the soap box if it exists
        if (soapBox) {
            soapBox.rotation.y += 0.05; // Rotate around the Y-axis
        }

        // Update the position display
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