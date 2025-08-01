export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/CasteloDoMago.jpg');
        this.load.image('logo', 'assets/Titulo.png');
        this.load.image('pressSpace', 'assets/PressStart.png');
        this.load.audio('MusicaInicial', 'assets/music/MusicaInicio.mp3');

        
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        const logo = this.add.image(400, 350, 'logo');

          if (!this.sound.get('MusicaInicial')?.isPlaying) {
            this.sound.add('MusicaInicial', { loop: true, volume: 0.5 }).play();
        }


        this.tweens.add({
            targets: logo,
            y: 300,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

        this.spacePrompt = this.add.image(400, 550, 'pressSpace')
            .setAlpha(0.8)
            .setScale(0.2);

        this.tweens.add({
            targets: this.spacePrompt,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

         this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.background.destroy();
            this.scene.start('SelecaoPrincesas'); 
        }

    }
    
}
