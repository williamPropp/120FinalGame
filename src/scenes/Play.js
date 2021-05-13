class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('square', 'square.png');
    }

    create() {

        //Initialize data variables
        this.Y_GRAVITY = 2600;
        
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

        this.button = this.add.circle(game.config.width/2, game.config.height/2, game.config.width/8, 0xFF2255).setOrigin(0.5,0.5);
        this.button.setInteractive({
            draggable: false,
            useHandCursor: false
        });
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            console.log(pointer);
            console.log(gameObject);
            console.log(event);
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
        this.button.setData('fillColor', 0x0000FF);
        let x = Phaser.clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.width-square.width);
        let y = Phaser.clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.height-square.height);
        new Ingredient(this, x, y, ).setOrigin(0,0);
    }


}