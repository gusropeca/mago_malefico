export class Cavaleiro {

  constructor(scene, x, y, inimigosGroup, dropsPotion = false) {
    this.scene = scene;
    this.initialY = y;
    
    this.sprite = scene.physics.add.sprite(x, y, 'andarCavaleiro', 'AndarCavaleiro1 0.aseprite');
    
    this.sprite.setScale(2);
    this.sprite.setSize(42, 60); 
    this.sprite.setOffset(35, 50);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setAllowGravity(false); 
    this.sprite.body.setVelocityY(0);
    this.sprite.vida = 100;
    this.sprite.tempoAtaque = 2; 
    this.sprite.dropsPotion = dropsPotion;

    inimigosGroup.add(this.sprite);

    if (!this.scene.anims.get('andarCavaleiro')) {
      this.scene.anims.create({
        key: 'andarCavaleiro',
        frames: this.scene.anims.generateFrameNames('andarCavaleiro', {
          start: 0,
          end: 3,
          prefix: 'AndarCavaleiro1 ',
          suffix: '.aseprite'
        }),
        frameRate: 6,
        repeat: -1
      });
      console.log('Animação andarCavaleiro criada no construtor do Cavaleiro.');
    }

    if (!this.scene.anims.get('ataqueCavaleiro')) {
      this.scene.anims.create({
        key: 'ataqueCavaleiro',
        frames: this.scene.anims.generateFrameNames('ataqueCavaleiro', {
          start: 0,
          end: 5,
          prefix: 'AtaqueCavaleiro1 ',
          suffix: '.aseprite'
        }),
        frameRate: 18,
        repeat: 0
      });
      console.log('Animação ataqueCavaleiro criada no construtor do Cavaleiro.');
    }
  }

  update(player) {
    const cavaleiro = this.sprite;

    if (!cavaleiro.active) return; 

    cavaleiro.y = this.initialY;
    cavaleiro.body.setVelocityY(0); 

    const virandoEsquerda = cavaleiro.x > player.x; 
    const dist = Phaser.Math.Distance.Between(player.x, cavaleiro.y, cavaleiro.x, cavaleiro.y);
    const tempoAtual = this.scene.time.now; 
    // Lógica de ataque
    if (dist < 60 && tempoAtual - cavaleiro.tempoAtaque > 2000) {
      cavaleiro.setVelocity(0); 
      cavaleiro.play('ataqueCavaleiro', true); 
      cavaleiro.setSize(70, 60); 
      cavaleiro.setOffset(virandoEsquerda ? 10 : 20, 50);
      cavaleiro.tempoAtaque = tempoAtual; 
      
    }
    else if (dist < 600 && tempoAtual - cavaleiro.tempoAtaque > 2000) {
      cavaleiro.setSize(50, 60); 
      cavaleiro.setOffset(virandoEsquerda ? 40 : 10, 50); 
      
      let oldy = player.y;
      player.y = cavaleiro.y; 
      this.scene.physics.moveToObject(cavaleiro, player, 60);
      player.y = oldy; 

      if (cavaleiro.anims.getName() !== 'andarCavaleiro') {
        cavaleiro.play('andarCavaleiro', true);
      }
      
      cavaleiro.setFlipX(virandoEsquerda); 
    }
    else if (tempoAtual - cavaleiro.tempoAtaque > 1000) {
      cavaleiro.setVelocity(0); 
      cavaleiro.anims.stop(); 
    }
  }
}