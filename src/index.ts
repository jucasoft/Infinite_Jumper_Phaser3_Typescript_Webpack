import './css/style.css'
import {Game} from 'phaser';
import {Jumper} from './main/scene/jumper';
import {GameOver} from './main/scene/game-over';
import GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
    type: Phaser.AUTO, // AUTO Detect Renderer.
    backgroundColor: '#6b2127',
    width: 480,
    height: 640,
    // width: 800,
    // height: 600,
    scene: [Jumper, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            debug: true
        }
    }
};

const game = new Game(config);
