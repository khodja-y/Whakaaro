import * as THREE from 'three'

import FirefliesVertexShader from '../Shaders/Fireflies/vertex.glsl'
import FirefliesFragmentShader from '../Shaders/Fireflies/fragment.glsl'
import Experience from '../Experience'


export default class Fireflies
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;


        //Debug
        this.debug = this.experience.debug;
        this.setDebug();

        //Setup
        this.setup();

        //Materials
        this.setMaterial();

        //Particles
        this.setParticles();


        
    }

    setDebug()
    {
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder(this.constructor.name);
            this.debugFolder.close();
        }
    }

    setup()
    {
        this.particles = {};

        this.particles.firefliesGeometry = new THREE.BufferGeometry();
        this.particles.firefliesCount = 30;
        this.particles.firefliesVertex = new Float32Array(this.particles.firefliesCount * 3);
        this.particles.firefliesScale = new Float32Array(this.particles.firefliesCount);

        for (let i = 0; i < this.particles.firefliesCount; i++) {
            this.particles.firefliesVertex[i * 3 + 1] = Math.random() * 2
            this.particles.firefliesVertex[i * 3 + 2] = (Math.random() - 0.5) * 4   
            this.particles.firefliesVertex[i * 3 + 0] = (Math.random() - 0.5) * 4
        
        
            //Scale Array
            this.particles.firefliesScale[i] = (Math.random() + 0.5) * 2.0;
        }
        
        
        this.particles.firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.particles.firefliesVertex, 3));
        this.particles.firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.particles.firefliesScale, 1));

    }

    setMaterial()
    {
        this.particles.firefliesShader = new THREE.ShaderMaterial({
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: 
            {
                uSize: {value: 50.0},
                uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
                uEmissive: {value: 2.0},
                uTime: {value: 0.0},
                uSpeed: {value: 0.0003}
            },
            vertexShader: FirefliesVertexShader,
            fragmentShader: FirefliesFragmentShader,
            transparent: true
            
        });


        /**
         * Debug
         */
        if(this.debug)
        {
            this.debugFolder
                .add(this.particles.firefliesShader.uniforms.uSize, 'value')
                .min(0.001)
                .max(100.0)
                .step(0.001)
                .name('FireFliesSize')
        
            this.debugFolder
                .add(this.particles.firefliesShader.uniforms.uEmissive, 'value')
                .min(0.001)
                .max(10.0)
                .step(0.001)
                .name('FireFliesEmissive')

            this.debugFolder
                .add(this.particles.firefliesShader.uniforms.uSpeed, 'value')
                .min(0.0001)
                .max(0.1)
                .step(0.0001)
                .name('Speed')
        }
    }

    setParticles()
    {
        this.particles.firefliesParticles = new THREE.Points(
            this.particles.firefliesGeometry,
            this.particles.firefliesShader
        )
        
        this.scene.add(this.particles.firefliesParticles);
    }

    update()
    {
        this.particles.firefliesShader.uniforms.uTime.value = this.time.elapsed;
    }
}