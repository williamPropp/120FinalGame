'use strict';

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0.01,
                y: 0
            }
        },
        matter: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

let keySPACE, keyLEFT, keyRIGHT, keyESC;
