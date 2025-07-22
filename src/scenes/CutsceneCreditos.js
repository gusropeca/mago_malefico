export class CutsceneCreditos extends Phaser.Scene {
  constructor() {
    super('CutsceneCreditos');
    
  }

  preload() {
    this.load.spritesheet('cutsceneCreditos', 'assets/Cutscenes/CutsceneCreditos.png', {
      frameWidth: 800,
      frameHeight: 600
    });


  }

  create() {
    this.anims.create({
      key: 'carrocaAndando',
      frames: this.anims.generateFrameNumbers('cutsceneCreditos', { start: 0, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    this.bg = this.add.sprite(400, 300, 'cutsceneCreditos').play('carrocaAndando');

    this.legenda = this.add.text(400, 200, 'O Mago, enfim, vitorioso, retorna ao seu castelo.', {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'NewTimesRoman',
      wordWrap: { width: 700, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);

    // Instrução
    this.add.text(400, 580, 'Pressione ESPAÇO para voltar ao início', {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'NewTimesRoman'
    }).setOrigin(0.5);

    // Música
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
