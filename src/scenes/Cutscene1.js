export class Cutscene1 extends Phaser.Scene {
  constructor() {
    super('Cutscene1');
  }

  preload() {
    this.load.image('scene0', 'assets/CasteloDoMago.jpg')
    this.load.image('scene1', 'assets/cutscenes/Cena1.png');
    this.load.image('scene2', 'assets/cutscenes/Cena2.png');
    this.load.image('scene3', 'assets/cutscenes/Cena3.png');
    this.load.image('scene4', 'assets/cutscenes/Cena4.png');
    this.load.image('scene5', 'assets/cutscenes/Cena5.png');
    this.load.image('scene6', 'assets/cutscenes/Cena6.png');
  }

  create() {
    this.etapas = [
      {
        imagem: 'scene0',
        texto: 'Era uma vez, um poderoso mago que vivia em seu castelo, numa terra desolada e há muito tempo esquecida por todos...'
      },
        {
        imagem: 'scene1',
        texto: 'O mago, entediado e infeliz com sua situação, buscou orientações em seus tomos e grimórios na busca de se livrar do vazio que o preenchia.'
      },
      {
        imagem: 'scene2',
        texto: 'Um livro em especial chamou-lhe a atenção. Nele estava escrito que um "Felizes para Sempre" só poderia ser alcançado ao se casar com uma princesa. '
      },
      {
        imagem: 'scene3',
        texto: 'Assim, o mago dirigiu-se à sua varanda e utilizou seu mágico telescópio para averiguar os horizontes que circundavam seu castelo.'
      },

       {
        imagem: 'scene4',
        texto: 'Depois de algum tempo procurando, encontrou um castelo radiante e cheio de vida entre as montanhas. '
      },

       {
        imagem: 'scene5',
        texto: 'Ao ajustar a lente para enxergar com maior precisão, encontrou um grupo de belas damas com roupas de alta costura e chapéus pontiagudos desfrutando um farto e luxuoso piquenique.'
      },
       {
        imagem: 'scene6',
        texto: 'O Mago, então,chegou a única conclusão possível: que todas seriam princesas e bolou um plano MALÉFICO que mudaria sua vida e das princesas para sempre.'
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
          this.scene.start('FaseTutorial');
        });
      }
    });
    }
  }
}
