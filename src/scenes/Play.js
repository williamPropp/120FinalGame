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
        this.bg = this.add.rectangle(0, 0, game.config.width, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        this.conveyor = this.add.rectangle(0, 450, game.config.width - 250, game.config.height/10, 0x000000).setOrigin(0 ,0);

        this.bin = this.add.rectangle(25, 600, 100, 200, 0x808080).setOrigin(0 ,0);
        this.bin.setInteractive();
        this.input.setDraggable(this.bin);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('dragend', function(pointer, gameObject, dragX, dragY, dropped) {
            gameObject.x = 25;
            gameObject.y = 600;
        });

        this.button = this.add.circle(game.config.width - 200, game.config.height/4, game.config.width/8, 0xFF2255).setOrigin(0.5,0.5);
        this.button.setInteractive({
            draggable: false,
            useHandCursor: false
        });
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            // console.log(pointer);
            // console.log(gameObject);
            // console.log(event);
            this.clickOn();
        });

        //Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {

    }

    clickOn() {
        console.log('button clicked');
        //this.button.setTint(0x0000FF);
    }
}