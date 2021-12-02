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
import battleMusic from "../images/battle.mp3";
import metalMusic from "../images/metal.mp3";

// Added this for async function
import 'regenerator-runtime/runtime'

let orcs;
let positions;
let spawnTime = 980;
let newOrc;
let battleSong;
let shadows;
let metalSong;

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO52r8EjTyMiiUxIlpWCvJy0uulgdqruE",
  authDomain: "hypergame-2a26d.firebaseapp.com",
  databaseURL: "https://hypergame-2a26d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hypergame-2a26d",
  storageBucket: "hypergame-2a26d.appspot.com",
  messagingSenderId: "875434823954",
  appId: "1:875434823954:web:d596ac0decd4fe14ffa3cb",
  measurementId: "G-Z82EZ95YDF"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(app);

//Importing data from FireStore
var highScoreCollection = [];
db.collection("highScoreList").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    highScoreCollection.push(doc.data());
  });

  console.log("After reading from firestore,  highScoreCollection : ", JSON.stringify(highScoreCollection));

});

const gameState = {
  gameOver: false,
  orcSpeed: 40,
  rotation: 270,
  rotationSpeed: 360,
  score: 0,
  highScore: [
    { name: "empty", score: 0 },
    { name: "empty", score: 0 },
    { name: "empty", score: 0 },
    { name: "empty", score: 0 },
    { name: "empty", score: 0 },
  ],
};

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }
  preload() {
    this.load.spritesheet("gandalf", gandalf, {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet("gandalfShoot", gandalfShoot, {
      frameWidth: 48,
      frameHeight: 48,
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
    this.load.audio("metalMusic", metalMusic);
    this.load.audio("magicShot", magicShot);
    this.load.audio("battleMusic", battleMusic);

    // If a high score is stored in localStorage, it will replace the gameState.highScore array.
    if (localStorage.getItem("highScores")) {
      let local = JSON.parse(localStorage.getItem("highScores"));
      gameState.highScore = local;
    }
  }

  create() {
    battleSong = this.sound.add("battleMusic", { volume: 0.5 });
    battleSong.play();

    this.anims.create({
      key: "shoot",
      frames: this.anims.generateFrameNumbers("gandalfShoot", {
        start: 0,
        end: 4,
      }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: "orcSprite",
      frames: this.anims.generateFrameNumbers("orc", { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1,
    });

    this.add.image(400, 300, "background").setScale(1);

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
    gameState.enter = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS

    orcs = this.physics.add.group();

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
      .sprite(positions.centerX, positions.centerY, "gandalf")
      .setCollideWorldBounds(true)
      .setScale(1)
      .setBodySize(30, 30);
    gameState.gandalf.rotation = -1.56;

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

    this.physics.add.collider(orcs, orcs);

    shadows = this.add.image(400, 300, "darkness").setDepth(3);

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE

    let h3 = document.createElement("h3");
    h3.innerHTML = `Score: ${gameState.score}`;
    document.body.appendChild(h3);
  }

  update() {
    // CHEATS CHEATS CHEATS CHEATS CHEATS CHEATS CHEATS CHEATS CHEATS

    if (Phaser.Input.Keyboard.JustDown(gameState.enter)) {
      battleSong.pause();
      this.physics.pause();
      var cheat = prompt("");
      switch (cheat) {
        case "":
          this.physics.resume();
          battleSong.resume();
          break;
        case "robin hood":
          this.physics.resume();
          battleSong.resume();
          gameState.score += 1000;
          break;
        case "resign":
          gameState.gameOver = true;
          var playerDead = this.sound.add("dead");
          playerDead.autoplay = true;
          playerDead.play();
          break;
        case "i r ass":
          this.physics.resume();
          battleSong.resume();
          localStorage.clear();
          break;
        // case "i r winner":
        //   this.physics.resume();
        //   battleSong.resume();
        //   gameState.score += 5000;
        //     break;
        case "i hate darkness":
          shadows.destroy();
          this.physics.resume();
          battleSong.resume();
          break;

        // case "metal":
        //   this.physics.resume();
        //   metalSong = this.sound.add("metalMusic")
        //   battleSong.stop()
        //   metalSong.play()
        //   break;
      }
    }

    gameState.gandalf.angle = gameState.rotation;

    // GAME OVER: Ends update() execution
    if (gameState.gameOver) {
      gameState.gandalf.anims.play("idle");
      battleSong.stop();
      return;
    }

    // 🡸 PRESS LEFT: Rotate left
    if (gameState.cursors.left.isDown) {
      gameState.rotation -= 3.5;

      // 🡺 PRESS RIGHT: Rotate right
    } else if (gameState.cursors.right.isDown) {
      gameState.rotation += 3.5;
    }

    // 🡹 PRESS UP: Move forward
    if (gameState.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        gameState.gandalf.rotation,
        gameState.rotationSpeed / 2,
        gameState.gandalf.body.velocity
      );

      gameState.gandalf.anims.play("walk", true);

      // 🡻 PRESS DOWN: Move backwards
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
    if (Phaser.Input.Keyboard.JustDown(gameState.spacebar)) {
      this.createShot();
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

      // Store the data
      gameState.highScore = highScoreCollection;

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

    // SPEED BOOST SETTINGS SPEED BOOST SETTINGS SPEED BOOST SETTINGS SPEED BOOST SETTINGS

    if (randomOrcSpawn > spawnTime) {
      this.addOrcs();
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
    if (gameState.score > 0) {
      gameState.score -= 1;
    }
    document.querySelector("h3").innerHTML = `Score: ${gameState.score}`;
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

    if (gameState.score > 100) {
      spawnTime = 975;
    } else {
      spawnTime = 980;
    }
  }

  // UPDATE END - - - UPDATE END - - - UPDATE END - - - UPDATE END - - - UPDATE END - - - UPDATE END - - - UPDATE END - - - UPDATE END - - - UPDATE END

  orcDirection() {
    Phaser.Utils.Array.Each(
      orcs.getChildren(),
      this.physics.moveToObject,
      this.physics,
      gameState.gandalf,
      gameState.orcSpeed
    );
  }

  // HIT ORC HIT ORC HIT ORC HIT ORC HIT ORC HIT ORC HIT ORC

  hitOrcs(orc, shots) {
    orc.destroy();
    shots.destroy();
    gameState.score += 3;
    document.querySelector("h3").innerHTML = `Score: ${gameState.score}`;

    var orcShoot = this.sound.add("shoot");
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

  // PRINT HIGH SCORE BOARD - PRINT HIGH SCORE BOARD - PRINT HIGH SCORE BOARD

  printScoreBoard = function () {
    let div = document.createElement("div");
    let ol = document.createElement("ol");
    let h2 = document.createElement("h2");
    div.id = "high-score";
    h2.innerText = "High Score!";
    div.appendChild(h2);
    div.appendChild(ol);
    document.querySelector("body").appendChild(div);

    // Sorts gameState.highScore from highest to lowest score.
    gameState.highScore.sort((a, b) => {
      return b.score - a.score;
    });

    //Loops through the high score array and prints the score board.
    // One entry per list item.
    for (let i = 0; i < gameState.highScore.length; ++i) {
      let li = document.createElement("li");
      li.innerText =
        gameState.highScore[i].name + " " + gameState.highScore[i].score;
      ol.appendChild(li);
    }
  };

  addToHighScore = function (score) {
    // If the new score is higher than the 5th (lowest) highscore.
    if (score > gameState.highScore[4].score) {
      var username = prompt("Enter Player Name");
      // Removes the last (lowest entry) object in the array.
      gameState.highScore.pop();
      // Adds the new score and username in the end of the high score array.
      gameState.highScore.push({ name: username, score: score });
      // Sorts the array of high score entries again.
      gameState.highScore.sort(function (a, b) {
        return b.score - a.score;
      });

      // Prints the new score board.
      this.printScoreBoard();

      // Updating all the documents into the firestore
      // TODO: Only one document should be updated for the new user in the firestore
      updateAllFromCollection("highScoreList");

      // Makes a string of the sorted high score object and saves it to localStorage.
      localStorage.setItem("highScores", JSON.stringify(gameState.highScore));
    }
    return;
  };
}

//Funcion which updates all player names with their scores into the firestore database
const updateAllFromCollection = async (collectionName) => {
  const collection = db.collection(collectionName);
  var index = 0;
  collection.get().then(response => {
    let batch = db.batch()
    response.docs.forEach((doc) => {
      const docRef = db.collection(collectionName).doc(doc.id)
      batch.update(docRef, gameState.highScore[index++])
    })
    batch.commit().then(() => {
      console.log("updated all documents inside collectionName");
    })
  })
}
