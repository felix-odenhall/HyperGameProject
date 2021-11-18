import Phaser from "phaser";


const gameState = {

    gandalfSpeed: 2
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

        gameState.gandalf = this.physics.add.sprite(600, 500, 'gandalf')
        .setCollideWorldBounds(true);
    
        gameState.orc = this.physics.add.sprite(600, 300, 'orc')
        .setImmovable() 

        gameState.orc2 = this.physics.add.sprite(600, 200, 'orc')
        .setImmovable() 

        this.physics.add.collider(gameState.gandalf, gameState.orc, () => {
            this.physics.pause()
            this.add.text(400, 300, 'GAME OVER', { fontSize: "32px", fill: "#ffffff"})
            this.input.on("pointerup", () => {
                this.scene.restart()
            })
        });

        gameState.cursors = this.input.keyboard.createCursorKeys();

        gameState.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    }

    
    update ()
    {

        // function  createShot(){
        //     const shots = this.physics.add.group();
        //     shots.create(600, 500, 'shot')
        // }
        
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
            gameState.shots.setVelocityY(-200)
            this.physics.add.collider(gameState.orc, gameState.shots, function (orc, shots){
                orc.destroy()
                shots.destroy()
            })
        }
    }
    


}