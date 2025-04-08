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


const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2); // Lower renderer resolution
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

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

/** Soap Box Photos */

gltfLoader.load(
    'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Replace with the actual path to your frame model
    (gltf) => {
        console.log('Frame model loaded successfully');

        // Access the frame model
        const frame = gltf.scene;

        // Scale the frame to make it larger
        frame.scale.set(40, 40, 40); // Adjust scale as necessary

        // Set the position of the frame
        frame.position.set(362, 13, -195); // Adjust position as necessary

        // Rotate the frame to face the camera
        frame.rotation.y = -Math.PI / 2; // Rotate 90 degrees to face the camera

        // Add the frame to the scene
        scene.add(frame);

        // Create a plane for the photo
        const photoGeometry = new THREE.PlaneGeometry(0.55, 0.39); // Adjust width and height to fit the frame
        const photoTexture = textureLoader.load(
            'static/models/Simon Models/frame/soapbox_texture.png', // Replace with the path to your PNG
            () => console.log('Photo texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading photo texture:', error)
        );
        const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
        const photo = new THREE.Mesh(photoGeometry, photoMaterial);

        // Position the photo inside the frame
        photo.position.set(0, 0, 0.01); // Adjust Z to place it slightly in front of the frame
        frame.add(photo); // Add the photo as a child of the frame
    },
    (progress) => {
        console.log('Loading frame model progress:', progress);
    },
    (error) => {
        console.error('Error loading frame model:', error);
    }
);

gltfLoader.load(
    'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Replace with the actual path to your frame model
    (gltf) => {
        console.log('Second frame model loaded successfully');

        // Access the second frame model
        const secondFrame = gltf.scene;

        // Scale the second frame to match the first one
        secondFrame.scale.set(40, 40, 40); // Same scale as the first frame

        // Set the position of the second frame to the left of the first one
        secondFrame.position.set(362, 13, -225); // Adjust X to move it to the left

        // Rotate the second frame to face the camera
        secondFrame.rotation.y = -Math.PI / 2; // Rotate 90 degrees to face the camera

        // Add the second frame to the scene
        scene.add(secondFrame);

        // Create a plane for the new photo
        const newPhotoTexture = textureLoader.load(
            'static/models/Simon Models/frame/soapbox_blender.png', // Replace with the correct path
            () => console.log('New photo texture loaded successfully'),
            undefined,
            (error) => console.error('Error loading new photo texture:', error)
        );

        const newPhotoMaterial = new THREE.MeshBasicMaterial({ map: newPhotoTexture });
        const newPhoto = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), newPhotoMaterial);

        // Position the new photo inside the second frame
        newPhoto.position.set(0, 0, 0.01); // Adjust Z to place it slightly in front of the frame
        secondFrame.add(newPhoto); // Add the new photo as a child of the second frame
    },
    (progress) => {
        console.log('Loading second frame model progress:', progress);
    },
    (error) => {
        console.error('Error loading second frame model:', error);
    }
);

/** Unibank and Additional Frames Configuration */
const unibankFrameConfigs = [
    {
        position: { x: 171, y: 13, z: -420 }, // Position of the Unibank frame
        rotationY: -Math.PI / 10 - Math.PI / 45, // Slight counterclockwise rotation
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/unibank/Unibank Black.png' // Path to the Unibank logo
    },
    {
        position: { x: 211, y: 13, z: -404.6 }, // Position of the frame to the right
        rotationY: -Math.PI / 10 - Math.PI / 45, // Same rotation as the Unibank frame
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/unibank/Unistore.png' // Replace with the correct texture path
    },
    {
        position: { x: 131, y: 13, z: -435 }, // Position of the frame to the left
        rotationY: -Math.PI / 10 - Math.PI / 45, // Same rotation as the Unibank frame
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/unibank/Graphite_Drawn_Logo_Mockup.png' // Replace with the correct texture path
    }
];

// Load and configure frames dynamically
unibankFrameConfigs.forEach((config, index) => {
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

            // Set scale
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the photo
            const photoTexture = textureLoader.load(
                config.texturePath, // Use the texture path from the configuration
                () => console.log(`Photo texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading photo texture for frame ${index + 1}:`, error)
            );

            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);

            // Position the photo inside the frame
            photo.position.set(0, 0, 0.01); // Slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame
        },
        (progress) => {
            console.log(`Loading frame ${index + 1} model progress:`, progress);
        },
        (error) => {
            console.error(`Error loading frame ${index + 1} model:`, error);
        }
    );
});


