import * as THREE from 'three'
import GUI from 'lil-gui'

import Experience from '../Experience.js'

import PortalVertexShader from '../Shaders/Portal/vertex.glsl'
import PortalFragmentShader from '../Shaders/Portal/fragment.glsl'





export default class Grotte
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        //Debug
        this.debug = this.experience.debug;
        this.setDebug();

        //Setup
        this.Setup();

        //Model
        this.setModel();

        //Material
        this.setMaterials();
        
    }

    setDebug()
    {
        
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder(this.constructor.name);
            this.debugFolder.close();
            this.debugObject = 
            {
                portalColorStart: '#00fffb',
                portalColorEnd: '#f7efe8',
            }

        }
        
    }

    Setup()
    {
        this.resource = {};
        this.resource.model = this.resources.items.grotteModel;

        this.resource.texture = {};
        this.resource.texture.grotte = this.resources.items.grotteBaseColorBaked;
        this.resource.texture.grotte.flipY = false;
        this.resource.texture.grotte.encoding = THREE.sRGBEncoding;

        this.resource.texture.leafs = this.resources.items.leafsBaseColorBaked; 
        this.resource.texture.leafs.flipY = false;
        this.resource.texture.leafs.encoding = THREE.sRGBEncoding;

        this.resource.texture.trunk = this.resources.items.trunkBaseColorBaked; 
        this.resource.texture.trunk.flipY = false;
        this.resource.texture.trunk.encoding = THREE.sRGBEncoding;

        this.resource.texture.trunkHalf = this.resources.items.trunkHalfBaseColorBaked; 
        this.resource.texture.trunkHalf.flipY = false;
        this.resource.texture.trunkHalf.encoding = THREE.sRGBEncoding;
    }
    

    setModel()
    {

        this.model = this.resource.model.scene;
        
        this.scene.add(this.model);

    
    }

    setMaterials()
    {
        this.materials = {};

        this.materials.grotteBakedMaterial = new THREE.MeshBasicMaterial({
            map: this.resource.texture.grotte
        });


        this.materials.leafsBakedMaterial = new THREE.MeshBasicMaterial({
            map: this.resource.texture.leafs

        });

        this.materials.trunkHalfMaterial = new THREE.MeshBasicMaterial({
            map: this.resource.texture.trunkHalf
        });
        this.materials.trunkMaterial = new THREE.MeshBasicMaterial({
            map: this.resource.texture.trunk
        });

        this.materials.PortalLightMaterial = new THREE.ShaderMaterial({
            uniforms: 
            {
                uTime: {value: 0.0},
                uColorStart: { value: new THREE.Color('#00fffb')},
                uColorEnd: { value: new THREE.Color('#f7efe8')}
            },
            vertexShader: PortalVertexShader,
            fragmentShader: PortalFragmentShader
        })

        this.materials.PoleLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF8E36,
            // transparent: true,
            // blending: THREE.AdditiveBlending,
            // opacity: 0.9
        })

        const grottebaked = this.model.children.filter((child) => child.name.includes('Grotte'));
        
        grottebaked[0].material = this.materials.grotteBakedMaterial;
        grottebaked[1].material = this.materials.grotteBakedMaterial;

        const leafsBaked = this.model.children.filter((child) => child.name.includes('Grass'))
        
        leafsBaked.forEach(element => element.material = this.materials.leafsBakedMaterial);
        
        const trunkHalfMeshs = this.model.children.filter((child) => child.name.includes('TrunckHalf'))
        for(let child of trunkHalfMeshs) child.material =  this.materials.trunkHalfMaterial;

        const trunkMesh = this.model.children.find((child => child.name.includes('TrunkLong')))
        trunkMesh.material = this.materials.trunkMaterial;

        const PoleLight = this.model.children.filter((child) => child.name.includes('Light'))

        PoleLight[0].material = this.materials.PoleLightMaterial; 
        PoleLight[1].material = this.materials.PoleLightMaterial; 

        const PortalLight = this.model.children.find((child) => child.name.includes('Portal'))
        PortalLight.material = this.materials.PortalLightMaterial;

        /**
         * Debug
         */

        if(this.debug)
        {
            this.debugFolder
                .addColor(this.debugObject, 'portalColorStart')
                .onFinishChange(() => this.materials.PortalLightMaterial.uniforms.uColorStart.value = new THREE.Color(this.debugObject.portalColorStart));
                this.debugFolder
                .addColor(this.debugObject, 'portalColorEnd')
                .onFinishChange(() => this.materials.PortalLightMaterial.uniforms.uColorEnd.value = new THREE.Color(this.debugObject.portalColorEnd))    
        }
              
    }

    update()
    {
        this.materials.PortalLightMaterial.uniforms.uTime.value = this.time.elapsed * 0.002;
    }

    

}