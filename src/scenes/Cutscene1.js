export class Cutscene1 extends Phaser.Scene {
  constructor() {
    super('Cutscene1');
  }

  preload() {
    // Carrega as imagens da cutscene
    this.load.image('scene1', 'assets/cutscenes/Cena1.png');
    this.load.image('scene2', 'assets/cutscenes/Cena2.png');
    this.load.image('scene3', 'assets/cutscenes/Cena3.png');
    this.load.image('scene4', 'assets/cutscenes/Cena4.png');
    this.load.image('scene5', 'assets/cutscenes/Cena5.png');
  }

  create() {
    this.etapas = [
      {
        imagem: 'scene1',
        texto: 'Era uma vez, Deus sabe lá o que...'
      },
      {
        imagem: 'scene2',
        texto: 'Labaxurias Decantas'
      },
      {
        imagem: 'scene3',
        texto: 'Pipipi popopo'
      },

       {
        imagem: 'scene4',
        texto: 'Pipipi popopo'
      },

       {
        imagem: 'scene5',
        texto: 'Pipipi popopo'
      }
    ];

    this.etapaAtual = 0;

    // Adiciona o sprite e texto da primeira etapa
    this.imagem = this.add.image(400, 300, this.etapas[0].imagem).setOrigin(0.5);

    this.texto = this.add.text(400, 550, this.etapas[0].texto, {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 700 },
      align: 'center'
    }).setOrigin(0.5);

    this.instrucao = this.add.text(400, 580, 'Pressione ESPAÇO para continuar', {
      fontSize: '16px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.etapaAtual++;

      if (this.etapaAtual < this.etapas.length) {
        // Atualiza imagem e texto
        const proxima = this.etapas[this.etapaAtual];
        this.imagem.setTexture(proxima.imagem);
        this.texto.setText(proxima.texto);
      } else {
        // Final da cutscene → vai para a próxima cena
        this.scene.start('Fase1'); // Ou qualquer cena desejada
      }
    }
  }
}
