import { World } from "matter";
import Phaser from "phaser";

let orcs;

const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
  rotation: 0,
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
  }

  create() {
    // CURSORS CURSORS CURSORS CURSORS CURSORS CURSORS CURSORS

    gameState.cursors = this.input.keyboard.createCursorKeys();
    gameState.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS

    orcs = this.physics.add.group();

    function addOrcs() {
      const xCord = Math.random() * 800;
      const yCord = Math.random() * 300;
      orcs.create(xCord, yCord, "orc");
    }

    const orcGenLoop = this.time.addEvent({
      delay: 500,
      callback: addOrcs,
      callbackScope: this,
      loop: true,
    });

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
      .sprite(600, 500, "gandalf")
      .setCollideWorldBounds(true);
    gameState.gandalf.rotation = -1.56;

    this.physics.add.collider(gameState.gandalf, orcs, () => {
      orcGenLoop.destroy();
      gameState.gameOver = true;
      this.add.text(400, 300, "GAME OVER", {
        fontSize: "32px",
        fill: "#ffffff",
      });
      this.input.on("pointerup", () => {
        this.restartGame();
      });
    });

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE
    gameState.scoreText = this.add.text(100, 100, `Kills: ${gameState.score}`, {
      fontSize: "32px",
      fill: "#FFF",
    });
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
        140,
        gameState.gandalf.body.velocity
      );
      // 🡻 DOWN: Move backwards
    } else if (gameState.cursors.down.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        -140,
        gameState.gandalf.body.velocity
      );
      // NO KEY: Stop movement
    } else {
      gameState.gandalf.setAcceleration(0);
      gameState.gandalf.setVelocity(0);
    }

    // [  SPACE  ]: Shoot
    if (Phaser.Input.Keyboard.JustDown(gameState.spacebar)) {
      gameState.shots = this.physics.add.group();

      this.physics.add.collider(orcs, gameState.shots, function (orc, shots) {
        orc.destroy();
        shots.destroy();
        gameState.score += 1;
        gameState.scoreText.setText(`Kills: ${gameState.score}`);
      });

      // SHOT EQUATIONS
      let y = 500 * Math.sin((Math.PI * 2 * gameState.gandalf.angle) / 360);
      let x = 500 * Math.cos((Math.PI * 2 * gameState.gandalf.angle) / 360);

      // SHOT SOURCE POSITION
      let shot = this.physics.add.sprite(
        gameState.gandalf.x,
        gameState.gandalf.y,
        "shot"
      );
      // SHOT MOVEMENT DIRECTION
      shot.setVelocity(x, y);
    }

    if (gameState.score >= 20) {
      gameState.gameOver = true;
      this.add.text(400, 300, "YOU WIN", { fontSize: "32px", fill: "#ffffff" });
      this.input.on("pointerup", () => {
        this.restartGame();
      });
    }
  }
  restartGame() {
    gameState.gameOver = false;
    gameState.score = 0;
    this.scene.restart();
  }
}
