import * as THREE from 'three'
import Experience from '../Experience'
import { gsap } from 'gsap'

import LoadingVertexShader from '../Shaders/Loading/vertex.glsl'
import LoadingFragmentShader from '../Shaders/Loading/fragment.glsl'


export default class LoadingBar
{
    constructor()
    {        
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.loader = this.experience.resources.loader;
        
        this.setup();
        this.animate();
    }

    setup()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        this.overlayMaterial = new THREE.ShaderMaterial({
            // wireframe: true,
            uniforms:
            {
                uAlpha: {value: 1}  
            },
            vertexShader: LoadingVertexShader,
            fragmentShader: LoadingFragmentShader,
            transparent: true
            
        })
        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlay.name = ('load');
        this.scene.add(this.overlay);
        
    }

    animate()
    {

        this.loadingElement = document.querySelector('.loading-bar');

        this.loader.on('end', () =>
        {
            gsap.delayedCall(0.5, () =>
            {
                gsap.to(this.overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0});
                this.loadingElement.classList.add('ended');
                this.loadingElement.style.transform = '';
            })
            window.setTimeout(() =>
            {
                this.scene.remove(this.scene.getObjectByName(this.overlay.name));
                
                this.overlayGeometry.dispose();
                this.overlayMaterial.dispose();
            }, 500)

        });

        this.loader.on('fileEnd', () =>
        {
            
            const progessRatio = this.loader.loaded / this.loader.toLoad;
            this.loadingElement.style.transform = `scaleX(${progessRatio})`;

        })
        

        
    }
}