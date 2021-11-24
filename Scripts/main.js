import Phaser from "phaser";
import StartScene from "./startScene";
import Game from "./game";

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#4488aa",
  scene: [StartScene, Game],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

var game = new Phaser.Game(config);
