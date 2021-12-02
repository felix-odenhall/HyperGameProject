import Phaser from "phaser";
import bg from "../images/background_stone.png";
import bg2 from "../images/background_stone2.png";
import gandalf from "../images/wizzard_sprite2.png";
import shot from "../images/shot.png";
import gandalfShoot from "../images/gandalf_shoot_sprite2.png";
import darkness from "../images/darkness.png";
import orcSprite from "../images/orc_sprite.png";
import orcSprite2 from "../images/orc_sprite2.png";
import orcSprite3 from "../images/orc_sprite3.png";
import dead from "../images/dead.mp3";
import shoot from "../images/shoot.mp3";
import magicShot from "../images/magic.wav";
import battleMusic from "../images/battle.mp3"
import metalMusic from "../images/metal.mp3"

let orcs;
let positions;
let spawnTime = 980;
let newOrc;
let battleSong;
let shadows;
let metalSong;


const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
  speedBoost: 1,
  gandalfBoost: 10,
  rotation: 270,
  rotation2: 270,
  rotationSpeed: 150,
  score: 0,
  scoreP2: 0,
  highScore: [1, 1, 1, 1, 1],
};

export default class GameTwoPlayers extends Phaser.Scene {
  constructor() {
    super({ key: "GameTwoPlayers"});
  }
  preload() {
    this.load.spritesheet("gandalf", gandalf, {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("gandalfShoot", gandalfShoot, { 
      frameWidth: 48, 
      frameHeight: 48 
    });

    this.load.spritesheet("orc", orcSprite2, {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.image(
      "shot", // SHOT
      shot
    );
    this.load.image("background", bg2);

    this.load.image("darkness", darkness);

    this.load.audio("dead", dead);

    this.load.audio("shoot", shoot);

    // this.load.audio("metalMusic", metalMusic);


    this.load.audio("magicShot", magicShot);

    this.load.audio("battleMusic", metalMusic);

    // If a high score is stored in localStorage, it will replace the gameState.highScore array.
    if (localStorage.getItem("highScores")) {
      gameState.highScore = JSON.parse(localStorage.getItem("highScores"));
    }

  }

  create() {

    battleSong = this.sound.add("battleMusic", {volume: 0.6});
    battleSong.play()

    this.anims.create({
      key: 'shoot',
      frames: this.anims.generateFrameNumbers("gandalfShoot", { start: 0, end: 4, }),
      frameRate: 20,
      repeat: 0
    })

    this.anims.create({
      key: "orcSprite",
      frames: this.anims.generateFrameNumbers("orc", { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1,
    });

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
    gameState.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    //Player 2
    gameState.W = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    gameState.A = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    gameState.S = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    gameState.D = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    gameState.B = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.B
    );

    // ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS

    orcs = this.physics.add.group();

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
      .sprite(positions.centerX + 200, positions.centerY, "gandalf")
      .setCollideWorldBounds(true)
      .setScale(1)
      .setBodySize(30, 30);
    gameState.gandalf.rotation = -1.56;

    gameState.player2 = this.physics.add
    .sprite(positions.centerX - 200, positions.centerY, "gandalf")
    .setCollideWorldBounds(true)
    .setScale(1)
    .setBodySize(30, 30);
  gameState.gandalf.rotation2 = -1.56;

    this.anims.create({
      key: "shoot",
      frames: this.anims.generateFrameNumbers("gandalfShoot", {
        start: 0,
        end: 3,
      }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("gandalf", { start: 0, end: 6 }),
      frameRate: 12,
      repeat: 0,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("gandalf", { frame: 4 }),
      frameRate: 1,
      repeat: 0,
    });
    // this.physics.world.addCollider(orcs, gameState.shot)

    this.physics.add.collider(orcs, orcs);

    console.log(gameState.gandalf);

    shadows = this.add.image(400, 300, "darkness").setDepth(3);

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE

    
    let h3 = document.createElement("h3");
    h3.innerHTML = `Kills: ${gameState.score}`;
    document.body.appendChild(h3);
  }

  update() {

    gameState.gandalf.angle = gameState.rotation;

    // GAME OVER: Ends update() execution
    if (gameState.gameOver) {
      gameState.gandalf.anims.play("idle");
      battleSong.stop()
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

      gameState.gandalf.anims.play("walk", true);

      // 🡻 DOWN: Move backwards
    } else if (gameState.cursors.down.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed -
          gameState.rotationSpeed -
          gameState.rotationSpeed,
        gameState.gandalf.body.velocity
      );

      gameState.gandalf.anims.play("walk", true);

      // NO KEY: Stop movement
    } else {
      gameState.gandalf.setAcceleration(0);
      gameState.gandalf.setVelocity(0);
    }

    // [  SPACE  ]: Shoot
    if (Phaser.Input.Keyboard.JustDown(gameState.enter)) {
      this.createShot();
    }


    // PLAYER 2

    gameState.player2.angle = gameState.rotation2;

    if (gameState.A.isDown) {
      gameState.rotation2 -= 3.5;

      // 🡺 RIGHT: Rotate right
    } else if (gameState.D.isDown) {
      gameState.rotation2 += 3.5;
    }

        // 🡹 UP: Move forward
        if (gameState.W.isDown) {
          this.physics.velocityFromRotation(
            gameState.player2.rotation,
            gameState.rotationSpeed,
            gameState.player2.body.velocity
          );
    
          gameState.gandalf.anims.play("walk", true);
    
          // 🡻 DOWN: Move backwards
        } else if (gameState.S.isDown) {
          this.physics.velocityFromRotation(
            gameState.player2.rotation,
            gameState.rotationSpeed -
              gameState.rotationSpeed -
              gameState.rotationSpeed,
            gameState.player2.body.velocity
          );
    
          gameState.gandalf.anims.play("walk", true);
    
          // NO KEY: Stop movement
        } else {
          gameState.player2.setAcceleration(0);
          gameState.player2.setVelocity(0);
        }
    
        // [  SPACE  ]: Shoot
        if (Phaser.Input.Keyboard.JustDown(gameState.B)) {
          this.createShot2();
        }

    // SHOT ORC COLLIDER

    this.physics.add.collider([orcs], gameState.shot, this.hitOrcs, null, this);

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
      // Audio for StartScene
      var playerDead = this.sound.add("dead");
      playerDead.autoplay = true;
      playerDead.play();
      this.physics.pause();

      gameState.gameOver = true;
      // Checks if this is a new high score
      this.addToHighScore(gameState.score);

      document.querySelector("h1").setAttribute("style", "color: tomato");
      document.querySelector("h1").innerText = "Game Over";

      // this.orcs.anims.stop();
      this.input.on("pointerup", () => {
        var highScoreList = document.getElementById("high-score");
        if (document.getElementById("high-score")) {
          highScoreList.parentNode.removeChild(highScoreList);
        }
        document.querySelector("h1").setAttribute("style", "color: inherit");
        document.querySelector("h1").innerText = "Name of the Game";
        document.querySelector("h3").remove();

        // Updates the high score board, if a high score has ever been saved.
        if (localStorage.getItem("highScores")) {
          gameState.highScores = JSON.parse(localStorage.getItem("highScores"));
        }
        this.restartGame();
      });
      return;
    });

    // PLAYSER 2

    this.physics.add.collider(gameState.player2, orcs, () => {
      // Audio for StartScene
      var playerDead = this.sound.add("dead");
      playerDead.autoplay = true;
      playerDead.play();
      this.physics.pause();

      gameState.gameOver = true;
      // Checks if this is a new high score
      this.addToHighScore(gameState.score);

      document.querySelector("h1").setAttribute("style", "color: tomato");
      document.querySelector("h1").innerText = "Game Over";

      // this.orcs.anims.stop();
      this.input.on("pointerup", () => {
        var highScoreList = document.getElementById("high-score");
        if (document.getElementById("high-score")) {
          highScoreList.parentNode.removeChild(highScoreList);
        }
        document.querySelector("h1").setAttribute("style", "color: inherit");
        document.querySelector("h1").innerText = "Name of the Game";
        document.querySelector("h3").remove();

        // Updates the high score board, if a high score has ever been saved.
        if (localStorage.getItem("highScores")) {
          gameState.highScores = JSON.parse(localStorage.getItem("highScores"));
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
    this.orcDirection();
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

    gameState.shot.setVelocity(x, y);
    gameState.gandalf.anims.play("shoot", true);

    var magicShot = this.sound.add("magicShot");
    magicShot.play();

  }

  createShot2() {
    // SHOT EQUATIONS
    let y = 500 * Math.sin((Math.PI * 2 * gameState.player2.angle) / 360);
    let x = 500 * Math.cos((Math.PI * 2 * gameState.player2.angle) / 360);

    // SHOT SOURCE POSITION
    gameState.shot = this.physics.add.sprite(
      gameState.player2.x,
      gameState.player2.y,
      "shot"
    );
    // SHOT MOVEMENT DIRECTION

    gameState.shot.setVelocity(x, y);
    gameState.gandalf.anims.play("shoot", true);

    var magicShot = this.sound.add("magicShot");
    magicShot.play();

  }

  // ADDING ORCS
  addOrcs() {
    let randomDirection = Math.floor(Math.random() * 4);
    if (randomDirection == 0) {
      orcs
        .create(
          Math.floor(Math.random() * positions.rightEdge),
          positions.topEdge - 20
        )
        .setScale(0.8)
        .anims.play("orcSprite", true)
        .setBodySize(30, 30);
    } else if (randomDirection == 1) {
      orcs
        .create(
          positions.rightEdge + 20,
          Math.floor(Math.random() * positions.bottomEdge)
        )
        .setScale(0.8)
        .anims.play("orcSprite", true)
        .setBodySize(30, 30);
    } else if (randomDirection == 2) {
      orcs
        .create(
          Math.floor(Math.random() * positions.rightEdge),
          positions.bottomEdge + 20
        )
        .setScale(0.8)
        .anims.play("orcSprite", true)
        .setBodySize(30, 30);
      // newOrc.anims.play('orcSprite')
    } else if (randomDirection == 3) {
      orcs
        .create(
          positions.leftEdge - 20,
          Math.floor(Math.random() * positions.bottomEdge)
        )
        .setScale(0.8)
        .anims.play("orcSprite", true)
        .setBodySize(35, 35);

      // newOrc.anims.play('orcSprite')
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
    document.querySelector("h3").innerHTML = `Kills: ${gameState.score}`;

    var orcShoot = this.sound.add("shoot", {volume: 0.5} );
    orcShoot.play();
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
      // Makes a string of the sorted high score array and saves it in localStorage
      localStorage.setItem("highScores", JSON.stringify(sortedHighScore));
    }
    return;
  };
}
