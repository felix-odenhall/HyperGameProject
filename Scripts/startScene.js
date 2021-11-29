
import Phaser from "phaser";
import bg from "../images/background_stone.png";
import cover from "../images/cover.jpg";
import darkness from "../images/darkness.png";
import startAudio from "../images/startAudio.mp3";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' })
    }
    preload() {
        this.load.audio("startAudio", startAudio);
        this.load.image("background", bg);
        this.load.image("cover", cover);

    }

    create() {
        var gameSound = this.sound.add("startAudio");
        // gameSound.loop = true;
        gameSound.play();
        this.add.image(400, 300, "background").setScale(1);

        this.add.image(400, 300, "cover").setScale(0.6);
        this.add.text(150, 150, 'Click to start', { fill: '#ffffff', fontSize: '60px' });
        this.add.text(280, 210, 'Game!', { fill: '#ffffff', fontSize: '100px' });
        this.input.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('PracticeScene')
        })

        // this.add.text(150, 150, 'Click to start', { fill: '#ffffff', fontSize: '60px' });
        // this.add.text(280, 210, 'Game!', { fill: '#ffffff', fontSize: '100px' });
        // this.input.on('pointerdown', () => {
        // this.scene.stop('StartScene')
        // this.scene.start('PracticeScene')
        // })

        const startPractice = this.add.text(100, 100, 'Start Practice', { fill: '#0f0' });
        startPractice.setInteractive();
        startPractice.on('pointerover', () => startPractice.setColor('#FF00FF'))
        startPractice.on('pointerout', () => startPractice.setColor('#0f0'))
        startPractice.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('PracticeScene')
        });

        const startGame = this.add.text(100, 200, 'Start Game', { fill: '#0f0' });
        startGame.setInteractive();
        startGame.on('pointerover', () => startGame.setColor('#FF00FF'))
        startGame.on('pointerout', () => startGame.setColor('#0f0'))
        startGame.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('Game')
        });
    }
}

// var config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     backgroundColor: "#4488aa",
//     scene: [StartScene],
//     physics: {
//         default: "arcade",
//         arcade: {
//             gravity: { y: 0 },
//             debug: true,
//         },
//     },
// };

// var start = new Phaser.Game(config);