/**Car Pics Exhibit */
// Define frame configurations
const frameConfigs = [
    //Back Wall
    {
        position: { x: -228, y: 11, z: -11 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Ferrari-2.jpg'
    },
    {
        position: { x: -228, y: 11, z: -25.875 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Ferrari.jpg'
    },
    {
        position: { x: -228, y: 11, z: -40.75 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Fiat.jpg'
    },
    {
        position: { x: -228, y: 11, z: -55.625 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Fiat_Yellow.jpg'
    },
    {
        position: { x: -228, y: 11, z: -70.5 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/Oldporsche.jpg'
    },
    {
        position: { x: -228, y: 11, z: -85.375 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenOJ.jpg'
    },
    {
        position: { x: -228, y: 11, z: -100.25 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenTail.jpg'
    },
    {
        position: { x: -228, y: 11, z: -115.125 },
        rotationY: Math.PI / 2,
        texturePath: 'static/models/Simon Models/cars/McLarenUTT.jpg'
    },

    //Left Wall
    {
        position: { x: -216, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/Old.jpg'
    },
    {
        position: { x: -201.125, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheBlack.jpg'
    },
    {
        position: { x: -186.25, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheBlack.jpg'
    },
    {
        position: { x: -171.375, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheFront.jpg'
    },
    {
        position: { x: -156.5, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheGrey.jpg'
    },
    {
        position: { x: -141.625, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/PorscheNeon.jpg'
    },
    {
        position: { x: -126.75, y: 11, z: 2 },
        rotationY: -Math.PI,
        texturePath: 'static/models/Simon Models/cars/Rari.jpg'
    },
    //Right Wall
    {
        position: { x: -216, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/RariRain.jpg'
    },
    {
        position: { x: -201.125, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/RariSnow.jpg'
    },
    {
        position: { x: -186.25, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/RariTail.jpg'
    },
    {
        position: { x: -171.375, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/RariY.jpg'
    },
    {
        position: { x: -156.5, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/SkylineXKimlee.jpg'
    },
    {
        position: { x: -141.625, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/UnknownCar.jpg'
    },
    {
        position: { x: -126.75, y: 11, z: -128 },
        rotationY: Math.PI*2,
        texturePath: 'static/models/Simon Models/cars/Vette.jpg'
    },
];

// Load and configure frames
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
            frame.scale.set(22, 22, 22); // Adjust scale as necessary

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the photo
            const photoGeometry = new THREE.PlaneGeometry(0.55, 0.39); // Adjust width and height to fit the frame
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
            photo.position.set(0, 0, 0.01); // Adjust Z to place it slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame

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

/** Isometric Drawings*/
const isometricFrameConfigs = [
    {
        position: { x: 157, y: 13, z: 78 }, // Position of the first frame
        rotationY: Math.PI / 12 + Math.PI,
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs Night.png' // Path to the first isometric drawing
    },
    {
        position: { x: 103, y: 13, z: 45 }, // Position of the second frame
        rotationY: Math.PI / 6 + Math.PI / 4 + Math.PI / 12 + Math.PI / 18, // Rotate slightly to face the viewer
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs.png' // Path to the second isometric drawing
    },
    {
        position: { x: 191, y: 13
            , z: 24 }, // Position of the third frame
        rotationY: Math.PI / 3 + Math.PI / 4 + Math.PI, // Rotate slightly to face the viewer
        scale: { x: 40, y: 40, z: 40 }, // Scale of the frame
        texturePath: 'static/models/Simon Models/Isometric/Isometric Suburbs Night-01.png' // Path to the third isometric drawing
    }
];

// Load and configure frames dynamically
isometricFrameConfigs.forEach((config, index) => {
    gltfLoader.load(
        'static/models/Simon Models/frame/fancy_picture_frame_01_1k.gltf', // Path to the frame model
        (gltf) => {
            console.log(`Isometric frame ${index + 1} model loaded successfully`);

            // Access the frame model
            const frame = gltf.scene;

            // Set position
            frame.position.set(config.position.x, config.position.y, config.position.z);

            // Set rotation
            frame.rotation.y = config.rotationY;

            // Set scale
            frame.scale.set(config.scale.x, config.scale.y, config.scale.z);

            // Add the frame to the scene
            scene.add(frame);

            // Create a plane for the isometric drawing
            const photoTexture = textureLoader.load(
                config.texturePath, // Use the texture path from the configuration
                () => console.log(`Isometric drawing texture for frame ${index + 1} loaded successfully`),
                undefined,
                (error) => console.error(`Error loading isometric drawing texture for frame ${index + 1}:`, error)
            );

            const photoMaterial = new THREE.MeshBasicMaterial({ map: photoTexture });
            const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.39), photoMaterial);

            // Position the photo inside the frame
            photo.position.set(0, 0, 0.01); // Slightly in front of the frame
            frame.add(photo); // Add the photo as a child of the frame
        },
        (progress) => {
            console.log(`Loading isometric frame ${index + 1} model progress:`, progress);
        },
        (error) => {
            console.error(`Error loading isometric frame ${index + 1} model:`, error);
        }
    );
});

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
