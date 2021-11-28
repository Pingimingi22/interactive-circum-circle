//import * as THREE from "/js/three.module.js"


import { LineBasicMaterial } from "./js/three.module.js";
import { Mesh } from "./js/three.module.js";
import * as THREE from "./js/three.module.js"

import {Handle} from "./handle.js";

// ------------ Setting up camera and scene ------------ //

THREE.WebGLRenderer.alpha = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 500 / 400, 0.1, 1000 );

var canvRef = document.getElementById("my_canvas")
const renderer = new THREE.WebGLRenderer({canvas: canvRef});
renderer.setSize( 500, 400);

var container = document.getElementsByClassName("content");
//container[0].appendChild( renderer.domElement );
container[0].insertBefore(renderer.domElement, document.getElementsByClassName("content").item(0).lastElementChild);

var mouse = new THREE.Vector3();

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);

camera.position.z = 20;

var testPos = new THREE.Vector3(0, 0, 0);

// ----------------------------------------------------- //

var centreMat = new THREE.LineBasicMaterial({color: 0xFF0000});
var nodeMat = new THREE.LineBasicMaterial({color: 0xFFFFFF});
var clickedMat = new LineBasicMaterial({color: 0x00FF00});

// ---- Actual circum circle stuff ---- //
var radius = 5;
var segments = 50;
var circleMat = new THREE.LineBasicMaterial({color: 0x0000ff});
var circleGeometry = new THREE.CircleGeometry(radius, segments);
//circleGeometry.vertices.shift();

let pts = new THREE.Path().absarc(0, 0, 2, 0, Math.PI * 2).getPoints(64);
const testGeo = new THREE.BufferGeometry().setFromPoints(pts);

var circleLine = new THREE.Line(testGeo, circleMat)

scene.add(circleLine);

// ------------------------------------ //


var heldObj;

const handleArray = [new Handle(0.5, 0, 0, scene, nodeMat, clickedMat), new Handle(0.5, 5, 0, scene, nodeMat, clickedMat), new Handle(0.5, -1, -3, scene, nodeMat, clickedMat)];

var testHandle1 = new Handle(0.1, 0, 0, scene, nodeMat, clickedMat);
var testHandle2 = new Handle(0.1, 0, 0, scene, nodeMat, clickedMat);

var normal1Handle = new Handle(0.1, 0, 0, scene, nodeMat, clickedMat);
var normal2Handle = new Handle(0.1, 0, 0, scene, nodeMat, clickedMat);

var centreHandle = new Handle(0.1, 0, 0, scene, centreMat, clickedMat);

// ------------- Debug Line Stuff ------------- //
const line1Points = [];
line1Points.push(new THREE.Vector3(handleArray[0].mesh.position.x, handleArray[0].mesh.position.y, 0));
line1Points.push(new THREE.Vector3(handleArray[1].mesh.position.x, handleArray[1].mesh.position.y, 0));
const line1Geo = new THREE.BufferGeometry().setFromPoints(line1Points);
const line1 = new THREE.Line(line1Geo, clickedMat);

const line2Points = [];
line2Points.push(new THREE.Vector3(handleArray[1].mesh.position.x, handleArray[1].mesh.position.y, 0));
line2Points.push(new THREE.Vector3(handleArray[2].mesh.position.x, handleArray[2].mesh.position.y, 0));
const line2Geo = new THREE.BufferGeometry().setFromPoints(line2Points);
const line2 = new THREE.Line(line2Geo, clickedMat);

