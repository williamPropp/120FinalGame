class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
    }

    create() {

        //Initialize data variables

        //Initialize location variables
        
        //Initialize UI coordinate variables

        //Add boolean flags

        //Add music to the scene
        // this.soundtrack = this.sound.add('soundtrack', {
        //     volume: 0.3,
        //     //rate: 0.9,
        //     loop: true,
        // });
        // this.soundtrack.play();

        //Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {

    }
}