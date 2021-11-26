//import * as THREE from "/js/three.module.js"


import { LineBasicMaterial } from "./js/three.module.js";
import { Mesh } from "./js/three.module.js";
import * as THREE from "/js/three.module.js"


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

scene.add(nodeMesh);

var heldObj;


const points = [];
 points.push(new THREE.Vector3(nodeMesh.position.x, 0, nodeMesh.position.z));
points.push(new THREE.Vector3(testPos.x, testPos.y, mouse.z));


const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(lineGeo, clickedMat);

scene.add(line);



function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();

function onDocumentMouseMove(event) {
    event.preventDefault();

    // Getting screen space mouse coordinates in device coordinates.
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log("aaa");
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    // Getting the mouse location in input device coordinates.
    vec.set(
    ( event.clientX / window.innerWidth ) * 2 - 1,
     -( event.clientY / window.innerHeight ) * 2 + 1,
    0);

    // After making them normalised device coordniates, we get them back to world space coordinates on z-level 0.
    vec.unproject( camera );

    // Moving the vector to the camera's position.
    vec.sub( camera.position ).normalize();

    // Unsure of what this does.
    var distance = (nodeMesh.position.z - camera.position.z) / vec.z;
    
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    testPos = pos;
    
    
    if(CheckOverlap(nodeMesh)){
        nodeMesh.material = clickedMat;
    }
    else
    {
        nodeMesh.material = nodeMat;
    }

    if(heldObj)
    {
      
        heldObj.translateX(pos.x - heldObj.getWorldPosition(heldObj.position).x);
        heldObj.translateY(pos.y - heldObj.getWorldPosition(heldObj.position).y);
        //heldObj.object.position.x = pos.x;
        //heldObj.object.position.y = pos.y;
        nodeMesh.updateMatrix();
        //testObj.position.z = mouse.z;
        
    }

    var temp = new THREE.Vector3(mouse.x, mouse.y, mouse.z);
    var circleToMouse = temp.sub(nodeMesh.position);
    var mag = circleToMouse.x * circleToMouse.x + circleToMouse.y * circleToMouse.y;
    mag = Math.sqrt(mag);
    //console.log(mag);

    
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
        //if(hit.id == hits[0].object.id)
        //{
            return true;
        //}
        //else{
          //  return false;

       // }
    }
    else
    {
        return false;
    }
}

function onMouseDown(event){
    //console.log("mouse position: " + testPos.x + ", " + testPos.y, "," + testPos.z);
    //console.log("object position: " + nodeMesh.position.x, ", " + nodeMesh.position.y + "," + nodeMesh.position.z);
    //console.log(mouse.distanceTo(new THREE.Vector2(nodeMesh.position.x, nodeMesh.position.y)));

        var ray = new THREE.Raycaster();

        //var mouseWorld = mouse.unproject(camera);
        //mouseWorld.z = 0;
        ray.setFromCamera(mouse, camera);
        console.log("mouse x: " + mouse.x + "mouse y: " + mouse.y);
        //const hits = nodeMesh.raycast(ray);
        const intersectedObjects = ray.intersectObjects(scene.children);
        if(heldObj)
            {
                heldObj = null;
                console.log("Dropped object.");

            }
        else if(intersectedObjects.length > 0)
        {
            if(heldObj)
            {
                heldObj = null;
                console.log("Dropped object.");

            }
            else
            {
                for(var i = 0; i < intersectedObjects.length; i++)
                {
                    if(intersectedObjects[i].object.id == nodeMesh.id)
                    {
                        heldObj = nodeMesh;
                        console.log("Picked up object.");
                    }
                }
                
            }

        } 
        
}
