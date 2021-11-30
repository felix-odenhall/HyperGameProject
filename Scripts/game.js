import Phaser from "phaser";
import bg from "../images/background_stone.png";
import gandalf from "../images/wizzard_sprite.png";
import shot from "../images/shot.png";
import gandalfShoot from "../images/gandalf_shoot_sprite.png";
import darkness from "../images/darkness.png";

let orcs;
let positions;
let spawnTime = 980;

const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
  speedBoost: 1,
  gandalfBoost: 10,
  rotation: 270,
  rotationSpeed: 150,
  score: 0,
  highScore: [1, 1, 1, 1, 1],
};

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }
  preload() {
    this.load.image(
      "orc", // ORC
      "https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png"
    );
    this.load.spritesheet("gandalf", gandalf, {
      frameWidth: 32,
      frameHeight: 28,
    });

    this.load.spritesheet("gandalfShoot", gandalfShoot, { frameWidth: 32, frameHeight: 28 });

    // this.load.image(
    //   "gandalf", // GANDALF
    //   "https://content.codecademy.com/courses/learn-phaser/physics/codey.png"
    // );
    this.load.image(
      "shot", // SHOT
      shot
    );
    this.load.image("background", bg);

    this.load.image("darkness", darkness);
  }

  create() {


    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers("gandalfShoot", { start: 0, end: 3, }),
      frameRate: 20,
      repeat: 0
    })

    this.add.image(400, 300, "background").setScale(1);
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
      .setCollideWorldBounds(true)
      .setScale(1.5)
      .setBodySize(20, 20);
    gameState.gandalf.rotation = -1.56;

    this.anims.create({

      key: 'shoot',
      frames: this.anims.generateFrameNumbers('gandalfShoot', { start: 0, end: 3, }),
      frameRate: 20,
      repeat: 0
    })

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('gandalf', { start: 0, end: 6, }),
      frameRate: 20,
      repeat: 0
    })

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("gandalf", { frame: 4 }),
      frameRate: 1,
      repeat: 0,
    });
    // this.physics.world.addCollider(orcs, gameState.shot)

    this.physics.add.collider(orcs, orcs);

    console.log(gameState.gandalf);

    this.add.image(400, 300, "darkness").setDepth(3);

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE

    gameState.scoreText = this.add
      .text(600, 25, `Kills: ${gameState.score}`, {
        fontSize: "32px",
        fill: "#FFF",
      })
      .setDepth(4);
  }

  update() {
    gameState.gandalf.angle = gameState.rotation;

    // GAME OVER: Ends update() execution
    if (gameState.gameOver) {
      gameState.gandalf.anims.play("idle");
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

      gameState.gandalf.anims.play('walk', true)



      // 🡻 DOWN: Move backwards
    } else if (gameState.cursors.down.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed -
        gameState.rotationSpeed -
        gameState.rotationSpeed,
        gameState.gandalf.body.velocity
      );

      gameState.gandalf.anims.play('walk', true)


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

    this.physics.add.collider([orcs], gameState.shot, this.hitOrcs, null, this);
    // this.physics.add.overlap(orcs, gameState.shot, function (shots, orc) {
    //   orc.destroy();
    //   shots.destroy();
    //   gameState.score += 1;
    //   gameState.scoreText.setText(`Kills: ${gameState.score}`);
    // });

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

      // Checks if this is a new high score
      this.addToHighScore(gameState.score);

      this.add
        .text(positions.centerX, positions.centerY, "GAME OVER", {
          fontSize: "120px",
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

      this.input.on("pointerup", () => {
        var highScoreList = document.getElementById("high-score");
        if (document.getElementById("high-score")) {
          highScoreList.parentNode.removeChild(highScoreList);
        }
        this.restartGame();
      });
      return;
    });

    let randomOrcSpawn = Math.floor(Math.random() * 1000);

    if (randomOrcSpawn > spawnTime) {
      this.addOrcs();
      spawnTime -= gameState.speedBoost / 10;
      gameState.gandalfSpeed += gameState.speedBoost / gameState.gandalfBoost;
    }
    this.orcDirection()
    this.turnOrcs(orcs);

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

    gameState.shot.setVelocity(x, y)

    gameState.gandalf.anims.play('shoot', true)

    console.log("hello")

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
  }

  orcDirection() {
    Phaser.Utils.Array.Each(
      orcs.getChildren(),
      this.physics.moveToObject,
      this.physics,
      gameState.gandalf,
      50
    );
  }

  hitOrcs(orc, shots) {
    orc.destroy();
    shots.destroy();
    gameState.score += 1;
    gameState.scoreText.setText(`Kills: ${gameState.score}`);

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

  addToHighScore = function (score) {
    const min = Math.min(...gameState.highScore);
    console.log(min);

    if (score > min) {
      gameState.highScore.sort(function (a, b) {
        return a - b;
      });
      gameState.highScore.shift();
      gameState.highScore.push(score);

      let div = document.createElement("div");
      let ol = document.createElement("ol");
      let h2 = document.createElement("h2");
      div.id = "high-score";
      h2.innerText = "New High Score!";
      div.appendChild(h2);
      div.appendChild(ol);
      document.querySelector("body").appendChild(div);

      let sortedHighScore = gameState.highScore.sort(function (a, b) {
        return a - b;
      });
      sortedHighScore.reverse();

      for (let i = 0; i < sortedHighScore.length; ++i) {
        let li = document.createElement("li");
        li.innerText = sortedHighScore[i];
        ol.appendChild(li);
        console.log("Done");
      }
    }
    return;
  };
}
