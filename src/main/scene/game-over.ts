export class GameOver extends Phaser.Scene {


    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super('game-over');
    }


    create() {
        const width = this.scale.width
        const height = this.scale.height

        this.add.text(width * 0.5, height * 0.5, 'Game Over', {})
            .setOrigin(0.5)

        this.input.keyboard.once('keydown_SPACE', () => {
            this.scene.start('jumper')
        });
    }
}
