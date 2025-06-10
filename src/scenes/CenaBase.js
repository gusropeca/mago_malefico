  export class CenaBase extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

preload(){

    this.load.atlas('magoAtlas', 'assets/sprites/AndarDoMago.png', 'assets/sprites/AndarDoMago.json');
    this.load.image('fireball', 'assets/FIREBALL.png');
    this.load.atlas('magoAtaque', 'assets/sprites/AtaqueDoMago.png', 'assets/sprites/AtaqueDoMago.json');
    this.load.atlas('andarCavaleiro', 'assets/sprites/AndarCavaleiro1.png', 'assets/sprites/AndarCavaleiro1.json');
    this.load.atlas('ataqueCavaleiro', 'assets/sprites/AtaqueCavaleiro1.png', 'assets/sprites/AtaqueCavaleiro1.json');



}



criarPlayer(){

    this.player = this.physics.add.sprite(100, 450, 'magoAtlas', 'AndarDoMago 0.aseprite');
    this.player.setScale(2);
    this.player.setSize(42, 50);
    this.player.setOffset(0, 14);
    this.player.vidaMaxima = 100;
    this.player.vida = 100;
    this.player.body.setCollideWorldBounds(true);

}

criarFireballGroup(){
    this.fireballs = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, runChildUpdate: true });

}


criarAnims(){
    this.anims.create({
      key: 'andarMago',
      frames: this.anims.generateFrameNames('magoAtlas', {
        start: 0,
        end: 3,
        zeroPad: 0,
        prefix: 'AndarDoMago ',
        suffix: '.aseprite'
      }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'ataqueMago',
      frames: this.anims.generateFrameNames('magoAtaque', {
        start: 0,
        end: 2,
        prefix: 'AtaqueDoMago ',
        suffix: '.aseprite'
      }),
      frameRate: 5,
      repeat: 0
    });

}

configurarControles(){
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}


atacar(){
    if (this.estaAtacando) return;
    this.player.setOffset(10, 25);
    this.estaAtacando = true;
    this.player.play('ataqueMago', true);

    const fireball = this.fireballs.get();
    if (fireball) {
      fireball.setTexture('fireball');
      fireball.enableBody(true, this.player.x, this.player.y - (-10), true, true);
      fireball.setVelocityX(this.player.flipX ? -400 : 400);
      fireball.body.setAllowGravity(false);
      fireball.setCollideWorldBounds(true);
      fireball.body.onWorldBounds = true;
    }

    this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.estaAtacando = false;
    });
}

}