export class TelaMorte extends Phaser.Scene {
  constructor() {
    super('TelaMorte');
  }

  preload() {
    this.load.image('magoMorto', 'assets/Death_Screen.png');
    this.load.image('tenteNovamente', 'assets/Tente_Novamente.png');
    this.load.image('voceMorreu', 'assets/Voce_Morto.png');
  }

  create() {
    this.background = this.add.tileSprite(640, 360, 1280, 720, 'magoMorto');
    this.add.image(400, 125, 'voceMorreu').setScale(0.3).setOrigin(0.5);
    this.spacePrompt = this.add.image(400, 550, 'tenteNovamente').setScale(0.2).setOrigin(0.5);

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
            this.scene.start('Fase1'); 
        }

    }
  
}
