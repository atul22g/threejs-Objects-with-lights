import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Light
// Ambient Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight("white", 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLightHelper);

// Point Light
const pointLight = new THREE.PointLight("white", 0.5);
pointLight.position.set(1, -1, 1);
scene.add(pointLight);

// Point Light Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

// Mesh -> Geometry, Material
let geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Renderer
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Lili GUI
const gui = new GUI();

// GeometryFolder
const geometryFolder = gui.addFolder('Geometry');
// Geometry Types
const geometryTypes = ['Box', 'Sphere', 'Cone', 'Cylinder', 'Torus'];
// Geometry Params
const geometryParams = {
    type: 'Box',
    width: 1,
    height: 1,
    depth: 1,
    radius: 0.5,
    radialSegments: 32,
    heightSegments: 16,
    tubeRadius: 0.2,
};
function updateGeometry() {
    scene.remove(cube);
    switch (geometryParams.type) {
        case 'Box':
            geometry = new THREE.BoxGeometry(
                geometryParams.width,
                geometryParams.height,
                geometryParams.depth,
                geometryParams.heightSegments
            );
            break;
        case 'Sphere':
            geometry = new THREE.SphereGeometry(
                geometryParams.radius,
                geometryParams.radialSegments,
                geometryParams.heightSegments
            );
            break;
        case 'Cone':
            geometry = new THREE.ConeGeometry(
                geometryParams.radius,
                geometryParams.height,
                geometryParams.radialSegments
            );
            break;
        case 'Cylinder':
            geometry = new THREE.CylinderGeometry(
                geometryParams.radius,
                geometryParams.radius,
                geometryParams.height,
                geometryParams.radialSegments
            );
            break;
        case 'Torus':
            geometry = new THREE.TorusGeometry(
                geometryParams.radius,
                geometryParams.tubeRadius,
                geometryParams.radialSegments,
                geometryParams.heightSegments
            );
            break;
    }
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    let objectType = geometryParams.type;
    localStorage.setItem('objectType', objectType);
}

// GeometryFolder Add geometryParams
geometryFolder.add(geometryParams, 'type', geometryTypes).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'width', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'height', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'depth', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'radius', 0.1, 10).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'radialSegments', 3, 64, 1).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'heightSegments', 3, 64, 1).onChange(updateGeometry);
geometryFolder.add(geometryParams, 'tubeRadius', 0.01, 1).onChange(updateGeometry);
geometryFolder.close();

// Material settings
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'wireframe');
materialFolder.add(material, 'roughness', 0, 1, 0.01);
materialFolder.add(material, 'metalness', 0, 1, 0.01);
materialFolder.add(material, 'opacity', 0, 1, 0.01);
materialFolder.add(material, 'transparent');
materialFolder.close();

// Mesh settings
const meshFolder = gui.addFolder('Mesh');
meshFolder.add(cube.position, 'x', -10, 10, 5).name('x position');
meshFolder.add(cube.position, 'y', -10, 10, 0.1).name('y position');
meshFolder.add(cube.position, 'z', -10, 10, 0.1).name('z position');
meshFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01).name('x rotation');
meshFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01).name('y rotation');
meshFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01).name('z rotation');
meshFolder.add(cube.scale, 'x', 0.1, 5, 0.1).name('x scale');
meshFolder.add(cube.scale, 'y', 0.1, 5, 0.1).name('y scale');
meshFolder.add(cube.scale, 'z', 0.1, 5, 0.1).name('z scale');
meshFolder.close();

// Light settings
const lightFolder = gui.addFolder('Lights');

// Ambient Light
const ambientLightFolder = lightFolder.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.01);
ambientLightFolder.close();

// Directional Light
const directionalLightFolder = lightFolder.addFolder('Directional Light');
directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.01);
directionalLightFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('x position');
directionalLightFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('y position');
directionalLightFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('z position');
directionalLightFolder.close();

// Point Light
const pointLightFolder = lightFolder.addFolder('Point Light');
pointLightFolder.add(pointLight, 'intensity', 0, 1, 0.01);
pointLightFolder.add(pointLight.position, 'x', -10, 10, 0.1).name('x position');
pointLightFolder.add(pointLight.position, 'y', -10, 10, 0.1).name('y position');
pointLightFolder.add(pointLight.position, 'z', -10, 10, 0.1).name('z position');
pointLightFolder.close();

// Light Helpers settings
const lightHelpersFolder = lightFolder.addFolder('Light Helpers');

// Directional Light Helper
const directionalLightHelperFolder = lightHelpersFolder.addFolder('Directional Light Helper');
directionalLightHelperFolder.add(directionalLightHelper, 'visible').name('Visible');
directionalLightHelperFolder.close();

// Point Light Helper
const pointLightHelperFolder = lightHelpersFolder.addFolder('Point Light Helper');
pointLightHelperFolder.add(pointLightHelper, 'visible').name('Visible');
pointLightHelperFolder.close();

lightHelpersFolder.close();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

// Animation
function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
animate();