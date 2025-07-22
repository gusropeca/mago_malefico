export class CutsceneFinal extends Phaser.Scene {
  constructor() {
    super('CutsceneFinal');
  }

  preload() {
    
    this.load.image('scene1', 'assets/Cutscenes/CenaFinal1.png');
    this.load.image('scene2', 'assets/Cutscenes/CenaFinal2.png');
    this.load.image('scene3', 'assets/Cutscenes/CenaFinal3.png');

    this.load.audio('MusicaFinal', 'assets/music/MusicaFinal.mp3');


  }

  create() {

      if (!this.sound.get('MusicaFinal')?.isPlaying) {
            this.sound.add('MusicaFinal', { loop: true, volume: 0.2 }).play();
        }


    this.etapas = [
        {
        imagem: 'scene1',
        texto: 'O mago, depois de muito esforço, finalmente derrotou o Rei.'
      },
      {
        imagem: 'scene2',
        texto: 'Ele mal podia esperar para colocar as mãos em seu glorioso prêmio...'
      },
      {
        imagem: 'scene3',
        texto: 'As princesas, chocadas e perplexas, não tiveram outra opção a não ser se submeter à vontade do Mago Maléfico.'
      }
    ];

    this.etapaAtual = 0;

    // Adiciona o sprite e texto da primeira etapa
    this.imagem = this.add.image(400, 300, this.etapas[0].imagem).setOrigin(0.5);

    this.texto = this.add.text(400, 525, this.etapas[0].texto, {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'NewTimesRoman',
      wordWrap: { width: 700 },
      align: 'center'
    }).setOrigin(0.5);

    this.instrucao = this.add.text(400, 580, 'Pressione ESPAÇO para continuar', {
      fontSize: '16px',
      color: '#aaaaaa',
      fontFamily: 'NewTimesRoman'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  
update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
      this.etapaAtual++;

    if (this.etapaAtual < this.etapas.length) {
      const proxima = this.etapas[this.etapaAtual];
      this.imagem.setTexture(proxima.imagem);
      this.texto.setText(proxima.texto);
      this.cameras.main.fadeIn(500, 0, 0, 0);
      } 
      else {
        this.sound.stopByKey('MusicaInicial');
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('CutsceneCreditos');
        });
      }
    });
    }
  }
}
