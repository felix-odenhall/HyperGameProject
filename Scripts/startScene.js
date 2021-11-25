
import Phaser from "phaser";
import bg from "../images/bg-png2.png";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' })
    }
    preload() {
        this.load.image("background", bg);
    }

    create() {

        this.add.image(400, 300, "background").setScale(1);
        this.add.text(150, 150, 'Click to start', { fill: '#ffffff', fontSize: '60px' });
        this.add.text(280, 210, 'Game!', { fill: '#ffffff', fontSize: '100px' });
        this.input.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('Game')
        })
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#4488aa",
    scene: [StartScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
};

// var start = new Phaser.Game(config);