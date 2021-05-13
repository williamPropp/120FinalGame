class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
    }

    create() {

        //Initialize data variables
        
        //Max amount of Ingredient that can fit in 1 kg bag
        this.maxPeanuts = 1000;
        this.maxRaisins = 2000;
        this.maxMNMs = 909;
        this.maxAlmonds = 769;

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
            // console.log(pointer);
            // console.log(gameObject);
            // console.log(event);
            this.clickOn();
        });

        //Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Create bags of Ingredients used to refill dispensers
        this.peanutBag = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: this.maxPeanuts,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });

        this.raisinBag = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: this.maxRaisins,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });
        
        this.MNMBag = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: this.maxMNMs,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });
        
        this.almondBag = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: this.maxAlmonds,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });

    }

    update() {

    }

    clickOn() {
        console.log('button clicked');
        //this.button.setTint(0x0000FF);
    }
}