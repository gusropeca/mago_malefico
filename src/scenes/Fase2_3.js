import { CenaBase } from './CenaBase.js';

export class Fase2_3 extends CenaBase {
    constructor() {
        super('Fase2_3');
    }

    preload() {
        super.preload();
        this.load.image('Castelo3', 'assets/InteriorCastelo3.png');
        this.load.image('CasteloChao', 'assets/CasteloChao.png');
        this.load.image('PocaoVida', 'assets/PocaoVida.png');
        
        this.load.atlas('andarBossPequeno', 'assets/sprites/AndarBossPequeno.png', 'assets/sprites/AndarBossPequeno.json');
        this.load.atlas('ataqueBossPequeno', 'assets/sprites/AtaqueBossPequeno.png', 'assets/sprites/AtaqueBossPequeno.json');
        this.load.image('purpleFireball', 'assets/PurpleFireball.png');
        this.load.atlas('andarBoss', 'assets/sprites/AndarBoss.png', 'assets/sprites/AndarBoss.json');
        this.load.atlas('ataqueBoss', 'assets/sprites/AtaqueBoss.png', 'assets/sprites/AtaqueBoss.json');

        this.load.atlas('cutsceneTransformacao', 'assets/sprites/CutsceneBoss.png', 'assets/sprites/CutsceneBoss.json');

        this.load.audio('TrilhaSonoraBoss', 'assets/music/MusicaBoss.mp3');
    }

    create(data) {
        this.gameState = 'FIGHTING';
        
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.chao = this.physics.add.staticSprite(400, 300, 'CasteloChao');
        this.background = this.add.tileSprite(400, 300, 800, 600, 'Castelo3');

        this.music = this.sound.add('TrilhaSonoraBoss', { 
            loop: true,
            volume: 0.5
        });
        
        this.music.play();
        
        this.criarAnims();
        this.criarPlayer(data ? data.vida : undefined);
        this.criarFireballGroup();
        this.configurarControles();

        this.inimigos = this.physics.add.group();
        this.pocoes = this.physics.add.group();

        this.faseBoss = 1;
        this.bossGrande = null;

        this.bossPequeno = this.inimigos.create(600, 500, 'andarBossPequeno', 'AndarBossPequeno 0.aseprite');
        this.bossPequeno.setScale(2);
        this.bossPequeno.setSize(60, 70);
        this.bossPequeno.setOffset(30, 40);
        this.bossPequeno.setCollideWorldBounds(true);
        this.bossPequeno.vida = 200;
        this.bossPequeno.tempoUltimoTiro = 0;
        this.bossPequeno.isBossPequeno = true;
        this.criarAnimacoesBoss();

        this.fireballsBoss = this.physics.add.group({
            defaultKey: 'purpleFireball',
            maxSize: 15
        });
        this.physics.add.collider(this.fireballsBoss, this.chao, (fb) => fb.destroy());

        this.physics.add.collider(this.player, this.chao);
        this.physics.add.collider(this.inimigos, this.chao);
        this.physics.add.collider(this.pocoes, this.chao);

        this.estaAtacando = false;
        
        this.physics.add.overlap(this.fireballs, this.inimigos, (fireball, inimigo) => {
            fireball.disableBody(true, true);
            inimigo.vida -= 20;
            
            inimigo.setTint(0xff0000);
            this.time.delayedCall(100, () => inimigo.clearTint());

            if (inimigo.vida <= 0) {
                if (inimigo.isBossPequeno) {
                    this.iniciarTransformacaoBoss();
                } else {
                    inimigo.destroy();
                }
            }
        });

        this.physics.add.overlap(this.fireballsBoss, this.player, (player, fireball) => {
            fireball.destroy();
            if (!player.invulneravel) this.darDanoAoPlayer(10);
        });

        this.physics.add.overlap(this.player, this.inimigos, (player, inimigo) => {
            if (inimigo.isBossGrande && !player.invulneravel) {
                const isAttacking = inimigo.anims.currentAnim && inimigo.anims.currentAnim.key === 'ataqueBossGrande';
                if (isAttacking) {
                    this.darDanoAoPlayer(25);
                }
            }
        });

        this.physics.add.overlap(this.player, this.pocoes, (player, potion) => {
            player.vida = Math.min(player.vidaMaxima, player.vida + 60);
            this.atualizarHUD();
            potion.destroy();
        });

        this.barraVida = this.add.graphics();
        this.transicionando = false;
        this.atualizarHUD();
    }
    