scene.add(line1);
scene.add(line2);
// -------------------------------------------- //


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

    var centrePoint1X = handleArray[0].mesh.position.x + handleArray[1].mesh.position.x;
    var centrePoint1Y = handleArray[0].mesh.position.y + handleArray[1].mesh.position.y; 

    var testVec = new THREE.Vector3(centrePoint1X, centrePoint1Y, 0);

    var centrePoint2X = handleArray[1].mesh.position.x + handleArray[2].mesh.position.x;
    var centrePoint2Y = handleArray[1].mesh.position.y + handleArray[2].mesh.position.y; 

    var testVec2 = new THREE.Vector3(centrePoint2X, centrePoint2Y, 0);


    testHandle1.mesh.position.x = testVec.x * 0.5;
    testHandle1.mesh.position.y = testVec.y * 0.5;

    testHandle2.mesh.position.x = testVec2.x * 0.5;
    testHandle2.mesh.position.y = testVec2.y * 0.5;


    

    var normal1X = handleArray[1].mesh.position.x - handleArray[0].mesh.position.x;
    var normal1Y = handleArray[1].mesh.position.y - handleArray[0].mesh.position.y;
    var normal1Mag = Math.sqrt(normal1X * normal1X + normal1Y * normal1Y);

    normal1X /= normal1Mag;
    normal1Y /= normal1Mag;

    normal1Handle.mesh.position.x = testHandle1.mesh.position.x + (normal1Y);
    normal1Handle.mesh.position.y = testHandle1.mesh.position.y + -(normal1X);


    var normal2X = handleArray[2].mesh.position.x - handleArray[1].mesh.position.x;
    var normal2Y = handleArray[2].mesh.position.y - handleArray[1].mesh.position.y;
    var normal2Mag = Math.sqrt(normal2X * normal2X + normal2Y * normal2Y);

    normal2X /= normal2Mag;
    normal2Y /= normal2Mag;

    normal2Handle.mesh.position.x = testHandle2.mesh.position.x + (normal2Y);
    normal2Handle.mesh.position.y = testHandle2.mesh.position.y + -(normal2X);


    var t2 = normal1Y * (testHandle2.mesh.position.y - testHandle1.mesh.position.y) - -normal1X * (testHandle2.mesh.position.x - testHandle1.mesh.position.x);
    t2 /= -normal1X * normal2Y - normal1Y * -normal2X;

    centreHandle.mesh.position.x = testHandle2.mesh.position.x + (normal2Y * t2);
    centreHandle.mesh.position.y = testHandle2.mesh.position.y + (-normal2X * t2);


    var handle0ToCentreX = centreHandle.mesh.position.x - handleArray[0].mesh.position.x;
    var handle0ToCentreY = centreHandle.mesh.position.y - handleArray[0].mesh.position.y;

    var handle0ToCentreMag = Math.sqrt(handle0ToCentreX * handle0ToCentreX + handle0ToCentreY * handle0ToCentreY);
    var radius = handle0ToCentreMag;


    // updating circle radius:
    const newPts = new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2).getPoints(64);
    let newTestGeo = new THREE.BufferGeometry().setFromPoints(newPts);

    circleLine.geometry = newTestGeo;
    circleLine.position.x = centreHandle.mesh.position.x;
    circleLine.position.y = centreHandle.mesh.position.y;


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
    mouse.x = (event.offsetX / 500) * 2 - 1;
    mouse.y = -(event.offsetY / 400) * 2 + 1;
    
    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    // Getting the mouse location in input device coordinates.
    vec.set(
    ( event.offsetX / 500 ) * 2 - 1,
     -( event.offsetY / 400 ) * 2 + 1,
    0);

    // After making them normalised device coordniates, we get them back to world space coordinates on z-level 0.
    vec.unproject( camera );

    // Moving the vector to the camera's position.
    vec.sub( camera.position ).normalize();

    
    var distance = 0;
    if(heldObj)
        distance = (heldObj.mesh.position.z - camera.position.z) / vec.z;
    
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    //testPos = pos;
    
    if(heldObj)
    { 
        heldObj.mesh.translateX(pos.x - heldObj.mesh.getWorldPosition(heldObj.mesh.position).x);
        heldObj.mesh.translateY(pos.y - heldObj.mesh.getWorldPosition(heldObj.mesh.position).y);   
    }

    // Old debugging line.

    //var temp = new THREE.Vector3(mouse.x, mouse.y, mouse.z);
    //var circleToMouse = temp.sub(nodeMesh.position);
    //var mag = circleToMouse.x * circleToMouse.x + circleToMouse.y * circleToMouse.y;
    //mag = Math.sqrt(mag);

    //points[1].x = testPos.x;
    //points[1].y = testPos.y;

    //const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    //line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    

    // ----------------- Updating debug lines if player moves the handles ----------------- //
    line1Points[0].x = handleArray[0].mesh.position.x;
    line1Points[0].y = handleArray[0].mesh.position.y;
    line1Points[1].x = handleArray[1].mesh.position.x;
    line1Points[1].y = handleArray[1].mesh.position.y;

    line2Points[0].x = handleArray[1].mesh.position.x;
    line2Points[0].y = handleArray[1].mesh.position.y;
    line2Points[1].x = handleArray[2].mesh.position.x;
    line2Points[1].y = handleArray[2].mesh.position.y;


    const line1Geo = new THREE.BufferGeometry().setFromPoints(line1Points);
    line1.geometry = line1Geo;
    
    const line2Geo = new THREE.BufferGeometry().setFromPoints(line2Points);
    line2.geometry = line2Geo;

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
