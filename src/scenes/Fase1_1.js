import { CenaBase } from './CenaBase.js';
import { Cavaleiro } from './Cavaleiro.js'; 

export class Fase1_1 extends CenaBase {
    constructor() {
    super('Fase1_1');
  }

preload() {

    super.preload();
    this.load.image('Floresta1', 'assets/Floresta1.png');
    this.load.image('FlorestaChao', 'assets/FlorestaChao.png');
    this.load.image('PocaoVida', 'assets/PocaoVida.png');

    
}


create(data) { 
    
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.chao = this.physics.add.staticSprite(400, 300, 'FlorestaChao')
    this.background = this.add.tileSprite(400, 300, 800, 600, 'Floresta1');
         
    this.criarAnims();
    this.criarPlayer(data ? data.vida : undefined); 
    this.criarFireballGroup();
    this.configurarControles();

    this.inimigos = this.physics.add.group();
    this.pocoes = this.physics.add.group(); 
  
    this.cavaleiros = []; 
    this.cavaleiros.push(new Cavaleiro(this, 600, 500, this.inimigos, false));
    this.cavaleiros.push(new Cavaleiro(this, 700, 500, this.inimigos, false));
    this.cavaleiros.push(new Cavaleiro(this, 800, 500, this.inimigos, true));

    this.physics.add.collider(this.player, this.chao);
    this.physics.add.collider(this.inimigos, this.chao); 


    this.estaAtacando = false;

    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject && body.gameObject.texture.key === 'fireball') {
        body.gameObject.disableBody(true, true);
      }
    });

    this.physics.add.overlap(this.fireballs, this.inimigos, (fireball, cavaleiro) => {
      fireball.disableBody(true, true);
      cavaleiro.vida -= 20;
      if (cavaleiro.vida <= 0) {
       
        if (cavaleiro.dropsPotion) {
            const potion = this.pocoes.create(cavaleiro.x, cavaleiro.y, 'PocaoVida');
            
            potion.setOrigin(0.5, 0.5); 
            potion.body.setAllowGravity(true); 
            potion.setCollideWorldBounds(true); 
            potion.body.setBounceY(0.4); 
            potion.body.setVelocityY(100); 
        }
        cavaleiro.destroy(); 
      }
    });
    

    this.physics.add.overlap(this.player, this.pocoes, (player, potion) => {
        player.vida = Math.min(player.vidaMaxima, player.vida + 60); 
        this.atualizarHUD(); 
        potion.destroy(); 
    });

    this.physics.add.overlap(this.player, this.inimigos, (player, cavaleiro) => {
      const now = this.time.now;
      if (!player.invulneravel && now - cavaleiro.tempoAtaque < 1000) {
        player.vida -= 10;
        player.invulneravel = true;
        cavaleiro.tempoAtaque = now;
        cavaleiro.play('ataqueCavaleiro', true);
        this.time.delayedCall(1000, () => (player.invulneravel = false));
      }
    });

    this.physics.world.setBounds(0, 0, 1600, 600);
    
    this.barraVida = this.add.graphics();
    this.transicionando = false;
    this.atualizarHUD();
  }

  update() {

    if (this.player.vida <= 0 && !this.morreu) {
      this.morreu = true; 
      this.scene.start('TelaMorte');
  }
    const speed = 160;
    let moving = false;

    this.player.setVelocityX(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
      this.player.setOffset(20, 14);
      moving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
      this.player.setOffset(0, 14);
      moving = true;
    } else {
      moving = false;
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.onFloor()) {
      this.player.setVelocityY(-500);
      this.player.setOffset(7, 14);
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.atacar();
    }

    if (!this.estaAtacando) {
      if (moving) {
        if (this.player.anims.getName() !== 'andarMago') {
          this.player.play('andarMago', true);
        }
      } else {
        this.player.anims.stop();
        this.player.setFrame('AndarDoMago 0.aseprite');
      }
    }

    this.cavaleiros.forEach(cavaleiroInstance => {
      cavaleiroInstance.update(this.player);
    });

    this.atualizarHUD();

    const todosInimigosDerrotados = this.inimigos.countActive(true) === 0;
    const chegouFim = this.player.x >= this.cameras.main.width;

    if (!this.transicionando && todosInimigosDerrotados && chegouFim) {
      this.transicionando = true;
      this.comecarTransicaoParaFase2(); 
    }
  }


  comecarTransicaoParaFase2() {
  this.player.setVelocity(0, 0);
  this.cursors.left.enabled = false;
  this.cursors.right.enabled = false;
  this.spaceKey.enabled = false;

  this.cameras.main.once('camerafadeoutcomplete', () => {
    // Certifique-se que o nome da próxima cena está correto aqui
    this.scene.start('Fase1_2', { // Pode ser Fase1_2 ou a próxima fase real
      vida: this.player.vida
    });
  });

  this.cameras.main.fadeOut(500); // iniciar fade
}


  atualizarHUD() {
    this.barraVida.clear();
    this.barraVida.fillStyle(0x000000);
    this.barraVida.fillRect(20, 20, 104, 14);
    this.barraVida.fillStyle(0xff0000);
    this.barraVida.fillRect(22, 22, Math.max(0, this.player.vida), 10);
  }
}
