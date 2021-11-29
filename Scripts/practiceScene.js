console.log("GameScene");
import { World } from "matter";
import Phaser from "phaser";
import bg from "../images/background_stone.png";
import gandalf from "../images/wizzard_sprite.png";
import shot from "../images/shot.png";
import gandalfShoot from "../images/gandalf_shoot_sprite.png";

let orcs;
let positions;

const gameState = {
  gameOver: false,
  gandalfSpeed: 4,
  speedBoost: 1,
  gandalfBoost: 10,
  rotation: 0,
  rotationSpeed: 150,
  score: 0,
  tutorial: 0,
};

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'PracticeScene' })
  }
  preload() {
    this.load.image(
      "orc", // ORC
      "https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png"
    );
    this.load.spritesheet("gandalf", gandalf, { frameWidth: 32, frameHeight: 28 });

    this.load.spritesheet("gandalfShoot", gandalf, { frameWidth: 32, frameHeight: 28 });

    // this.load.image(
    //   "gandalf", // GANDALF
    //   "https://content.codecademy.com/courses/learn-phaser/physics/codey.png"
    // );
    this.load.image(
      "shot", // SHOT
      shot
    );
    this.load.image("background", bg);

  }

  create() {
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

    // ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS ORCS

    // orcs = this.physics.add.group();

    // GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF GANDALF

    gameState.gandalf = this.physics.add
    .sprite(positions.centerX, positions.centerY, "gandalf")
    .setCollideWorldBounds(true)
    .setScale(1.5)
    .setBodySize(20, 20)
    gameState.gandalf.rotation = -1.56;

    this.anims.create({
			key: 'shoot',
			frames: this.anims.generateFrameNumbers('gandalfShoot', { start: 0, end: 3, }),
			frameRate: 20,
            repeat: -1
		})

    this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('gandalf', { start: 0, end: 6, }),
			frameRate: 20,
			repeat: -1
		})

    this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('gandalf', { frame: 4 }),
			frameRate: 1,
			repeat: 0
		})
    // this.physics.world.addCollider(orcs, gameState.shot)

    // SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE SCORE

    gameState.scoreText = this.add.text(600, 25, `Kills: ${gameState.score}`, {
      fontSize: "32px",
      fill: "#FFF",
    }).setDepth(4);

    this.createOrcs()
    this.turnOrcs(orcs);
    this.physics.add.collider(orcs, gameState.gandalf)

  }

  update() {
    gameState.gandalf.angle = gameState.rotation;

    // GAME OVER: Ends update() execution
    if (gameState.gameOver) {
      gameState.gandalf.anims.play('idle')
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
      this.turnOrcs(orcs);


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
      this.turnOrcs(orcs);

      // NO KEY: Stop movement
    } else {
      gameState.gandalf.setAcceleration(0);
      gameState.gandalf.setVelocity(0);
      gameState.gandalf.anims.play('idle')
    }

    if(gameState.cursors.down.isDown){
        this.add.text(600, 200, 'Good, you are moving backwards!');
    }


    // [  SPACE  ]: Shoot
    if (Phaser.Input.Keyboard.JustDown(gameState.spacebar)) {
      this.createShot();
      gameState.gandalf.anims.play('shoot', true)
      console.log(gandalfShoot)
    }

    // SHOT ORC COLLIDER

    this.physics.add.collider([orcs], gameState.shot, this.hitOrcs, null, this);


    // YOU WIN

    if (gameState.score >= 3) {
      this.physics.pause();
      gameState.gameOver = true;

      this.add
        .text(positions.centerX, positions.centerY, "Good job, you are now ready for the real challenge", {
          fontSize: "20px",
          fill: "#ffffff",
        })
        .setOrigin(0.5, 0.5);

      this.input.on("pointerup", () => {
        this.scene.start('Game');
      });
    }

    // GAME OVER
  }

  restartGame() {
    gameState.gameOver = false;
    gameState.score = 0;
    this.scene.restart();
  }

  createOrcs()
  {
     orcs = this.physics.add.group({
          key: 'orc',
          repeat: 2,
          setXY: { x: 200, y: 50, stepX: 100 },
          setScale: { x: 0.65, y: 0.65 },
          immovable: true
      })
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
  }

  hitOrcs(orc, shots)
	{
    orc.destroy();
    shots.destroy();
    gameState.score += 1;
    gameState.scoreText.setText(`Kills: ${gameState.score}`);
	}

    turnOrcs = function (type) {
    type.getChildren().forEach(function(item) {
        let angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(
            item.x,
            item.y,
            gameState.gandalf.x,
            gameState.gandalf.y);
        item.setAngle(angle + 270);
        })
    }

}
