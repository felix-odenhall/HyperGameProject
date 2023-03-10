console.log(" Inside PracticeScene");
import { World } from "matter";
import Phaser from "phaser";
import bg from "../images/background_stone.png";
import bg2 from "../images/backgroundTraining.png";
import gandalf from "../images/wizzard_sprite2.png";
import shot from "../images/shot.png";
import gandalfShoot from "../images/gandalf_shoot_sprite2.png";
import arrowUp from "../images/arrowUp.png";
import arrowDown from "../images/arrowDown.png";
import arrowRight from "../images/arrowRight.png";
import arrowLeft from "../images/arrowLeft.png";
import spaceKey from "../images/space_key.png";
import orcSprite from "../images/orc_sprite2.png";
import magicShot from "../images/magic.wav";
import practiceMusic from "../images/the-low-whistle.mp3";
import dummyHit from "../images/slimejump.mp3";
import shoot from "../images/shoot.mp3";
import startGameBtn from "../images/startGameBtn.png";
import confirm from "../images/stingers.mp3";
import bush from "../images/bush.png";

let orcs;
let positions;
let practiceSong;
let confirmSound;
let bushes1;
let bushes2;
let bushes3;
let bushes4;

const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
  speedBoost: 1,
  gandalfBoost: 10,
  rotation: 270,
  rotationSpeed: 150,
  score: 0,
  tutorial: 0,
};

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "PracticeScene" });
  }
  preload() {
    // this.load.image(
    //   "orc", // ORC
    //   orcSprite
    // );

    this.load.audio("confirm", confirm);

    this.load.spritesheet("gandalf", gandalf, {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("orc", orcSprite, {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("gandalfShoot", gandalfShoot, {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("arrowUp", arrowUp, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("arrowDown", arrowDown, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("arrowRight", arrowRight, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("arrowLeft", arrowLeft, {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("spaceKey", spaceKey, {
      frameWidth: 384,
      frameHeight: 96,
    });

    this.load.image(
      "shot", // SHOT
      shot
    );
    this.load.image("background2", bg2);

    this.load.audio("magicShot", magicShot);
    this.load.audio("dummyHit", dummyHit);
    this.load.audio("practiceMusic", practiceMusic);
    this.load.audio("shoot", shoot);

    this.load.spritesheet("startGameBtn", startGameBtn, {
      frameWidth: 500,
      frameHeight: 160,
    });

    this.load.image("bushesImg", bush);
  }

  create() {
    confirmSound = this.sound.add("confirm", { volume: 0.5 });

    this.anims.create({
      key: "startGameBtnOut",
      frames: [{ key: "startGameBtn", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: "startGameBtnHover",
      frames: [{ key: "startGameBtn", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    practiceSong = this.sound.add("practiceMusic", { volume: 0.3 });
    practiceSong.play();
    this.add.image(400, 300, "background2").setScale(1);
    this.add.text(10, 540, "Press the arrow keys to move Gandalf,", {
      fill: "#000",
      fontSize: "20px",
    });
    this.add.text(10, 570, "Press the SpaceBar to shoot", {
      fill: "#000",
      fontSize: "20px",
    });
    positions = {
      centerX: this.physics.world.bounds.width / 2,
      centerY: this.physics.world.bounds.height / 2,
      topEdge: 0,
      rightEdge: this.physics.world.bounds.width,
      bottomEdge: this.physics.world.bounds.height,
      leftEdge: 0,
    };

    // CURSORS CURSORS CURSORS CURSORS CURSORS CURSORS CURSORS

    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS

    // orcs = this.physics.add.group();

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
      .sprite(positions.centerX, positions.centerY + 100, "gandalf")
      .setCollideWorldBounds(true)
      .setScale(1)
      .setBodySize(20, 20);
    gameState.gandalf.rotation = -1.56;

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("gandalf", { start: 0, end: 6 }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "idle",
      frames: [{ key: "gandalf", frame: 3 }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: "shoot",
      frames: this.anims.generateFrameNumbers("gandalfShoot", {
        start: 0,
        end: 4,
      }),
      frameRate: 20,
      repeat: 0,
    });
    // this.physics.world.addCollider(orcs, gameState.shot)

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE

    gameState.arrowUp = this.add
      .sprite(650, 450, "arrowUp")
      .setDepth(4)
      .setScale(0.6);

    this.anims.create({
      key: "upGrey",
      frames: [{ key: "arrowUp", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "upGreen",
      frames: [{ key: "arrowUp", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    gameState.arrowDown = this.add
      .sprite(650, 500, "arrowDown")
      .setDepth(4)
      .setScale(0.6);

    this.anims.create({
      key: "downGrey",
      frames: [{ key: "arrowDown", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "downGreen",
      frames: [{ key: "arrowDown", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    gameState.arrowRight = this.add
      .sprite(700, 500, "arrowRight")
      .setDepth(4)
      .setScale(0.6);

    this.anims.create({
      key: "rightGrey",
      frames: [{ key: "arrowRight", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "rightGreen",
      frames: [{ key: "arrowRight", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    gameState.arrowLeft = this.add
      .sprite(600, 500, "arrowLeft")
      .setDepth(4)
      .setScale(0.6);

    this.anims.create({
      key: "leftGrey",
      frames: [{ key: "arrowLeft", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "leftGreen",
      frames: [{ key: "arrowLeft", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    gameState.spaceKey = this.add
      .sprite(300, 500, "spaceKey")
      .setDepth(4)
      .setScale(0.6);

    this.anims.create({
      key: "spaceGrey",
      frames: [{ key: "spaceKey", frame: 0 }],
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: "spaceGreen",
      frames: [{ key: "spaceKey", frame: 1 }],
      frameRate: 1,
      repeat: 0,
    });

    bushes1 = this.physics.add
      .sprite(200, 250, "bushesImg")
      .setScale(1)
      .setImmovable(true);

    bushes2 = this.physics.add
      .sprite(350, 150, "bushesImg")
      .setScale(1)
      .setImmovable(true);

    bushes3 = this.physics.add
      .sprite(450, 230, "bushesImg")
      .setScale(1)
      .setImmovable(true);

    bushes4 = this.physics.add
      .sprite(550, 350, "bushesImg")
      .setScale(1)
      .setImmovable(true);

    gameState.scoreText = this.add
      .text(600, 25, `Kills: ${gameState.score}`, {
        fontSize: "32px",
        fill: "#FFF",
      })
      .setDepth(4);

    this.createOrcs();
    this.turnOrcs(orcs);
    this.physics.add.collider(orcs, gameState.gandalf);
    this.physics.add.collider(bushes1, gameState.gandalf);
    this.physics.add.collider(bushes2, gameState.gandalf);
    this.physics.add.collider(bushes3, gameState.gandalf);
    this.physics.add.collider(bushes4, gameState.gandalf);
  }

  update() {
    gameState.gandalf.angle = gameState.rotation;

    // GAME OVER: Ends update() execution
    if (gameState.gameOver) {
      return;
    }

    // ???? LEFT: Rotate left
    if (gameState.cursors.left.isDown) {
      gameState.rotation -= 3.5;
      gameState.arrowLeft.anims.play("leftGreen", true);
    }
    // ???? RIGHT: Rotate right
    else if (gameState.cursors.right.isDown) {
      gameState.rotation += 3.5;
      gameState.arrowRight.anims.play("rightGreen", true);
    } else {
      gameState.arrowRight.anims.play("rightGrey", true);
      gameState.arrowLeft.anims.play("leftGrey", true);
    }

    // ???? UP: Move forward
    if (gameState.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed,
        gameState.gandalf.body.velocity
      );
      gameState.gandalf.anims.play("walk", true);
      gameState.arrowUp.anims.play("upGreen", true);

      // ???? DOWN: Move backwards
    } else if (gameState.cursors.down.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed -
          gameState.rotationSpeed -
          gameState.rotationSpeed,
        gameState.gandalf.body.velocity
      );
      gameState.gandalf.anims.play("walk", true);
      gameState.arrowDown.anims.play("downGreen", true);

      // NO KEY: Stop movement
    } else {
      gameState.gandalf.setAcceleration(0);
      gameState.gandalf.setVelocity(0);
      gameState.arrowUp.anims.play("upGrey", true);
      gameState.arrowDown.anims.play("downGrey", true);
    }

    // [  SPACE  ]: Shoot
    if (Phaser.Input.Keyboard.JustDown(gameState.spacebar)) {
      this.createShot();
      gameState.spaceKey.anims.play("spaceGreen", true);
    } else {
      gameState.spaceKey.anims.play("spaceGrey", true);
    }

    if (gameState.cursors.space.isDown) {
      gameState.spaceKey.anims.play("spaceGreen", true);
    } else {
      gameState.spaceKey.anims.play("spaceGrey", true);
    }

    // SHOT ORC COLLIDER

    this.physics.add.collider([orcs], gameState.shot, this.hitOrcs, null, this);

    this.physics.add.collider(
      bushes1,
      gameState.shot,
      this.hitBush,
      null,
      this
    );
    this.physics.add.collider(
      bushes2,
      gameState.shot,
      this.hitBush,
      null,
      this
    );
    this.physics.add.collider(
      bushes3,
      gameState.shot,
      this.hitBush,
      null,
      this
    );
    this.physics.add.collider(
      bushes4,
      gameState.shot,
      this.hitBush,
      null,
      this
    );

    // YOU WIN

    if (gameState.score >= 3) {
      this.physics.pause();
      practiceSong.stop();
      gameState.gameOver = true;

      const startGame = this.add.sprite(400, 300, "startGameBtn").setScale(0.4);
      startGame.setInteractive();
      startGame.on("pointerover", () =>
        startGame.anims.play("startGameBtnHover", true)
      );
      startGame.on("pointerout", () =>
        startGame.anims.play("startGameBtnOut", true)
      );
      startGame.on("pointerdown", () => {
        this.scene.stop("PracticeScene");
        this.scene.start("Game");
        confirmSound.play();
      });
    }

    this.turnOrcs(orcs);

    // GAME OVER
  }

  restartGame() {
    gameState.gameOver = false;
    gameState.score = 0;
    this.scene.restart();
  }

  createOrcs() {
    orcs = this.physics.add.group({
      key: "orc",
      repeat: 2,
      setXY: { x: 200, y: 50, stepX: 100 },
      setScale: { x: 0.8, y: 0.8 },
      immovable: true,
    });
  }

  createShot() {
    // SHOT EQUATIONS
    let y = 500 * Math.sin((Math.PI * 2 * gameState.gandalf.angle) / 360);
    let x = 500 * Math.cos((Math.PI * 2 * gameState.gandalf.angle) / 360);

    // SHOT SOURCE POSITION
    gameState.shot = this.physics.add.sprite(
      gameState.gandalf.x,
      gameState.gandalf.y,
      "shot"
    );
    // SHOT MOVEMENT DIRECTION

    gameState.shot.setVelocity(x, y);

    gameState.gandalf.anims.play("shoot", true);

    console.log("hello");

    var magicShot = this.sound.add("magicShot", { volume: 0.6 });
    magicShot.play();
  }

  hitOrcs(orc, shots) {
    orc.destroy();
    shots.destroy();
    gameState.score += 1;
    gameState.scoreText.setText(`Kills: ${gameState.score}`);
    var hitDummy = this.sound.add("dummyHit", { detune: -300 });
    hitDummy.play();
    var orcShoot = this.sound.add("shoot", { volume: 0.2 });
    orcShoot.play();
  }

  hitBush(bush, shots) {
    shots.destroy();
  }

  turnOrcs = function (type) {
    type.getChildren().forEach(function (item) {
      let angle =
        Phaser.Math.RAD_TO_DEG *
        Phaser.Math.Angle.Between(
          item.x,
          item.y,
          gameState.gandalf.x,
          gameState.gandalf.y
        );
      item.setAngle(angle + 270);
    });
  };
}
