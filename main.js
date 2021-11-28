//import * as THREE from "/js/three.module.js"


import { LineBasicMaterial } from "./js/three.module.js";
import { Mesh } from "./js/three.module.js";
import * as THREE from "/js/three.module.js"

import {Handle} from "./handle.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var mouse = new THREE.Vector3();

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);

 camera.position.z = 20;

 var testPos = new THREE.Vector3(0, 0, 0);

var nodeMat = new THREE.LineBasicMaterial({color: 0xFFFFFF});
var clickedMat = new LineBasicMaterial({color: 0x00FF00});

var nodeGeo = new THREE.CircleGeometry(5, 50);
var nodeMesh = new Mesh(nodeGeo, nodeMat);
nodeMesh.position.x = 2;
nodeMesh.position.z = 0;
nodeMesh.updateMatrix();


var heldObj;


const points = [];
 points.push(new THREE.Vector3(nodeMesh.position.x, 0, /*nodeMesh.position.z*/ 0));
points.push(new THREE.Vector3(testPos.x, testPos.y, /*mouse.z*/ 0));


const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeo, clickedMat);

scene.add(line);

const handleArray = [new Handle(0.5, 0, 0, scene, nodeMat, clickedMat), new Handle(0.5, 5, 0, scene, nodeMat, clickedMat), new Handle(0.5, -1, -3, scene, nodeMat, clickedMat)];
// var handle1 = new Handle(0.5, 0, 0, scene, nodeMat, clickedMat)
// var handle2 = new Handle(0.5, 5, 0, scene, nodeMat, clickedMat);
// var handle3 = new Handle(0.5, -1, -3, scene, nodeMat, clickedMat);


function update(event)
{   
    requestAnimationFrame( update );

    for(var i = 0; i < handleArray.length; i++)
    {
        handleArray[i].Update(event, mouse, camera, scene);

    }
    // handle1.Update(event, mouse, camera, scene);
    // handle2.Update(event, mouse, camera, scene);
    // handle3.Update(event, mouse, camera, scene);
}
update();

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

    
}
animate();

function onDocumentMouseMove(event) {
    event.preventDefault();

    // Getting screen space mouse coordinates in device coordinates.
    mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
    
    // handle1.Update(event, mouse, camera, scene);
    // handle2.Update(event, mouse, camera, scene);
    // handle3.Update(event, mouse, camera, scene);

    

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    // Getting the mouse location in input device coordinates.
    vec.set(
    ( event.offsetX / window.innerWidth ) * 2 - 1,
     -( event.offsetY / window.innerHeight ) * 2 + 1,
    0);

    // After making them normalised device coordniates, we get them back to world space coordinates on z-level 0.
    vec.unproject( camera );

    // Moving the vector to the camera's position.
    vec.sub( camera.position ).normalize();

    // Unsure of what this does.
    var distance = (nodeMesh.position.z - camera.position.z) / vec.z;
    
    //var distance = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    //distance = Math.sqrt(distance.x * distance.x + distance.y * distance.y);

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    testPos = pos;
    
    if(CheckOverlap(nodeMesh) == true){
        nodeMesh.material = clickedMat;

    }
    else
    {
        nodeMesh.material = nodeMat;

    }

    if(heldObj)
    {
      
        heldObj.mesh.translateX(pos.x - heldObj.mesh.getWorldPosition(heldObj.mesh.position).x);
        heldObj.mesh.translateY(pos.y - heldObj.mesh.getWorldPosition(heldObj.mesh.position).y);
        //heldObj.object.position.x = pos.x;
        //heldObj.object.position.y = pos.y;
        //nodeMesh.updateMatrix();
        //testObj.position.z = mouse.z;
        
    }

    var temp = new THREE.Vector3(mouse.x, mouse.y, mouse.z);
    var circleToMouse = temp.sub(nodeMesh.position);
    var mag = circleToMouse.x * circleToMouse.x + circleToMouse.y * circleToMouse.y;
    mag = Math.sqrt(mag);
    //console.log(mag);

    //var unprojectedMouse = mouse.unproject(camera);
    points[1].x = testPos.x;
    points[1].y = testPos.y;

    //const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    

}

function CheckOverlap(hit){
    var ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    

    const hits = ray.intersectObjects(scene.children);
    if(hits.length > 0)
    {
        // We check if the passed in object was one of the hits.
        for(var i = 0; i < hits.length; i++)
        {
            if(hit.id == hits[i].object.id)
            {
                return true;
            }
        }
        return false;
    }
    else
    {
        return false;
    }
}

function onMouseDown(event)
{

    if(heldObj) // If we are already holding a handle, drop it if we click again.
    {
        heldObj = null;

    }
    else
    {
        for(var i = 0; i < handleArray.length; i++)
        {
            if(handleArray[i].m_IsHovering)
            {
                console.log("You clicked on a handle!");
                heldObj = handleArray[i];
    
            }
    
        }
    }
}
