
import Phaser from "phaser";
import bg from "../images/background_stone.png";
import cover from "../images/cover.jpg";
import darkness from "../images/darkness.png";
import startAudio from "../images/startAudio.mp3";
import startBtn from "../images/startBtn.png";
import practiceBtn from "../images/practiceBtn.png";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' })
    }
    preload() {
        this.load.audio("startAudio", startAudio);
        this.load.image("darkness", darkness);
        this.load.image("cover", cover);
        this.load.spritesheet("startBtn", startBtn, { frameWidth: 500, frameHeight: 160 });
        this.load.spritesheet("practiceBtn", practiceBtn, { frameWidth: 500, frameHeight: 160 });

    }

    create() {
        // Audio for StartScene
        // var gameSound = this.sound.add("startAudio");
        // gameSound.autoplay = true;
        // gameSound.play();

        this.anims.create({
            key: 'startBtnOut',
            frames: [{ key: 'startBtn', frame: 0 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'startBtnHover',
            frames: [{ key: 'startBtn', frame: 1 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'startBtnClick',
            frames: [{ key: 'startBtn', frame: 2 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'practiceBtnOut',
            frames: [{ key: 'practiceBtn', frame: 0 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'practiceBtnHover',
            frames: [{ key: 'practiceBtn', frame: 1 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'practiceBtnClick',
            frames: [{ key: 'practiceBtn', frame: 2 }],
            frameRate: 1,
            repeat: 0
        })

        this.add.image(400, 300, "background").setScale(1);
        this.add.image(400, 300, "cover").setScale(0.6);



      
        const startPractice = this.add.sprite(400, 250, "practiceBtn").setScale(0.5);
        startPractice.setInteractive();
        startPractice.on('pointerover', () => startPractice.anims.play('practiceBtnHover', true))
        startPractice.on('pointerout', () => startPractice.anims.play('practiceBtnOut', true))
        startPractice.on('pointerdown', () => {
            startPractice.anims.play('practiceBtnClick', true)
            this.scene.stop('StartScene')
            this.scene.start('PracticeScene')
        });

       
        const startGame = this.add.sprite(400, 350, "startBtn").setScale(0.5);
        startGame.setInteractive();
        startGame.on('pointerover', () => startGame.anims.play('startBtnHover', true))
        startGame.on('pointerout', () => startGame.anims.play('startBtnOut', true))
        startGame.on('pointerdown', () => {
            startGame.anims.play('startBtnClick', true)
            this.scene.stop('StartScene')
            this.scene.start('Game')
        });
    }
}