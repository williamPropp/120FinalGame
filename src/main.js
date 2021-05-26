'use strict';

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 720,
    physics: {
        default: 'matter',
        arcade: {
            debug: true,
            gravity: {
                x: 0.01,
                y: 0
            }
        },
        matter: {
            debug: true,
            gravity: { y: 10 },
            setBounds: {
                left: true,
                right: true,
                up: true,
                down: true
            }
        }
    },
    scene: [Menu, Options, Play, PlayMenu]
}

let game = new Phaser.Game(config);

let keySPACE, keyLEFT, keyRIGHT, keyESC;

//lists of contracts and upgrades
let contractInfo = ['Motivation','You invested all','your money in','this. Good luck', 'lol']
let upgrades = ['Contracts', 'Marketing', 'Farmers', 'Exploitation', 'Raisins', 'Files'];

// Often used locations coordinates
let screenWidth = game.config.width;
let screenHeight = game.config.height;
let screenCenterX = game.config.width / 2;
let screenCenterY = game.config.height / 2;

//Cheat Code Booleans
let moneyCheat = false;

//game.cache = new this.Phaser.Cache.CacheManager(game);
//let baseCache = game.cache.addCustom('info');

