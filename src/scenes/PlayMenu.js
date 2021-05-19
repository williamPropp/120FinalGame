class PlayMenu extends Phaser.Scene {
    constructor() {
        super("playMenuScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('manilla', 'manilla.png');
    }

    create() {
        console.log('play menu');
        this.tester = this.add.image(80, 50, 'manilla').setOrigin(0, 0);
        console.log(this.tester)
        this.textConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }
    }


}