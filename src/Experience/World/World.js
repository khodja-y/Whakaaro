import * as THREE from 'three'
import Experience from '../Experience.js'
import Fireflies from './Fireflies.js';
import Grotte from './Grotte.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience();
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name == 'grotte')
            {
                this.setGrotte();
            }
        })

        this.setFireflies();
        
    }

    setGrotte()
    {
        this.grotte = new Grotte();
    }

    setFireflies()
    {
        this.fireflies = new Fireflies();
    }

    resize()
    {
    }

    update()
    {
        this.fireflies.update();
        if(this.grotte)
        {
            this.grotte.update();
        }
        
    }

    destroy()
    {
    }
}