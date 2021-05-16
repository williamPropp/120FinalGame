class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('circle', 'circle.png');
        this.load.image('wall', 'bagWall.png');
        this.load.image('base', 'bagBase.png');
        this.load.atlas('bag_info', 'bag.png', 'bagIcon.json');
        this.load.json('bag_physics', 'bag.json');
        this.load.image('conveyor', 'conveyor.png');
        this.load.audio('dispense', 'dispenserNoise.wav');
    }

    create() {

        //Initialize data variables
        // this.Y_GRAVITY = 2600;
        // this.matter.world.gravity.y = this.Y_GRAVITY;
        this.matter.world.setBounds(0, 0, 960, 720);
        this.matter.world.setGravity(0, 1); 
        this.frameCount = 0;
        this.flowRate = 7; //How often in ms to spawn Ingredients
        this.money = 50; //Starting cash

        //Max amount of Ingredient that can fit in 1 kg bag
        this.maxPeanuts = 1000;
        this.maxRaisins = 2000;
        this.maxMNMs = 909;
        this.maxAlmonds = 769;
        
        //Initialize Arrays;
        this.ingredientTypeArray = ["peanut", "raisin", "m&m", "almond"];

        //Initialize location variables
        
        //Initialize UI coordinate variables

        //Add boolean flags
        this.paused = false;
        this.spawnIngredientLoop = false;

        //Add music to the scene
        // this.soundtrack = this.sound.add('soundtrack', {
        //     volume: 0.3,
        //     //rate: 0.9,
        //     loop: true,
        // });
        // this.soundtrack.play();


        this.clickTarget;
        

        this.bg = this.add.rectangle(0, 0, screenWidth, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        this.conveyor = this.matter.add.image(250, 500, 'conveyor').setIgnoreGravity(true).setStatic(true);;
        //this.matter.add.image(this.conveyor);//.body.setImmovable(true).setAllowGravity(false);


        this.dispOne = this.add.rectangle(250, 50, 100, 200, 0xD3D3D3).setOrigin(0 ,0);
        this.dispTwo = this.add.rectangle(370, 50, 100, 200, 0xD3D3D3).setOrigin(0 ,0);
        this.dispThree = this.add.rectangle(490, 50, 100, 200, 0xD3D3D3).setOrigin(0 ,0);

        this.bagWallOne = this.matter.add.image(430, 200,'wall');
        this.matter.add.image(430, 80,'ball');
        this.matter.add.image(430, 100,'ball');
        this.matter.add.image(430, 120,'ball');
        // this.bagWallOne1 = this.add.sprite(53, 400,'wall');
        // this.bagBase = this.add.sprite(0, 80, 'base');
        // this.bagWallTwo = this.add.sprite(150, 400, 'wall');
        // this.bagWallTwo2 = this.add.sprite(153, 400, 'wall');
        // this.container = this.add.container(100, 10);
        // this.container.setSize(100, 200);
        //this.matter.add.image(this.bagWallOne);//.setGravity(0, 2300);//.body.setImmovable(true).setAllowGravity(false).setMass(1000000).pushable = false;
        //this.bagWallOne.setVelocity(10,20);
        // this.matter.add.image(this.bagWallOne1);//.body.setImmovable(true).setAllowGravity(false).setMass(1000000).pushable = false;
        // this.matter.add.image(this.bagBase);//.body.setImmovable(true).setAllowGravity(false).pushable = false;
        // this.matter.add.image(this.bagWallTwo);//.body.setImmovable(true).setAllowGravity(false).setMass(1000000).pushable = false;
        // this.matter.add.image(this.bagWallTwo2);//.body.setImmovable(true).setAllowGravity(false).setMass(1000000).pushable = false;
        // this.matter.add.image(this.container);
        //this.container.add(this.bagWallOne);
        // this.container.add(this.bagBase);
        //this.container.add(this.bagWallTwo);
        // this.bagWallOne.body.collideWorldBounds = true;
        // this.bagBase.body.collideWorldBounds = true;
        // this.bagWallTwo.body.collideWorldBounds = true;
        // this.container.body.collideWorldBounds = true;


        this.inform = this.cache.json.get('bag_physics');
        this.bag = this.matter.add.image(400, 400, 'bag_info', 'bag.png',{ shape: this.inform.bag });
        // this.bag.body.collideWorldBounds = true;

        // this.bagOut = this.add.rectangle(450, 300, 100, 100, 0xD3D3D3).setOrigin(0 ,0);
        // this.bagIn = this.add.rectangle(451, 300, 98, 99, 0xFFFFFF).setOrigin(0 ,0);
        // this.matter.add.image(this.bagOut);
        // this.matter.add.image(this.bagIn).setIgnoreGravity(false);
        // this.bagOut.setData('gravityEnabled','false');
        // this.bagIn.setData('gravityEnabled','false');

        this.scale = this.add.rectangle(game.config.width - 225, 477, game.config.width/5, game.config.height/16, 0x808080).setOrigin(0 ,0);
        this.scaleChart = this.add.rectangle(game.config.width - 225, 550, game.config.width/5, game.config.height/5, 0x808080).setOrigin(0 ,0);
        this.tube = this.add.rectangle(775, 0, 100, 350, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(725, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);

        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.matter.add.image(this.floor);
        // this.floor.setData('gravityEnabled','false');
        //this.floor.body.collideWorldBounds = true;

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

        this.button1 = this.add.circle(300, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        this.button2 = this.add.circle(420, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        this.button3 = this.add.circle(540, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        this.buttons = this.add.group();
        this.buttons.addMultiple([this.button1, this.button2, this.button3]);
        // this.physics.add.existing(this.button, 1);
        // this.physics.world.enable(this.button, 1);
        // this.buttonBox = this.button.body;
        // this.buttonBox.setCircle(game.config.width/16);
        for(let b of this.buttons.getChildren()) {
            b.setInteractive({
                draggable: false,
                useHandCursor: true
            });
            b.setDataEnabled();
        }
        this.button1.data.set('numIngredients', this.maxPeanuts);
        this.button2.data.set('numIngredients', this.maxRaisins);
        this.button3.data.set('numIngredients', this.maxMNMs);
        // this.button1.setInteractive({
        //     draggable: false,
        //     useHandCursor: true
        // });


        this.moneyText = this.add.text(10, 20, 'Money: $'+this.money, {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'});
        
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            // console.log(pointer);
            // console.log(gameObject);
            // console.log(event);
            this.clickTarget = gameObject;
            this.clickOn(gameObject);
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            // console.log(pointer);
            // console.log(gameObject);
            // console.log(event);
            this.clickTarget = null;
            this.clickOff();
        });

        // //Create bags of Ingredients used to refill dispensers
        // this.peanutBag = this.matter.add.group({
        //     classType: Phaser.GameObjects.Sprite,
        //     defaultKey: null,
        //     defaultFrame: null,
        //     active: true,
        //     maxSize: this.maxPeanuts,
        //     runChildUpdate: false,
        //     createCallback: null,
        //     removeCallback: null,
        //     createMultipleCallback: null
        // });

        // this.raisinBag = this.physics.add.group({
        //     classType: Phaser.GameObjects.Sprite,
        //     defaultKey: null,
        //     defaultFrame: null,
        //     active: true,
        //     maxSize: this.maxRaisins,
        //     runChildUpdate: false,
        //     createCallback: null,
        //     removeCallback: null,
        //     createMultipleCallback: null
        // });
        
        // this.MNMBag = this.physics.add.group({
        //     classType: Phaser.GameObjects.Sprite,
        //     defaultKey: null,
        //     defaultFrame: null,
        //     active: true,
        //     maxSize: this.maxMNMs,
        //     runChildUpdate: false,
        //     createCallback: null,
        //     removeCallback: null,
        //     createMultipleCallback: null
        // });
        
        // this.almondBag = this.physics.add.group({
        //     classType: Phaser.GameObjects.Sprite,
        //     defaultKey: null,
        //     defaultFrame: null,
        //     active: true,
        //     maxSize: this.maxAlmonds,
        //     runChildUpdate: false,
        //     createCallback: null,
        //     removeCallback: null,
        //     createMultipleCallback: null
        // });

        //ingredients physics group
        this.ingredients = this.matter.add.sprite({
            classType: Phaser.Physics.Matter.Sprite,
            defaultKey: null,
            defaultFrame: null,
            active: true,
            maxSize: -1,
            runChildUpdate: false,
            createCallback: null,
            removeCallback: null,
            createMultipleCallback: null,
        });

        // this.physics.add.collider(this.ingredients, this.ingredients);
        // this.physics.add.collider(this.floor, this.ingredients);
        // this.physics.add.collider(this.ingredients, this.bag);
        // this.physics.add.collider(this.bagWallOne, this.ingredients);
        // this.physics.add.collider(this.ingredients, this.bagWallOne);
        // this.physics.add.collider(this.bagBase, this.ingredients);
        // this.physics.add.collider(this.bagWallTwo, this.ingredients);
        // this.physics.add.collider(this.ingredients, this.bagWallTwo);
        // this.physics.add.collider(this.bagWallOne, this.conveyor);
        // this.physics.add.collider(this.bagBase, this.conveyor);
        // this.physics.add.collider(this.bagWallTwo, this.conveyor);
        // this.physics.add.collider(this.conveyor, this.ingredients);
        // this.physics.add.collider(this.conveyor, this.container);

        //Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update() {
        //How many frames have elapsed since the start of the scene
        this.frameCount++;

        // for(let i of this.ingredients.getChildren()){
        //     if(i.x > game.config.width + i.width || i.y > game.config.height + i.height) {
        //         i.destroy();
        //     }
        // }

        if(!this.isPaused){
            this.moneyText.setText('Money: $'+this.money);
            let isDispenser = false;
            for(let i of this.buttons.getChildren()) {
                if(this.clickTarget == i) {
                    isDispenser = true;
                }
            }
            if(this.spawnIngredientLoop && this.frameCount % this.flowRate == 0 && isDispenser && this.clickTarget.getData('numIngredients') > 0) {
                this.sound.play('dispense');
                let spawnedIngredient;
                if(this.clickTarget == this.button1) {
                    this.button1.setData('numIngredients', (this.button1.getData('numIngredients')) - 1);
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, 'peanut', this.container).setOrigin(0,0);
                } else if(this.clickTarget == this.button2) {
                    this.button2.setData('numIngredients', (this.button2.getData('numIngredients')) - 1);
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, 'raisin', this.container).setOrigin(0,0);
                } else if(this.clickTarget == this.button3) {
                    this.button3.setData('numIngredients', (this.button3.getData('numIngredients')) - 1);
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, 'm&m', this.container).setOrigin(0,0);
                } else {
                    // Spawn random ingredient
                    console.log(this.clickTarget);
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, this.ingredientTypeArray[Math.floor(Math.random()*this.ingredientTypeArray.length)], this.container).setOrigin(0,0);
                }
                //Add ingredient to ingredient group and change hitbox to circle
                // this.ingredients.add(spawnedIngredient);
                let ingredientHitBox = spawnedIngredient.body;
                ingredientHitBox.setCircle(spawnedIngredient.height/2);
                // spawnedIngredient.body.collideWorldBounds = true; //Stay within the game frame
                console.log('ingredients left = ' + this.clickTarget.getData('numIngredients'))
            }
            for(let i of this.ingredients.getChildren()){
                if(this.container.body.hitTest(i.x,i.y) == true) {
                    i.setVelocity(this.container.body.velocity.x, this.container.body.velocity.y)
                }
            }
        }
        
        //Go back to menu when you press ESC
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }

        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.bag.setVelocity(10, 0);

        }
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.bag.setVelocity(-10, 0);
            // this.bagWallOne.body.setVelocity(0, 0);
            // this.bagWallOne1.body.setVelocity(0, 0);
            // this.container.body.setVelocity(0,0);
            // this.bagWallTwo.body.setVelocity(0, 0);
            // this.bagWallTwo2.body.setVelocity(0, 0);
        }

    }

    collided() {
        //console.log('collision occured');
    }

    clickOn() {
        console.log('button clicked');
        // let x = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.width-100);
        // let y = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.height-100);
        this.spawnIngredientLoop = true;
    }

    clickOff() {
        //console.log('click over');
        this.spawnIngredientLoop = false;
    }
    // // Call this method when spending any amount of money
    // spendCash(spent) {
    //     this.money -= spent;
    // }

    //Calculates money made from selling trail mix bag
    //Mix will be an array of the weight of each ingredient contained in the bag: [peanuts, raisins, m&ms, almonds] 
    // sellMix(mix){
    //     this.money += (0.0214 * mix[0] + 0.0208 * mix[1] / 0.5 + 0.0745 * mix[2] / 1.1 + 0.0465 * mix[3] / 1.3);         
    // }

    //Calculates the total weight of the trail mix bag and percentage of each ingredient in bag
    //Mix will be an array of the weight of each ingredient contained in the bag: [peanuts, raisins, m&ms, almonds] 
    // weightAndPercentage(mix){
    //     let totalWeight = mix[0] + mix[1] + mix[2] + mix[3];
    //     console.log("Total weight of bag: " + totalWeight);
    //     console.log("Peanut %: " + mix[0] / totalWeight);
    //     console.log("Raisin %: " + mix[1] / totalWeight);
    //     console.log("M&M %: " + mix[2] / totalWeight);
    //     console.log("Almond %: " + mix[3] / totalWeight);
    // }

    // makePauseMenu() {
    //     this.paused = true;
    //     this.add.rectangle(game.config.width / 2, game.config.height / 2, )
    // }

}