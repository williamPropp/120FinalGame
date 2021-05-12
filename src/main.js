'use strict';

let config = {
    type: Phaser.Canvas,
    width: 960,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [/*Menu,*/ Play]
}

let game = new Phaser.Game(config);

let keySPACE, keyLEFT, keyRIGHT, keyESC;
