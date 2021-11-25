//import * as THREE from "/js/three.module.js"
import { Object3D } from "./js/three";
import * as THREE from "/js/three.module.js"


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );


var mouse = new THREE.Vector2();
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);




// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

 camera.position.z = 20;



var circleGeo = new THREE.CircleGeometry(1, 100);
var circleMat = new THREE.LineBasicMaterial({color: 0x00FFFF});
var nodeMat = new THREE.LineBasicMaterial({color: 0xFFFFFF});
var circleMesh = new THREE.Mesh(circleGeo, circleMat);

var nodeGeo = new THREE.CircleGeometry(0.5, 50);
var nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
nodeMesh.position.x = 2;

console.log(nodeMesh.id);

//scene.add(circleMesh);
scene.add(nodeMesh);

var testObj;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.z = 0;

    
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    vec.set(
    ( event.clientX / window.innerWidth ) * 2 - 1,
    - ( event.clientY / window.innerHeight ) * 2 + 1,
    /*0.5*/0 );

    vec.unproject( camera );

    vec.sub( camera.position ).normalize();

    var distance = (nodeMesh.position.z - camera.position.z) / vec.z;

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    //mouse = pos;

    //nodeMesh.position.x = pos.x;
    //nodeMesh.position.y = pos.y;
    //nodeMesh.position.z = pos.z;

    // nodeMesh.position.x = mouse.x;
    // nodeMesh.position.y = mouse.y;
    // nodeMesh.position.z = mouse.z;
    
    if(testObj)
    {
        testObj.position.x = pos.x;
        testObj.position.y = pos.y;
        //testObj.position.z = mouse.z;
        
    }

}

function onMouseDown(event){
    console.log("mouse position: " + mouse.x + ", " + mouse.y);
    if(mouse.distanceTo(nodeMesh.position) <= 100){
        console.log(mouse.distanceTo(new THREE.Vector2(nodeMesh.position.x, nodeMesh.position.y)));
        console.log(nodeMesh.position);

        var ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, camera);
        //const hits = nodeMesh.raycast(ray);
        const intersectedObjects = ray.intersectObjects(scene.children);
        if(intersectedObjects.length)
        {
            console.log("ID of object is: " + intersectedObjects[0].object.id);
            console.log("You clicked on the objects.");

            if(testObj)
            {
                testObj = null;

            }
            else
            {
                if(intersectedObjects[0].object.id == nodeMesh.id)
                {
                    console.log("You clicked on a node!");
                    testObj = nodeMesh;
                    
                }
            }
            


        }


    }
    console.log(nodeMesh.position);
    

}
