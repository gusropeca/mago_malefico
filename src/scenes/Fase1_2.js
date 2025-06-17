import { CenaBase } from './CenaBase.js';

export class Fase1_2 extends CenaBase {
    constructor() {
    super('Fase1_2');
  }
   
preload() {

    super.preload();
    this.load.image('Floresta2', 'assets/Floresta2.png');
    this.load.image('FlorestaChao', 'assets/FlorestaChao.png');
    this.load.atlas('andarMiniBoss', 'assets/sprites/AndarMiniBoss.png', 'assets/sprites/AndarMiniBoss.json');
    this.load.atlas('ataqueMiniBoss', 'assets/sprites/AtaqueMiniboss.png', 'assets/sprites/AtaqueMiniBoss.json');
    this.load.image('PocaoVida', 'assets/PocaoVida.png');

}

create(data) {
    
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.chao = this.physics.add.staticSprite(400, 300, 'FlorestaChao')
    this.background = this.add.tileSprite(400, 300, 800, 600, 'Floresta2');
         
    this.criarAnims();
    this.criarPlayer(data ? data.vida : undefined); 
    this.criarFireballGroup();
    this.configurarControles();

    this.anims.create({
      key: 'andarMiniBoss',
      frames: this.anims.generateFrameNames('andarMiniBoss', {
        start: 0,
        end: 3,
        prefix: 'AndarMiniBoss ',
        suffix: '.aseprite'
      }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'ataqueMiniBoss',
      frames: this.anims.generateFrameNames('ataqueMiniBoss', {
        start: 1,
        end: 7,
        prefix: 'AtaqueMiniBoss ',
        suffix: '.aseprite'
      }),
      frameRate: 30,
      repeat: 0
    });

    this.inimigos = this.physics.add.group();
    this.pocoes = this.physics.add.group(); 


    const miniBoss = this.physics.add.sprite(600, 500, 'andarMiniBoss', 'AndarMiniBoss 0.aseprite');
    this.inimigos.add(miniBoss);
    miniBoss.setScale(1.5); 
    miniBoss.setSize(100, 110);
    miniBoss.setOffset(60, 50);
    miniBoss.setCollideWorldBounds(true);
    miniBoss.vida = 400;
    miniBoss.tempoAtaque = 2;   
    miniBoss.dropsPotion = true;


    this.physics.add.collider(this.inimigos, this.chao);
 
    this.estaAtacando = false;

    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject && body.gameObject.texture.key === 'fireball') {
        body.gameObject.disableBody(true, true);
      }
    });

    this.physics.add.overlap(this.fireballs, this.inimigos, (fireball, miniBoss) => {
      fireball.disableBody(true, true);
      miniBoss.vida -= 20;
      if (miniBoss.vida <= 0) {
       
        if (miniBoss.dropsPotion) {
            const potion = this.pocoes.create(miniBoss.x, miniBoss.y, 'PocaoVida');
            
            potion.setOrigin(0.5, 0.5); 
            potion.body.setAllowGravity(true); 
            potion.setCollideWorldBounds(true); 
            potion.body.setBounceY(0.4); 
            potion.body.setVelocityY(100); 
        }
        miniBoss.destroy(); 
      }
    });


     this.physics.add.overlap(this.player, this.pocoes, (player, potion) => {
        player.vida = Math.min(player.vidaMaxima, player.vida + 60); 
        this.atualizarHUD(); 
        potion.destroy(); 
    });


  this.physics.add.overlap(this.player, this.inimigos, (player, miniBoss) => {
    const now = this.time.now;
    if (!player.invulneravel && now - miniBoss.tempoAtaque > 1000) {
    player.vida -= 20;
    player.invulneravel = true;
    miniBoss.tempoAtaque = now;
    miniBoss.play('ataqueMiniBoss', true); 
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

    this.inimigos.children.iterate((miniBoss) => {
        console.log(miniBoss.tempoAtaque, this.time.now)
        if (!miniBoss.active) return;
        const virandoEsquerda = miniBoss.x > this.player.x;
        const dist = Phaser.Math.Distance.Between(this.player.x, miniBoss.y, miniBoss.x, miniBoss.y);
        if (dist < 60 && this.time.now - miniBoss.tempoAtaque > 2000) {

        miniBoss.setVelocity(0);
        miniBoss.play('ataqueMiniBoss', true);
        miniBoss.setSize(100, 110);
        miniBoss.setOffset(virandoEsquerda ? 10 : 80, 50);
        miniBoss.tempoAtaque = this.time.now
        
        }
        else if (dist < 400 && this.time.now - miniBoss.tempoAtaque > 2000) {
        miniBoss.setSize(100, 110);
        miniBoss.setOffset(virandoEsquerda ? 40 : 80, 50);
        let oldy = this.player.y
        this.player.y = miniBoss.y
        this.physics.moveToObject(miniBoss, this.player, 60);
        this.player.y = oldy
        if (miniBoss.anims.getName() !== 'andarMiniBoss') {
            miniBoss.play('andarMiniBoss', true);
        }
        miniBoss.atacando -= 1;
        miniBoss.setFlipX(virandoEsquerda);
        } else if (this.time.now - miniBoss.tempoAtaque > 1000){
        miniBoss.setVelocity(0);
        miniBoss.anims.stop();

        }
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
    this.scene.start('Fase2', {
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
