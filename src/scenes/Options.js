class Options extends Phaser.Scene {
    constructor() {
        super("optionsScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
    }

    create() {

        this.textConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.optionsText = this.add.text(game.config.width/2, game.config.height/2, 'Options Menu Goes Here', this.textConfig).setOrigin(0.5,0.5);

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }
    }


}