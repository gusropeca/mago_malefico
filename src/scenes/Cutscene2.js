export class Cutscene2 extends Phaser.Scene {
  constructor() {
    super('Cutscene2');
  }

  preload() {
    this.load.image('cutsceneBg', 'assets/Cutscenes/EntradaCastelo.png'); // sua imagem de cena
  }

  create() {
    // Mostra a imagem da cutscene
    this.add.image(400, 300, 'cutsceneBg').setOrigin(0.5);

    // Texto da legenda
    this.legenda = this.add.text(400, 550, 'Há muito tempo, na floresta perdida...', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 700, useAdvancedWrap: true },
      align: 'center'
    }).setOrigin(0.5);

    // Texto de instrução
    this.add.text(400, 580, 'Pressione ESPAÇO para continuar', {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Aguarda tecla para prosseguir
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Alternativamente: avance após alguns segundos
    // this.time.delayedCall(5000, () => {
    //   this.scene.start('Fase1');
    // });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('Cutscene3');
    }
  }
}
