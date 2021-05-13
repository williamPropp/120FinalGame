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
        this.physics.world.gravity.y = this.Y_GRAVITY;
        
        //Max amount of Ingredient that can fit in 1 kg bag
        this.maxPeanuts = 1000;
        this.maxRaisins = 2000;
        this.maxMNMs = 909;
        this.maxAlmonds = 769;


        //Starting cash
        this.money = 50;
        
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

        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.physics.add.existing(this.floor);
        this.floor.setData('gravityEnabled','false');
        this.floor.body.collideWorldBounds = true;

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
        this.bin.on('drop', (pointer, target) => {
            // note: the message below will be superseded by the dragend event above
            console.log(`Dropped '${this.burrito.texture.key}' on '${target.texture.key}'`);
            this.printMessage(`Dropped '${this.burrito.texture.key}' on '${target.texture.key}'`);
            // put the burrito in the garbage
            if (target.texture.key === 'trash') {
                this.burrito.destroy();
            }
        });

        this.button = this.add.circle(game.config.width - 200, game.config.height/4, game.config.width/16, 0xFF0000).setOrigin(0.5,0.5);
        this.physics.add.existing(this.button, 1);
        this.physics.world.enable(this.button, 1);
        this.buttonBox = this.button.body;
        this.buttonBox.setCircle(game.config.width/16);
        this.button.setInteractive({
            draggable: false,
            useHandCursor: true
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

        //ingredients physics group
        this.ingredients = this.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: -1,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null
        });

        this.physics.add.collider(this.ingredients, this.ingredients);
        this.physics.add.collider(this.floor, this.ingredients);

    }

    update() {

    }

    collided() {
        console.log('collision occured');
    }

    clickOn() {
        console.log('button clicked');
        this.button.setData('fillColor', 0x0000FF);
        let x = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.width-100);
        let y = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.height-100);
        let spawnedIngredient = new Ingredient(this, x, y, 'square').setOrigin(0,0);
        this.ingredients.add(spawnedIngredient);
        spawnedIngredient.body.collideWorldBounds = true;
    }
    // Call this method when spending any amount of money
    spendCash(spent) {
        this.money -= spent;
    }

    //Calculates money made from selling trail mix bag
    //Mix will be an array of the weight of each ingredient contained in the bag: [peanuts, raisins, m&ms, almonds] 
    sellMix(mix){
        this.money += (0.0214 * mix[0] + 0.0208 * mix[1] / 0.5 + 0.0745 * mix[2] / 1.1 + 0.0465 * mix[3] / 1.3);         
    }

    //Calculates the total weight of the trail mix bag and percentage of each ingredient in bag
    //Mix will be an array of the weight of each ingredient contained in the bag: [peanuts, raisins, m&ms, almonds] 
    weightAndPercentage(mix){
        let totalWeight = mix[0] + mix[1] + mix[2] + mix[3];
        console.log("Total weight of bag: " + totalWeight);
        console.log("Peanut %: " + mix[0] / totalWeight);
        console.log("Raisin %: " + mix[1] / totalWeight);
        console.log("M&M %: " + mix[2] / totalWeight);
        console.log("Almond %: " + mix[3] / totalWeight);
    }

}