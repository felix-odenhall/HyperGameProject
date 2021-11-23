import { World } from "matter";
import Phaser from "phaser";

let orcs;

const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
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
    this.load.image("cursor", "assets/sprites/drawcursor.png");
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

      Phaser.Utils.Array.Each(
        orcs.getChildren(),
        this.physics.moveToObject,
        this.physics,
        gameState.gandalf,
        50
      );
    }

    const orcGenLoop = this.time.addEvent({
      delay: 1000,
      callback: addOrcs,
      callbackScope: this,
      loop: true,
    });

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
      .sprite(600, 500, "gandalf")
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

    if (gameState.score >= 5) {
      this.physics.pause();
      gameState.gameOver = true;

      this.add.text(400, 300, "YOU WIN", {
        fontSize: "32px",
        fill: "#ffffff",
      });

      this.input.on("pointerup", () => {
        this.restartGame();
      });
    }

    // GAME OVER

    this.physics.add.collider(gameState.gandalf, orcs, () => {
      this.physics.pause();
      gameState.gameOver = true;

      this.add.text(400, 300, "GAME OVER", {
        fontSize: "32px",
        fill: "#ffffff",
      });

      this.input.on("pointerup", () => {
        this.restartGame();
      });
    });
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
}
