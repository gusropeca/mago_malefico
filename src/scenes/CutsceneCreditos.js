export class CutsceneCreditos extends Phaser.Scene {
  constructor() {
    super('CutsceneCreditos');
  }

  preload() {
    this.load.spritesheet('FinalAzul', 'assets/Cutscenes/Finais/FinalAzul.png', {
      frameWidth: 800,
      frameHeight: 600
    });
    this.load.spritesheet('FinalLaranja', 'assets/Cutscenes/Finais/FinalLaranja.png', {
      frameWidth: 800,
      frameHeight: 600
    });
    this.load.spritesheet('FinalVerde', 'assets/Cutscenes/Finais/FinalVerde.png', {
      frameWidth: 800,
      frameHeight: 600
    });
    this.load.spritesheet('FinalVermelho', 'assets/Cutscenes/Finais/FinalVermelho.png', {
      frameWidth: 800,
      frameHeight: 600
    });
    this.load.spritesheet('FinalVioleta', 'assets/Cutscenes/Finais/FinalVioleta.png', {
      frameWidth: 800,
      frameHeight: 600
    });
  }

  create() {
    this.princesaEscolhida = this.registry.get('princesaEscolhida') || 'Azul';

    const spritesheet = `Final${this.princesaEscolhida}`;

    this.anims.create({
      key: `cutscene_${this.princesaEscolhida}`,
      frames: this.anims.generateFrameNumbers(spritesheet, { start: 0, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    
    this.bg = this.add.sprite(400, 300, spritesheet);
    this.bg.play(`cutscene_${this.princesaEscolhida}`);


    this.add.text(400, 580, 'Pressione ESPAÇO para voltar ao início', {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'NewTimesRoman'
    }).setOrigin(0.5);

    if (!this.sound.get('MusicaInicial')?.isPlaying) {
      this.sound.add('MusicaInicial', { loop: true, volume: 0.5 }).play();
    }

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.sound.stopByKey('MusicaFinal');

      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Start');
      });
    }
  }
}
