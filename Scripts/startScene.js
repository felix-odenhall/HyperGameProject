
import Phaser from "phaser";
import bg from "../images/background_stone.png";
import cover from "../images/cover.jpg";
import darkness from "../images/darkness.png";
import startAudio from "../images/startAudio.mp3";
import startBtn from "../images/startBtn.png";
import practiceBtn from "../images/practiceBtn.png";
import duosBtn from "../images/duosBtn.png"
import settingsBtn from "../images/settingsBtn.png"
import confirm from "../images/stingers.mp3"

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' })
    }
    preload() {
        this.load.audio("startAudio", startAudio);
        this.load.audio("confirm", confirm);
        this.load.image("darkness", darkness);
        this.load.image("cover", cover);
        this.load.spritesheet("startBtn", startBtn, { frameWidth: 500, frameHeight: 160 });
        this.load.spritesheet("practiceBtn", practiceBtn, { frameWidth: 500, frameHeight: 160 });
        this.load.spritesheet("duosBtn", duosBtn, { frameWidth: 500, frameHeight: 160 });
        this.load.spritesheet("settingsBtn", settingsBtn, { frameWidth: 500, frameHeight: 160 });
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
            key: 'duosBtnOut',
            frames: [{ key: 'duosBtn', frame: 0 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'duosBtnHover',
            frames: [{ key: 'duosBtn', frame: 1 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'settingsBtnOut',
            frames: [{ key: 'settingsBtn', frame: 0 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'settingsBtnHover',
            frames: [{ key: 'settingsBtn', frame: 1 }],
            frameRate: 1,
            repeat: 0
        })

        this.add.image(400, 300, "background").setScale(1);
        this.add.image(400, 300, "cover").setScale(0.6);

        let confirmSound = this.sound.add("confirm", { volume: 0.5 });


      
        const startPractice = this.add.sprite(400, 260, "practiceBtn").setScale(0.4);
        startPractice.setInteractive();
        startPractice.on('pointerover', () => startPractice.anims.play('practiceBtnHover', true))
        startPractice.on('pointerout', () => startPractice.anims.play('practiceBtnOut', true))
        startPractice.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('PracticeScene')
            confirmSound.play();
        });

       
        const startGame = this.add.sprite(400, 340, "startBtn").setScale(0.4);
        startGame.setInteractive();
        startGame.on('pointerover', () => startGame.anims.play('startBtnHover', true))
        startGame.on('pointerout', () => startGame.anims.play('startBtnOut', true))
        startGame.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('Game')
            confirmSound.play();
        });

        const startDuos = this.add.sprite(400, 420, "duosBtn").setScale(0.4);
        startDuos.setInteractive();
        startDuos.on('pointerover', () => startDuos.anims.play('duosBtnHover', true))
        startDuos.on('pointerout', () => startDuos.anims.play('duosBtnOut', true))
        startDuos.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('GameTwoPlayers')
            confirmSound.play();
        });

        const startSettings = this.add.sprite(400, 500, "settingsBtn").setScale(0.4);
        startSettings.setInteractive();
        startSettings.on('pointerover', () => startSettings.anims.play('settingsBtnHover', true))
        startSettings.on('pointerout', () => startSettings.anims.play('settingsBtnOut', true))
        startSettings.on('pointerdown', () => {
            this.scene.stop('StartScene')
            this.scene.start('SettingsScene')
            confirmSound.play();
        });
    }
} 