    criarAnimacoesBoss() {

        this.anims.create({
            key: 'playTransformacao',
            frames: this.anims.generateFrameNames('cutsceneTransformacao', { 
                prefix: 'CutsceneBoss ', 
                start: 0, 
                end: 14,
                suffix: '.aseprite'
            }),
            frameRate: 2.5, 
            repeat: 0
        });


        this.anims.create({
            key: 'andarBossPequeno',
            frames: this.anims.generateFrameNames('andarBossPequeno', { start: 0, end: 2, prefix: 'AndarBossPequeno ', suffix: '.aseprite' }),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({
            key: 'ataqueBossPequeno',
            frames: this.anims.generateFrameNames('ataqueBossPequeno', { start: 0, end: 2, prefix: 'AtaqueBossPequeno ', suffix: '.aseprite' }),
            frameRate: 8,
            repeat: 0,
        });
        

        this.anims.create({
            key: 'andarBossGrande',
            frames: this.anims.generateFrameNames('andarBoss', { start: 0, end: 2, prefix: 'AndarBoss ', suffix: '.aseprite' }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'ataqueBossGrande',
            frames: this.anims.generateFrameNames('ataqueBoss', { start: 0, end: 3, prefix: 'AtaqueBoss ', suffix: '.aseprite' }),
            frameRate: 8,
            repeat: 0,
        });
    }

    iniciarTransformacaoBoss() {
        if (this.faseBoss === 2) return;

        this.faseBoss = 2;
        this.gameState = 'CUTSCENE';

        //this.music.stop();
        this.player.setActive(false).setVisible(false); // Esconde o jogador durante a cutscene

        const pos = { x: this.bossPequeno.x, y: this.bossPequeno.y };
        this.bossPequeno.destroy();

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const cutsceneSprite = this.add.sprite(centerX, centerY, 'cutsceneTransformacao');
        cutsceneSprite.setScrollFactor(0); // Fixa a cutscene na câmara, ignorando o scroll do mundo
        
        cutsceneSprite.play('playTransformacao');

        cutsceneSprite.on('animationcomplete', () => {
            cutsceneSprite.destroy();
            this.criarBossGrande(pos.x, pos.y);
            
            this.player.setActive(true).setVisible(true); // Mostra o jogador novamente
            this.gameState = 'FIGHTING';
            //this.music.play();
        });
    }

    criarBossGrande(x, y) {
        this.bossGrande = this.inimigos.create(x, y, 'andarBoss');
        this.bossGrande.setScale(1.25); 
        this.bossGrande.body.setAllowGravity(true);
        this.bossGrande.setSize(120, 140);
        this.bossGrande.setOffset(30, 15);
        this.bossGrande.setCollideWorldBounds(true);
        this.bossGrande.vida = 250;
        this.bossGrande.tempoUltimoAtaque = 0;
        this.bossGrande.isBossGrande = true;
    }

    dispararFireballBoss() {
        if (!this.bossPequeno.active || !this.player.active) return;
        
        const fireball = this.fireballsBoss.get(this.bossPequeno.x, this.bossPequeno.y);
        if (fireball) {
            fireball.setActive(true).setVisible(true);
            fireball.body.allowGravity = false;
            const angle = Phaser.Math.Angle.Between(this.bossPequeno.x, this.bossPequeno.y, this.player.x, this.player.y);
            this.physics.velocityFromRotation(angle, 250, fireball.body.velocity);
        }
    }

    darDanoAoPlayer(dano) {
        this.player.vida -= dano;
        this.atualizarHUD();
        this.player.setAlpha(0.5);
        this.player.invulneravel = true;
        this.time.delayedCall(1000, () => {
            this.player.setAlpha(1);
            this.player.invulneravel = false;
        });
    }
    
disponiveis = "";
    
    update(time) {
        if (this.gameState === 'CUTSCENE') {
            return;
        }

        if (this.player.vida <= 0 && !this.morreu) {
            this.morreu = true;
            this.music.stop();

            this.scene.start('TelaMorte');
            return;
        }

        if (this.faseBoss === 1 && this.bossPequeno && this.bossPequeno.active) {
            this.updateBossPequeno(time);
        } else if (this.faseBoss === 2 && this.bossGrande && this.bossGrande.active) {
            this.updateBossGrande(time);
        }

        this.updatePlayerControls();
        this.atualizarHUD();

        const todosInimigosDerrotados = this.inimigos.countActive(true) === 0;
        const chegouFim = this.player.x >= this.cameras.main.width - this.player.width;

        if (!this.transicionando && todosInimigosDerrotados && chegouFim) {
            disponiveis = fetchData();
            this.transicionando = true;
            this.comecarTransicaoParaFase2(); 
        }
    }
    
    updateBossPequeno(time) {
        const boss = this.bossPequeno;
        if (!boss.active) return;
        const distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, boss.x, boss.y);
        const isAttacking = boss.anims.isPlaying && boss.anims.currentAnim.key === 'ataqueBossPequeno';
        
        if (isAttacking) return;

        if (distancia > 450) {
            const speed = 70;
            this.physics.moveToObject(boss, this.player, speed);
            boss.play('andarBossPequeno', true);
        } else {
            boss.setVelocity(0);
            if (time > boss.tempoUltimoTiro) {
                boss.play('ataqueBossPequeno', true);
                for (let i = 0; i < 3; i++) {
                    this.time.delayedCall(150 * i, () => this.dispararFireballBoss(), [], this);
                }
                boss.tempoUltimoTiro = time + 2500;
            } else {
                boss.play('andarBossPequeno', true);
            }
        }
        boss.setFlipX(this.player.x < boss.x);
    }

    updateBossGrande(time) {
        const boss = this.bossGrande;
        if (!boss.active) return;
        const distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, boss.x, boss.y);
        const isAttacking = boss.anims.isPlaying && boss.anims.currentAnim.key === 'ataqueBossGrande';
        const attackRange = 90;

        if (isAttacking) {
            boss.setVelocityX(0);
            return;
        }

        if (distancia > attackRange) {
            const speed = 70;
            if (this.player.x < boss.x) boss.setVelocityX(-speed);
            else boss.setVelocityX(speed);
            boss.play('andarBossGrande', true);
        } else {
            boss.setVelocity(0);
            if (time > boss.tempoUltimoAtaque) {
                boss.play('ataqueBossGrande', true);
                boss.tempoUltimoAtaque = time + 2500;
            } else {
                boss.play('andarBossGrande', true);
            }
        }
        boss.setFlipX(this.player.x < boss.x);
    }

    updatePlayerControls() {
        if (!this.player.active) {
            this.player.setVelocity(0);
            return;
        }
        const speed = 160;
        let moving = false;
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            moving = true;
        }
        if (moving) this.player.setFlipX(this.player.body.velocity.x < 0);

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.player.body.onFloor()) {
            this.player.setVelocityY(-500);
        }

        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.atacar();
        }

         if (!this.estaAtacando) {
            if (moving) {
                this.player.play('andarMago', true);
            } else {
               /* this.player.anims.stop();
                this.player.setTexture('magoAtlas', 'AndarDoMago 0.aseprite');
                this.player.setOffset(0, 14); */
            }
        }
    }

    comecarTransicaoParaFase2() {
        this.sound.stopByKey('TrilhaSonoraBoss');
        this.player.setVelocity(0, 0);
        this.cursors.left.enabled = false;
        this.cursors.right.enabled = false;
        this.spaceKey.enabled = false;
        this.music.stop();

        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CutsceneFinal', { vida: this.player.vida });
        });
    }

    atualizarHUD() {
        this.barraVida.clear();
        this.barraVida.fillStyle(0x000000);
        this.barraVida.fillRect(20, 20, 104, 14);
        this.barraVida.fillStyle(0xff0000);
        this.barraVida.fillRect(22, 22, Math.max(0, this.player.vida), 10);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    async function fetchData() {
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
