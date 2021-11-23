import { World } from "matter";
import Phaser from "phaser";
import bg from "../images/background.jfif";

let orcs;
let positions;
let spawnTime = 980;

const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
  speedBoost: 1,
  gandalfBoost: 10,
  rotation: 0,
  rotationSpeed: 150,
  score: 0,
};

export default class Game extends Phaser.Scene {
  preload() {
    this.load.image(
      "orc", // ORC
      "https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png"
    );
    this.load.image(
      "gandalf", // GANDALF
      "https://content.codecademy.com/courses/learn-phaser/physics/codey.png"
    );
    this.load.image(
      "shot", // SHOT
      "https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png"
    );
    this.load.image("background", bg);
  }

  create() {
    this.add.image(400, 300, "background").setScale(0.5);
    console.log(bg);

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

    orcs = this.physics.add.group();

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
      .sprite(positions.centerX, positions.centerY, "gandalf")
      .setCollideWorldBounds(true);
    gameState.gandalf.rotation = -1.56;

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE

    gameState.scoreText = this.add.text(100, 100, `Kills: ${gameState.score}`, {
      fontSize: "32px",
      fill: "#FFF",
    });

    console.log(gameState.gandalf);
  }

  update() {
    gameState.gandalf.angle = gameState.rotation;

    // GAME OVER: Ends update() execution
    if (gameState.gameOver) {
      return;
    }

    // 🡸 LEFT: Rotate left
    if (gameState.cursors.left.isDown) {
      gameState.rotation -= 3.5;

      // 🡺 RIGHT: Rotate right
    } else if (gameState.cursors.right.isDown) {
      gameState.rotation += 3.5;
    }

    // 🡹 UP: Move forward
    if (gameState.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed,
        gameState.gandalf.body.velocity
      );

      // 🡻 DOWN: Move backwards
    } else if (gameState.cursors.down.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed -
          gameState.rotationSpeed -
          gameState.rotationSpeed,
        gameState.gandalf.body.velocity
      );

      // NO KEY: Stop movement
    } else {
      gameState.gandalf.setAcceleration(0);
      gameState.gandalf.setVelocity(0);
    }

    // [  SPACE  ]: Shoot
    if (Phaser.Input.Keyboard.JustDown(gameState.spacebar)) {
      this.createShot();
    }

    // SHOT ORC COLLIDER

    this.physics.add.collider(orcs, gameState.shot, function (orc, shots) {
      orc.destroy();
      shots.destroy();
      gameState.score += 1;
      gameState.scoreText.setText(`Kills: ${gameState.score}`);
    });

    // YOU WIN

    if (gameState.score >= 5000) {
      this.physics.pause();
      gameState.gameOver = true;

      this.add
        .text(positions.centerX, positions.centerY, "YOU WIN", {
          fontSize: "120px",
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

      this.input.on("pointerup", () => {
        this.restartGame();
      });
    }

    // GAME OVER

    this.physics.add.collider(gameState.gandalf, orcs, () => {
      this.physics.pause();
      gameState.gameOver = true;

      this.add
        .text(positions.centerX, positions.centerY, "GAME OVER", {
          fontSize: "120px",
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

      this.input.on("pointerup", () => {
        this.restartGame();
      });
    });

    let randomOrcSpawn = Math.floor(Math.random() * 1000);

    if (randomOrcSpawn > spawnTime) {
      this.addOrcs();
      spawnTime -= gameState.speedBoost / 10;
      gameState.gandalfSpeed += gameState.speedBoost / gameState.gandalfBoost;
      console.log("Gandalf Speed :" + gameState.gandalfSpeed);
    }
  }

  restartGame() {
    gameState.gameOver = false;
    gameState.score = 0;
    this.scene.restart();
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
  }

  // ADDING ORCS
  addOrcs() {
    let randomDirection = Math.floor(Math.random() * 4);
    if (randomDirection == 0) {
      let newOrc = orcs
        .create(
          Math.floor(Math.random() * positions.rightEdge),
          positions.topEdge - 20,
          "orc"
        )
        .setScale(0.65);
    } else if (randomDirection == 1) {
      orcs
        .create(
          positions.rightEdge + 20,
          Math.floor(Math.random() * positions.bottomEdge),
          "orc"
        )
        .setScale(0.65);
    } else if (randomDirection == 2) {
      orcs
        .create(
          Math.floor(Math.random() * positions.rightEdge),
          positions.bottomEdge + 20,
          "orc"
        )
        .setScale(0.65);
    } else if (randomDirection == 3) {
      orcs
        .create(
          positions.leftEdge - 20,
          Math.floor(Math.random() * positions.bottomEdge),
          "orc"
        )
        .setScale(0.65);
    }
    Phaser.Utils.Array.Each(
      orcs.getChildren(),
      this.physics.moveToObject,
      this.physics,
      gameState.gandalf,
      50
    );
  }
}
