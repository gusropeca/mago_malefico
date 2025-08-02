export class SelecaoPrincesas extends Phaser.Scene {
  constructor() {
    super('SelecaoPrincesas');
  }

  preload() {
    this.load.image('Fundo','assets/SelecaoPrincesa.png');

    this.load.image('princesaAzul', 'assets/Princesas/PrincesaAzul.png');
    this.load.image('princesaLaranja', 'assets/Princesas/PrincesaLaranja.png');
    this.load.image('princesaVerde', 'assets/Princesas/PrincesaVerde.png');
    this.load.image('princesaVermelho', 'assets/Princesas/PrincesaVermelha.png');
    this.load.image('princesaVioleta', 'assets/Princesas/PrincesaVioleta.png');

    this.load.image('princesaAzulSel', 'assets/Princesas/PrincesaAzulEscolhida.png');
    this.load.image('princesaLaranjaSel', 'assets/Princesas/PrincesaLaranjaEscolhida.png');
    this.load.image('princesaVerdeSel', 'assets/Princesas/PrincesaVerdeEscolhida.png');
    this.load.image('princesaVermelhoSel', 'assets/Princesas/PrincesaVermelhaEscolhida.png');
    this.load.image('princesaVioletaSel', 'assets/Princesas/PrincesaVioleta.png');
  }

  create() {

    this.background = this.add.tileSprite(400, 300, 800, 600, 'Fundo');     



    this.princesas = [
      { nome: 'Azul', x: 200, y: 325 },
      { nome: 'Laranja', x: 400, y: 325 },
      { nome: 'Verde', x: 600, y: 325 },
      { nome: 'Vermelho', x: 300, y: 425 },
      { nome: 'Violeta', x: 500, y: 425 }
    ];
    

    this.imagens = {};

    this.princesas.forEach((p) => {
      const img = this.add.image(p.x, p.y, `princesa${p.nome}`).setInteractive({ useHandCursor: true });
      img.setScale(1);

      img.on('pointerover', () => {
        img.setScale(1.1);
      });

      img.on('pointerout', () => {
        if (this.princesaSelecionada !== p.nome) img.setScale(0.8);
      });

      img.on('pointerdown', () => {
        this.selecionarPrincesa(p.nome);
      });

      this.imagens[p.nome] = img;
    });

    this.instrucao = this.add.text(400, 550, 'Clique em uma princesa para selecionar', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  selecionarPrincesa(nome) {
    Object.keys(this.imagens).forEach((key) => {
      const img = this.imagens[key];
      if (key === nome) {
        img.setTexture(`princesa${key}Sel`);
        img.setScale(1); 
        this.princesaSelecionada = key;
      } else {
        img.setTexture(`princesa${key}`);
        img.setScale(0.8);
      }
    });

    this.instrucao.setText(`Princesa ${nome} selecionada! Pressione ESPAÇO para continuar`);
  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.princesaSelecionada) {
      this.registry.set('princesaEscolhida', this.princesaSelecionada); 
      this.scene.start('CutsceneCreditos');
    }

    if (!this.transicionando && todosInimigosDerrotados && chegouFim) {

      this.fetchData().then(dadosRecebidos => {
          // ESTE BLOCO DE CÓDIGO SÓ EXECUTA QUANDO OS DADOS CHEGAM
  
          if (dadosRecebidos) {
              console.log("Dados recebidos com sucesso!", dadosRecebidos);
  
              // Agora sim, você pode atribuir a uma propriedade da cena ou usar diretamente
              this.disponiveis = dadosRecebidos;
              
              // Exemplo: Chamar uma função que usa os dados
              this.iniciarJogoComDados(this.disponiveis);
          } else {
              console.log("Falha ao receber os dados.");
          }
      
      disponiveis = dadosRecebidos;
      this.transicionando = true;
      this.comecarTransicaoParaFase2(); 
    })
    
  }

    async fetchData() {
        try {
            const url = 'http://200.130.152.78:5678/webhook/magomalefico/buscar-princesas';
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
    
            const data = await response.json();
            
            // 3. Retorna os dados em caso de sucesso
            return data; 
    
        } catch (error) {
            console.error('Falha ao buscar dados:', error);
            
            // 4. Retorna null em caso de erro
            return null; 
        }
    }

  
}


