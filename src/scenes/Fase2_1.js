export class Fase2_1 extends Phaser.Scene{
     constructor() {
        super('Fase2_1');
    }

        preload() {
            this.load.image('Castelo2', 'assets/InteriorCastelo1.png');
            this.load.atlas('magoAtlas', 'assets/sprites/AndarDoMago.png', 'assets/sprites/AndarDoMago.json');

            this.load.image('CasteloChao', 'assets/CasteloChao.png')
        }


        create() {
            
            this.cameras.main.fadeIn(1000, 0, 0, 0);

         
            this.chao = this.physics.add.staticImage(400, 300, 'CasteloChao')

            this.background = this.add.tileSprite(400, 300, 800, 600, 'Castelo2');


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
                key: 'PuloMago',
                frames: this.anims.generateFrameNames('magoPulo', {
                    start: 1,
                    end: 5,
                    zeroPad: 0,
                    prefix: 'PuloDoMago ',
                    suffix: '.aseprite'
                }),
                frameRate: 5,
                repeat: 0
            });


            this.player = this.physics.add.sprite(100, 450,'magoAtlas', 'AndarDoMago 0.aseprite');
            this.player.setScale(2);


            this.player.setSize(42, 60);  // Largura, Altura (ajuste conforme seu sprite)
            this.player.setOffset(0, 14); // Deslocamento X, Y (ajuste conforme necessário)

            this.physics.add.collider(this.player, this.chao);

            this.physics.world.setBounds(0, 0, 1600, 600);

            this.cursors = this.input.keyboard.createCursorKeys();

            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            this.player.body.setCollideWorldBounds(true);


      
        }

        update() {

            const speed = 160;
            let moving = false;

            if (this.player.x >= this.scale.width - this.player.width / 2) {
                this.scene.start('Fase2_2');
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
                //this.player.play('PuloMago', true); // Força a animação imediatamente
            }
            
            // Se está NO AR, toca animação de pulo
            if (!this.player.body.onFloor) {
                if (this.player.anims.getName() !== 'PuloMago') {
                this.player.play('PuloMago', true);
                    }
            return;
            // interrompe o resto
            } 

            // Se está no chão:
            if (moving) {
                if (this.player.anims.getName() !== 'andarMago') {
                this.player.play('andarMago', true);
                }
            } else {
                this.player.setFrame('AndarDoMago 0.aseprite');
            }


            // Verifica se o player chegou no limite d  ireito
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
                this.scene.start('Fase2_2', {
                    // Dados persistentes (ex.: vida, itens)
                    //vida: 100,
                    //magias: ['fireball']
                });
            });
    }
}