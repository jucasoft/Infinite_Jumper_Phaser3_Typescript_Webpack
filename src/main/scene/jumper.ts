import {Scene} from 'phaser';
import {Carrot} from './carrot';

export class Jumper extends Scene {

    private player: any;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private cursors: any;
    private carrots: Phaser.Physics.Arcade.Group
    private carrotsCollected = 0
    private carrotsCollectedText: Phaser.GameObjects.Text;

    constructor() {
        super('jumper')
    }

    preload() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.load.image('background', 'assets/jumperpack_kenney/PNG/Background/bg_layer1.png');
        this.load.image('platform', 'assets/jumperpack_kenney/PNG/Environment/ground_grass.png');
        this.load.image('bunny-stand', 'assets/jumperpack_kenney/PNG/Players/bunny1_stand.png');
        this.load.image('carrot', 'assets/jumperpack_kenney/PNG/Items/carrot.png');
        this.load.image('bunny-jump', 'assets/jumperpack_kenney/PNG/Players/bunny1_jump.png');
        this.load.audio('jump', 'assets/jumperpack_kenney/back_001.ogg');
    }

    create() {
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)

        // add a platform image in the middle
        this.platforms = this.physics.add.staticGroup();


        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;

            const platform = this.platforms.create(x, y, 'platform');
            platform.scale = 0.5;

            const body = platform.body;
            body.updateFromGameObject();
        }

        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5);

        this.physics.add.collider(this.platforms, this.player);

        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(this.scale.width * 0.5, this.scale.height * 0.5)

        this.carrots = this.physics.add.group({
            classType: Carrot
        })

        this.physics.add.collider(this.platforms, this.carrots);
        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,
            undefined,
            this
        )
        // this.carrots.get(240, 320, 'carrot')
        // this.carrots.get(200, 300, 'carrot')

        const style = {color: '#000', fontSize: 24};
        this.carrotsCollectedText = this.add.text(240, 10, 'Carrots: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);
    }

    update(time: number, delta: number): void {

        this.platforms.children.iterate((child: any) => {
            const platform = child
            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)

                platform.body.updateFromGameObject()
                this.addCarrotAbove(platform);
            }
        })

        const touchingDown = this.player.body.touching.down;
        if (touchingDown) {
            this.player.setVelocityY(-300);
            this.player.setTexture('bunny-jump');
            this.sound.play('jump');
        }

        const vy = this.player.body.velocity.y;
        if (vy > -100 && this.player.texture.key !== 'bunny-stand'){
            this.player.setTexture('bunny-stand');
        }

        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200)
        } else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200)
        } else {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        const bottomPlatform = this.findBottomMostPlatform();
        if (this.player.y > bottomPlatform.y + 200) {
            this.scene.start('game-over');
        }

    }

    horizontalWrap(sprite: Phaser.GameObjects.Sprite) {
        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = this.scale.width;
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        } else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite: Phaser.GameObjects.Sprite) {
        const y = sprite.y - sprite.displayHeight;
        const carrot: Phaser.Physics.Arcade.Sprite = this.carrots.get(sprite.x, y, 'carrot');
        carrot.setActive(true);
        carrot.setVisible(true);
        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot)
        return carrot;
    }

    handleCollectCarrot(player: Phaser.Physics.Arcade.Sprite, carrot: Carrot) {
        this.carrots.killAndHide(carrot);
        this.physics.world.disableBody(carrot.body);
        this.carrotsCollected++;
        const value = `Carrots: ${this.carrotsCollected}`;
        this.carrotsCollectedText.text = value
    }

    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren();
        return platforms.reduce((acc: any, plat: any) => {
            if (plat.y < acc.y) {
                return acc;
            }
            return plat
        }, platforms[0])
    }
}
