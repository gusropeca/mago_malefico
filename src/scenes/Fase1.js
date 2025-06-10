import { CenaBase } from './CenaBase.js';

export class Fase1 extends CenaBase {
  constructor() {
    super('Fase1');
  }

  preload() {

    super.preload();
    this.load.image('Floresta', 'assets/Floresta.png');
    this.load.image('FlorestaChao', 'assets/florestachao.png');
    this.load.image('FlorestaTitulo', 'assets/aFlorestaPerdida.png');
    this.load.atlas('andarCavaleiro', 'assets/sprites/AndarCavaleiro1.png', 'assets/sprites/AndarCavaleiro1.json');
    this.load.atlas('ataqueCavaleiro', 'assets/sprites/AtaqueCavaleiro1.png', 'assets/sprites/AtaqueCavaleiro1.json');


  }

  create() {
    const fase2 = this.add.image(400, 100, 'FlorestaTitulo');
    fase2.setScale(0.3);

    this.chao = this.physics.add.staticSprite(400, 300, 'FlorestaChao');
    this.background = this.add.tileSprite(400, 300, 800, 600, 'Floresta');     

    
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
    cavaleiro.vida = 100000;
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
    console.log(cavaleiro.tempoAtaque, this.time.now)
    if (!cavaleiro.active) return;
    const dist = Phaser.Math.Distance.Between(this.player.x, cavaleiro.y, cavaleiro.x, cavaleiro.y);
    if (dist < 60 && this.time.now - cavaleiro.tempoAtaque > 3000) {

      cavaleiro.setVelocity(0);
      cavaleiro.play('ataqueCavaleiro', true);
      cavaleiro.setSize(62, 60);
      cavaleiro.setOffset(50, 50);
      cavaleiro.tempoAtaque = this.time.now
      
    }
    else if (dist < 400) {
      let oldy = this.player.y
      this.player.y = cavaleiro.y
      this.physics.moveToObject(cavaleiro, this.player, 60);
      this.player.y = oldy
      if (cavaleiro.anims.getName() !== 'andarCavaleiro') {
        cavaleiro.play('andarCavaleiro', true);
      }
      cavaleiro.atacando -= 1;
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
    //this.comecarTransicaoParaFase2();
}
}


  comecarTransicaoParaFase2() {
  this.player.setVelocity(0, 0);
  this.cursors.left.enabled = false;
  this.cursors.right.enabled = false;
  this.spaceKey.enabled = false;

  this.cameras.main.once('camerafadeoutcomplete', () => {
    this.scene.start('Fase1_1', {
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
