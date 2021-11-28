import * as THREE from "./js/three.module.js";
import { Mesh } from "./js/three.module.js";


export class Handle
{
    
    constructor(radius, xPos, yPos, scene, material, clickedMaterial)
    {
        this.geometry = new THREE.CircleGeometry(radius, 50);
        this.mesh = new THREE.Mesh(this.geometry, material);

        this.m_Material = material;
        this.m_ClickedMaterial = clickedMaterial;

        this.mesh.position.x = xPos;
        this.mesh.position.y = yPos;
        this.mesh.position.z = 0;

        scene.add(this.mesh);
        const m_Scene = scene;
        this.m_IsHovering = false;
        

        
    }

     CheckOverlap(event, mouse, camera, scene)
        {
            var ray = new THREE.Raycaster();
            ray.setFromCamera(mouse, camera);
            
        
            const hits = ray.intersectObjects(scene.children);
            if(hits.length > 0)
            {
                // We check if the passed in object was one of the hits.
                for(var i = 0; i < hits.length; i++)
                {
                    if(this.mesh.id == hits[i].object.id)
                    {
                        this.m_IsHovering = true;
                        return true;
                    }
                    
                }
                
                this.m_IsHovering = false;
                return false;
                    
                
            }
            else
            {
                this.m_IsHovering = false;
                return false;
            }

        }

        Update(event, mouse, camera, scene)
        {
            if(this.CheckOverlap(event, mouse, camera, scene))
            {

                this.mesh.material = this.m_ClickedMaterial;
                //console.log("You are hovering over a handle.");

            }
            else
            {
                this.mesh.material = this.m_Material;

            }

        }

 

    

}