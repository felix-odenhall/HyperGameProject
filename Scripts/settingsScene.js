import Phaser from "phaser";
import settingsSceneDisplay from "../images/settingsScene.png"
import backBtn from "../images/backBtn.png"
import confirm from "../images/stingers.mp3"

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' })
    }
    preload() {
        this.load.audio("confirm", confirm);
        this.load.image("settingsSceneDisplay", settingsSceneDisplay);
        this.load.spritesheet("backBtn", backBtn, { frameWidth: 500, frameHeight: 160 });
    }

    create() {

        let confirmSound = this.sound.add("confirm", { volume: 0.5 });

        this.anims.create({
            key: 'backBtnOut',
            frames: [{ key: 'backBtn', frame: 0 }],
            frameRate: 1,
            repeat: 0
        })

        this.anims.create({
            key: 'backBtnHover',
            frames: [{ key: 'backBtn', frame: 1 }],
            frameRate: 1,
            repeat: 0
        })

        this.add.image(400, 300, "settingsSceneDisplay").setScale(1);

        const goBack = this.add.sprite(400, 560, "backBtn").setScale(0.4);
        goBack.setInteractive();
        goBack.on('pointerover', () => goBack.anims.play('backBtnHover', true))
        goBack.on('pointerout', () => goBack.anims.play('backBtnOut', true))
        goBack.on('pointerdown', () => {
            this.scene.stop('SettingsScene')
            this.scene.start('StartScene')
            confirmSound.play();
        });

    }

}