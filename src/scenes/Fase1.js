export class Fase1 extends Phaser.Scene {
  constructor() {
    super('Fase1');
  }

  preload() {
        this.load.image('Floresta', 'assets/Floresta.png');
        this.load.image('FlorestaChao', 'assets/florestachao.png');
        this.load.atlas('magoAtlas', 'assets/sprites/AndarDoMago.png', 'assets/sprites/AndarDoMago.json');
        this.load.image('FlorestaTitulo', 'assets/aFlorestaPerdida.png')
        this.load.image('fireball', 'assets/FIREBALL.png');
        this.load.atlas('magoAtaque', 'assets/sprites/AtaqueDoMago.png', 'assets/sprites/AtaqueDoMago.json');
        this.load.image('inimigo', 'assets/cavaleiro.png');


        

    }

  create() {


            
            const fase2 = this.add.image(400, 100, 'FlorestaTitulo');
            fase2.setScale(0.3);


            this.chao = this.physics.add.staticSprite(400, 300, 'FlorestaChao')
         
            this.background = this.add.tileSprite(400, 300, 800, 600, 'Floresta');




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

            this.player = this.physics.add.sprite(100, 450,'magoAtlas', 'AndarDoMago 0.aseprite'); // nome da imagem carregada no preload


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


            
            this.estaAtacando = false;

            
            this.fireballs = this.physics.add.group({
                classType: Phaser.Physics.Arcade.Image,
                //maxSize: 10, ~ Limite das bolas de fogo
                runChildUpdate: true
            });

            this.physics.world.on('worldbounds', (body) => {
                if (body.gameObject && body.gameObject.texture.key === 'fireball') {
                    body.gameObject.disableBody(true, true);
                }
            });

            this.physics.add.overlap(this.fireballs, this.inimigos, (fireball, inimigo) => {
                fireball.disableBody(true, true);
                inimigo.vida -= 20;

                if (inimigo.vida <= 0) {
                    inimigo.destroy(); // ou tocar animação de morte
                }
            });



            this.player.setScale(2);

            this.player.setDebug(true);

            this.player.setSize(42, 60);  // Largura, Altura (ajuste conforme seu sprite)
            this.player.setOffset(0, 14); // Deslocamento X, Y (ajuste conforme necessário)
            this.player.setDebug(true);


            this.inimigos = this.physics.add.group();
            const inimigo = this.physics.add.sprite(600, 500, 'inimigo');
            inimigo.setCollideWorldBounds(true);
            inimigo.vida = 100;
            inimigo.tempoAtaque = 0;
            this.inimigos.add(inimigo);


            this.physics.add.collider(this.player, this.chao);
            this.physics.add.collider(this.inimigos, this.chao);

            this.physics.add.overlap(this.fireballs, this.inimigos, (fireball, inimigo) => {
                fireball.disableBody(true, true);
                inimigo.vida -= 20;
                if (inimigo.vida <= 0) inimigo.destroy();
            });


            this.physics.add.overlap(this.player, this.inimigos, (player, inimigo) => {
            const now = this.time.now;
            if (!player.invulneravel && now - inimigo.tempoAtaque > 1000) {
                player.vida -= 10;
                player.invulneravel = true;
                inimigo.tempoAtaque = now;
                this.time.delayedCall(1000, () => (player.invulneravel = false));
                }
            });


            this.cursors = this.input.keyboard.createCursorKeys();

            this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


            this.physics.world.setBounds(0, 0, 1600, 600); // Exemplo: mapa 2x mais largo que a tela

            // Verifica se o player saiu da tela (lado direito)
            this.player.body.setCollideWorldBounds(true);
            this.player.vidaMaxima = 100;
            this.player.vida = 100;
            this.barraVida = this.add.graphics();
            this.atualizarHUD();
            


           
        }

        update() {

            const speed = 160;
            let moving = false;

            if (this.player.x >= this.scale.width - this.player.width / 2) {
                this.scene.start('Fase1_1');
        }

            // Resetar movimento horizontal
            this.player.setVelocityX(0);

            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
                this.player.setFlipX(true);
                this.player.setOffset(20, 14); // ajusta para flip esquerda
                moving = true;
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
                this.player.setFlipX(false);
                this.player.setOffset(0, 14); // ajusta para flip direita
                moving = true;
            }

            if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.onFloor()) {
                this.player.setVelocityY(-500);
                this.player.setOffset(7, 14)
                
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

            this.inimigos.children.iterate((inimigo) => {
            if (!inimigo.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, inimigo.x, inimigo.y);
            if (dist < 200) {
                this.physics.moveToObject(inimigo, this.player, 60);
            } else {
                inimigo.setVelocity(0);
                }
            });

            this.atualizarHUD();



            // Verifica se o player chegou no limite direito
            if (this.player.x >= this.cameras.main.width) {
                
                this.comecarTransicaoParaFase2();
            }
         }


            comecarTransicaoParaFase2() {
            // Desativa controles e física
            this.player.setVelocity(0, 0);
            this.cursors.left.enabled = false;
            this.cursors.right.enabled = false;
            this.spaceKey.enabled = false;

   

            // Aguarda o fade completar e inicia a Fase2
             this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Fase1_1', {
                    // Dados persistentes (ex.: vida, itens)
                    //vida: 100,
                    //magias: ['fireball']
                });
            });
    }



        atacar() {
            if (this.estaAtacando) return ; // Evita atacar de novo durante a animação
            this.player.setOffset(10, 25)
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

            // Quando a animação terminar, libera movimento
            this.player.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.estaAtacando = false;
            });
     }

        atualizarHUD(){
            this.barraVida.clear();
            this.barraVida.fillStyle(0x000000);
            this.barraVida.fillRect(20, 20, 104, 14);
            this.barraVida.fillStyle(0xff0000);
            this.barraVida.fillRect(22, 22, Math.max(0, this.player.vida), 10);
         }


     

}
