import { CenaBase } from './CenaBase.js';

export class Fase1_1 extends CenaBase {
    constructor() {
    super('Fase1_1');
  }

preload() {

    super.preload();
    this.load.image('Floresta1', 'assets/Floresta1.png');
    this.load.image('FlorestaChao', 'assets/FlorestaChao.png');
    this.load.atlas('andarCavaleiro', 'assets/sprites/AndarCavaleiro1.png', 'assets/sprites/AndarCavaleiro1.json');
    this.load.atlas('ataqueCavaleiro', 'assets/sprites/AtaqueCavaleiro1.png', 'assets/sprites/AtaqueCavaleiro1.json');
}

create() {
    
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.chao = this.physics.add.staticSprite(400, 300, 'FlorestaChao')
    this.background = this.add.tileSprite(400, 300, 800, 600, 'Floresta1');
         
    this.criarAnims();
    this.criarPlayer();
    this.criarFireballGroup();
    this.configurarControles();



    this.anims.create({
      key: 'andarCavaleiro',
      frames: this.anims.generateFrameNames('andarCavaleiro', {
        start: 0,
        end: 3,
        prefix: 'AndarCavaleiro1 ',
        suffix: '.aseprite'
      }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'ataqueCavaleiro',
      frames: this.anims.generateFrameNames('ataqueCavaleiro', {
        start: 0,
        end: 4,
        prefix: 'AtaqueCavaleiro1 ',
        suffix: '.aseprite'
      }),
      frameRate: 18,
      repeat: 0
    });


    this.inimigos = this.physics.add.group();
    const cavaleiro = this.physics.add.sprite(600, 500, 'andarCavaleiro', 'AndarCavaleiro1 0.aseprite');
    this.inimigos.add(cavaleiro);
    cavaleiro.setScale(2);
    cavaleiro.setSize(42, 60);
    cavaleiro.setOffset(35, 50);
    cavaleiro.setCollideWorldBounds(true);
    cavaleiro.vida = 100;
    cavaleiro.tempoAtaque = 2;   
 
    

    this.physics.add.collider(this.player, this.chao);
    this.physics.add.collider(this.inimigos, this.chao);

    this.estaAtacando = false;

    this.physics.world.on('worl dbounds', (body) => {
      if (body.gameObject && body.gameObject.texture.key === 'fireball') {
        body.gameObject.disableBody(true, true);
      }
    });


    this.physics.add.overlap(this.fireballs, this.inimigos, (fireball, cavaleiro) => {
      fireball.disableBody(true, true);
      cavaleiro.vida -= 20;
      if (cavaleiro.vida <= 0) cavaleiro.destroy();
    });

    this.physics.add.overlap(this.player, this.inimigos, (player, cavaleiro) => {
      const now = this.time.now;
      if (!player.invulneravel && now - cavaleiro.tempoAtaque > 1000) {
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

  this.inimigos.children.iterate((cavaleiro) => {
    if (!cavaleiro.active) return;
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, cavaleiro.x, cavaleiro.y);
    if (dist < 60) {
      cavaleiro.setVelocity(0);
      cavaleiro.play('ataqueCavaleiro', true);
    } else if (dist < 400) {
      this.physics.moveToObject(cavaleiro, this.player, 60);
      if (cavaleiro.anims.getName() !== 'andarCavaleiro') {
        cavaleiro.play('andarCavaleiro', true);
      }
      const virandoEsquerda = cavaleiro.x > this.player.x;
      cavaleiro.setFlipX(virandoEsquerda);
      cavaleiro.setOffset(virandoEsquerda ? 50 : 35, 50);
    } else {
      cavaleiro.setVelocity(0);
      cavaleiro.anims.stop();
    }
  });

  this.atualizarHUD();

  // ✅ Verifica se todos os inimigos foram derrotados e se o player chegou ao fim da tela
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
    this.scene.start('Fase1_2', {
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
