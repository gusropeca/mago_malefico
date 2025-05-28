    import { Start } from './scenes/Start.js';
    import { Fase1 } from './scenes/Fase1.js';
    import { Fase1_1 } from './scenes/Fase1_1.js';
    import { Fase1_2 } from './scenes/Fase1_2.js';
    import { Fase2 } from './scenes/Fase2.js';
    import { Fase2_1 } from './scenes/Fase2_1.js';
    import { Fase2_2 } from './scenes/Fase2_2.js';
    import { Fase2_3 } from './scenes/Fase2_3.js';

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 800,   //1280
    height: 600,    //720
    pixelArt: false,
  
    physics:{
        default: 'arcade',
        arcade:{
            gravity: { y: 600 },
            debug: true,
        }
    },
    scene: [
        Start, Fase1, Fase1_1, Fase1_2, Fase2, Fase2_1, Fase2_2, Fase2_3
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            