export class Cutscene2 extends Phaser.Scene {
  constructor() {
    super('Cutscene2');
  }

  preload() {
    this.load.image('cutsceneBg', 'assets/Cutscenes/EntradaCastelo.png'); 
    this.load.audio('MusicaInicial', 'assets/music/MusicaInicio.mp3')
  }

  create(data) {
    this.add.image(400, 300, 'cutsceneBg').setOrigin(0.5);

    if (!this.sound.get('MusicaInicial')?.isPlaying) {
            this.sound.add('MusicaInicial', { loop: true, volume: 0.5 }).play();
    }

    this.legenda = this.add.text(400, 525, 'O Mago finalmente chega aos portões imponentes do castelo, que foram abertos com a chave.', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'NewTimesRoman',
      wordWrap: { width: 700, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);

    // Texto de instrução
    this.add.text(400, 580, 'Pressione ESPAÇO para continuar', {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'NewTimesRoman'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.sound.stopByKey('MusicaInicial');
      this.scene.start('Fase2');
    }
  }
}
