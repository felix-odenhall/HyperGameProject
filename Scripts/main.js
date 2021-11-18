import Phaser from "phaser";

import Game from "./game";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ Game ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        },
    }
};

var game = new Phaser.Game(config);