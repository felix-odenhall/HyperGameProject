import { World } from "matter";
import Phaser from "phaser";

let orcs;
const gameState = {

    gandalfSpeed: 4,
    score: 0,
    gameOver: false
};


export default class Game extends Phaser.Scene {
    
    preload ()
    {
        this.load.image(
            "orc",
            "https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png"
            );
        this.load.image(
            "gandalf",
            "https://content.codecademy.com/courses/learn-phaser/physics/codey.png"
            );
        this.load.image(
            "shot",
            "https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png"
            );

    }

    
    create ()
    {

        orcs = this.physics.add.group()

        function addOrcs(){
            const xCord = Math.random() * 800;
            const yCord = Math.random() * 300;
            orcs.create(xCord, yCord, 'orc')
        }

        // for(let i = 0; i < 8; i++) {
        //     addOrcs();
        // }

        const orcGenLoop = this.time.addEvent({
            delay: 500,
            callback: addOrcs,
            callbackScope: this,
            loop: true
        })

        gameState.gandalf = this.physics.add.sprite(600, 500, 'gandalf')
        .setCollideWorldBounds(true);
    

        this.physics.add.collider(gameState.gandalf, orcs, () => {
            // this.physics.pause();
            // this.scene.restart();
            orcGenLoop.destroy()
            gameState.gameOver = true
            this.add.text(400, 300, 'GAME OVER', { fontSize: "32px", fill: "#ffffff"})
            this.input.on("pointerup", () => {
            this.restartGame()
            })
        });

        gameState.cursors = this.input.keyboard.createCursorKeys();

        gameState.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        gameState.scoreText = this.add.text(100, 100, `Kills: ${gameState.score}`, {
            fontSize: "32px",
            fill: "#FFF"
        })

    }


    update ()
    {

        // function  createShot(){
        //     const shots = this.physics.add.group();
        //     shots.create(600, 500, 'shot')
        // }
        if (gameState.gameOver)
		{
			return
		}
        
        if (gameState.cursors.up.isDown){
            // gameState.gandalf.setVelocityY(-200);
            gameState.gandalf.y -= gameState.gandalfSpeed
        } else if (gameState.cursors.down.isDown){
            gameState.gandalf.y += gameState.gandalfSpeed
        } else {gameState.gandalf.setVelocityY(0)}
        if (gameState.cursors.left.isDown){
            gameState.gandalf.x -= gameState.gandalfSpeed
        } else if (gameState.cursors.right.isDown){
            gameState.gandalf.x += gameState.gandalfSpeed
        } else {gameState.gandalf.setVelocityX(0)}
        if (Phaser.Input.Keyboard.JustDown(gameState.spacebar)){
            gameState.shots = this.physics.add.group();
            gameState.shots.create(gameState.gandalf.x, gameState.gandalf.y, 'shot')
            gameState.shots.setVelocityY(gameState.gandalfSpeed * - 100)

            this.physics.add.collider(orcs, gameState.shots, function (orc, shots){
                orc.destroy();
                shots.destroy();
                gameState.score += 1
                gameState.scoreText.setText(`Kills: ${gameState.score}`)
            }) 
        }
        if(gameState.score >= 20){
            this.restartGame();
        }
    }

    restartGame(){
        gameState.gameOver = false
        gameState.score = 0
        this.scene.restart();
    }
    


}