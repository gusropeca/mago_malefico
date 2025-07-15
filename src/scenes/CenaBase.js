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
    this.load.atlas('andarCavaleiro', 'assets/sprites/AndarCavaleiro1.png', 'assets/sprites/AndarCavaleiro1.json');
    this.load.atlas('ataqueCavaleiro', 'assets/sprites/AtaqueCavaleiro1.png', 'assets/sprites/AtaqueCavaleiro1.json');


}

update() {
    // Se o jogador estiver atacando, ele não pode se mover nem mudar de animação.
    if (this.estaAtacando) {
        return; // Sai da função update para não processar o movimento
    }

    // Verifica o input de movimento
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.flipX = true; // Vira o sprite para a esquerda
        this.player.play('andarMago', true); // O 'true' evita reiniciar a animação a cada frame
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.flipX = false; // Vira o sprite para a direita
        this.player.play('andarMago', true);
    } else {
        // Se nenhuma tecla de movimento estiver pressionada
        this.player.setVelocityX(0);
        this.player.anims.stop(); // Para a animação (ou você pode tocar uma animação 'parado')
    }

    // Verifica o input de ataque
    if (Phaser.Input.Keyboard.JustDown(this.attackKey) && !this.estaAtacando) {
        this.atacar();
    }
}
    
criarPlayer(initialVida = 100){ // ✅ Adicionado parâmetro opcional para vida inicial
    this.player = this.physics.add.sprite(100, 450, 'magoAtlas', 'AndarDoMago 0.aseprite');
    this.player.setScale(2);
    this.player.setSize(42, 50);
    this.player.setOffset(0, 14);
    this.player.vidaMaxima = 100;
    this.player.vida = initialVida; 
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


atacar() {
    if (this.estaAtacando) return;

    this.estaAtacando = true;
    this.player.play('ataqueMago', true);
    this.player.setOffset(10, 25);

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
  return;
}
}
