import Phaser from "phaser";


const gameState = {

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
    }
    
    create ()
    {
        gameState.gandalf = this.physics.add.sprite(200, 200, 'gandalf')
        .setCollideWorldBounds(true);
    
        gameState.orc = this.physics.add.sprite(600, 300, 'orc')
        .setImmovable() 
    
        this.physics.add.collider(gameState.gandalf, gameState.orc, () => {
            this.physics.pause()
            this.add.text(400, 300, 'GAME OVER', { fontSize: "32px", fill: "#ffffff"})
            this.input.on("pointerup", () => {
                this.scene.restart()
            })
        });

        gameState.cursors = this.input.keyboard.createCursorKeys();


    }
    
    update ()
    {
        if (gameState.cursors.up.isDown){
            gameState.gandalf.setVelocityY(-200);
        } else if (gameState.cursors.down.isDown){
            gameState.gandalf.setVelocityY(200);
        } else {gameState.gandalf.setVelocityY(0)}
        if (gameState.cursors.left.isDown){
            gameState.gandalf.setVelocityX(-200);
        } else if (gameState.cursors.right.isDown){
            gameState.gandalf.setVelocityX(200);
        } else {gameState.gandalf.setVelocityX(0)}
    }


}