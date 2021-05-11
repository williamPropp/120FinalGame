class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
    }

    create() {
        //Define keys
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    }

    update() {
        //Start game when SPACE is pressed
        if(this.keySPACE.isDown) {
            this.scene.start("playScene");
        }
    }
}