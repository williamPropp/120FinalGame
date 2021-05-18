class Play extends Phaser.Scene {
    constructor() {
        super("playScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('circle', 'circle.png');
        this.load.image('contract', 'Contract.png');
        this.load.image('wall', 'bagWall.png');
        this.load.image('base', 'bagBase.png');
        this.load.atlas('bag_info', 'bag.png', 'bagIcon.json');
        this.load.json('bag_physics', 'bag.json');
        this.load.image('conveyor', 'conveyor.png');
        this.load.audio('dispense', 'dispenserNoise2.mp3');
    }

    create() {

        //Initialize data variables
        this.matter.world.setBounds(0, 0, 960, 720);
        this.matter.world.setGravity(0, 7); 
        this.frameCount = 0;
        this.flowRate = 5; //How often in frames to spawn Ingredients
        this.money = 50; //Starting cash

        //Max amount of Ingredient that can fit in 1 kg bag
        this.maxPeanuts = 1000;
        this.maxRaisins = 2000;
        this.maxMNMs = 909;
        this.maxAlmonds = 769;
        
        //Initialize Arrays;
        this.ingredientTypeArray = ["peanut", "raisin", "m&m", "almond"];

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

        //Text configs
        this.defaultTextConfig = {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'};

        //Keep track of clickTarget globally
        this.clickTarget;
        
        this.bg = this.add.rectangle(0, 0, screenWidth, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        this.conveyor = this.matter.add.image(250, 500, 'conveyor').setIgnoreGravity(true).setStatic(true);;
        //this.matter.add.image(this.conveyor);//.body.setImmovable(true).setAllowGravity(false);

        //Grey dispenser rectangles
        this.dispOne = this.add.rectangle(250, 0, 100, 250, 0xD3D3D3).setOrigin(0, 0);
        this.dispTwo = this.add.rectangle(370, 0, 100, 250, 0xD3D3D3).setOrigin(0, 0);
        this.dispThree = this.add.rectangle(490, 0, 100, 250, 0xD3D3D3).setOrigin(0, 0);

        //Black rectangles behind dispenser meters
        this.add.rectangle(300, 150, 25, 75, 0x000000).setOrigin(0.5, 1);
        this.add.rectangle(420, 150, 25, 75, 0x000000).setOrigin(0.5, 1);
        this.add.rectangle(540, 150, 25, 75, 0x000000).setOrigin(0.5, 1);

        //Meters to gauge how full a dispenser is
        this.dispOneMeter = this.add.rectangle(300, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);
        this.dispTwoMeter = this.add.rectangle(420, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);
        this.dispThreeMeter = this.add.rectangle(540, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);

        //Dispenser buttons
        this.button1 = this.add.circle(300, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        this.button2 = this.add.circle(420, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        this.button3 = this.add.circle(540, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        this.buttons = this.add.group();
        this.buttons.addMultiple([this.button1, this.button2, this.button3]); //Make dispenser button group

        //Make all dispenser buttons interactable
        for(let b of this.buttons.getChildren()) {
            b.setInteractive({
                draggable: false,
                useHandCursor: true
            });
            b.setDataEnabled();
        }

        //Set max ingredients for each dispenser
        this.button1.data.set('numIngredients', this.maxPeanuts);
        this.button1.data.set('maxIngredients', this.maxPeanuts);
        this.button2.data.set('numIngredients', this.maxRaisins);
        this.button2.data.set('maxIngredients', this.maxRaisins);
        this.button3.data.set('numIngredients', this.maxMNMs);
        this.button3.data.set('maxIngredients', this.maxMNMs);

        //Refill button for each dispenser
        this.dispOneRefill = this.add.circle(330, 100, 10, 0x0000FF).setOrigin(0.5, 0.5);
        this.dispTwoRefill = this.add.circle(450, 100, 10, 0x0000FF).setOrigin(0.5, 0.5);
        this.dispThreeRefill = this.add.circle(570, 100, 10, 0x0000FF).setOrigin(0.5, 0.6);
        this.refillButtons = this.add.group();
        this.refillButtons.addMultiple([this.dispOneRefill, this.dispTwoRefill, this.dispThreeRefill]); //Make refill button group

        //Make all refill buttons interactable
        for(let b of this.refillButtons.getChildren()) {
            b.setInteractive({
                draggable: false,
                useHandCursor: true
            });
            b.setDataEnabled();
            b.data.set('priceToRefill', 0);
            b.on('pointerover',() => {
                let priceText = this.add.text(b.x - 10, b.y - 50, 'this item costs $' + b.getData('priceToRefill') + ' to refill', this.defaultTextConfig);
                priceText.setScale(0.5);
                this.time.delayedCall(2000, () => {
                    priceText.destroy();
                });
            });
        }

        this.dispOneRefill.data.set('dispenser', this.button1);
        this.dispTwoRefill.data.set('dispenser', this.button2);
        this.dispThreeRefill.data.set('dispenser', this.button3);

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

        this.scale = this.add.rectangle(game.config.width - 120, 489, game.config.width/4, game.config.height/10, 0x808080).setOrigin(0 ,0);
        this.matter.add.gameObject(this.scale).setIgnoreGravity(true).setStatic(true);;
        this.scaleChart = this.add.rectangle(game.config.width - 225, 550, game.config.width/5, game.config.height/4, 0x808080).setOrigin(0 ,0);
        this.tube = this.add.rectangle(790, 0, 100, 350, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(725, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);
        this.contract = this.add.image(735, 60, 'contract').setOrigin(0 ,0);

        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.matter.add.image(this.floor);

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
            // console.log(`Dropped '${this.burrito.texture.key}' on '${target.texture.key}'`);
            // this.printMessage(`Dropped '${this.burrito.texture.key}' on '${target.texture.key}'`);
    
            // if (target.texture.key === 'dispenser') {
            //     this.bin.destroy();
            // }
        });

        //Add UI element to keep track on the player's money
        this.moneyText = this.add.text(10, 20, 'Money: $'+this.money, this.defaultTextConfig);
        
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
        // this.input.on('pointerover',(pointer, gameObject, event) => {
        //     this.hoverOn(gameObject);
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

        this.ingHolder = this.add.group();

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

        for(let i of this.ingHolder.getChildren()){
            if(i.x > game.config.width - 200) {//|| i.y > game.config.height + i.height) {
                i.destroy();
            }
        }

        if(!this.isPaused){
            this.moneyText.setText('Money: $'+this.money);
            this.dispOneMeter.height = (this.button1.getData('numIngredients') / this.maxPeanuts) * 75;
            this.dispTwoMeter.height = (this.button2.getData('numIngredients') / this.maxRaisins) * 75;
            this.dispThreeMeter.height = (this.button3.getData('numIngredients') / this.maxMNMs) * 75;

            if(this.spawnIngredientLoop && this.frameCount % this.flowRate == 0 && this.clickTarget.getData('numIngredients') > 0) {
                this.sound.play('dispense');
                let spawnedIngredient;
                if(this.clickTarget == this.button1) {
                    this.button1.setData('numIngredients', (this.button1.getData('numIngredients')) - 1);
                    this.dispOneRefill.setData('priceToRefill', Math.ceil((Math.abs(this.maxPeanuts - (this.button1.getData('numIngredients')))) * 0.0029));
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, 'peanut', this.container).setOrigin(0.5,0.5);
                } else if(this.clickTarget == this.button2) {
                    this.button2.setData('numIngredients', (this.button2.getData('numIngredients')) - 1);
                    this.dispTwoRefill.setData('priceToRefill', Math.ceil((Math.abs(this.maxRaisins - (this.button2.getData('numIngredients')))) * 0.0023));
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, 'raisin', this.container).setOrigin(0.5,0.5);
                } else if(this.clickTarget == this.button3) {
                    this.button3.setData('numIngredients', (this.button3.getData('numIngredients')) - 1);
                    this.dispThreeRefill.setData('priceToRefill', Math.ceil((Math.abs(this.maxMNMs - (this.button3.getData('numIngredients')))) * 0.056));
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, 'm&m', this.container).setOrigin(0.5,0.5);
                } /*else {
                    // Spawn random ingredient
                    console.log(this.clickTarget);
                    spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', null, this.ingredientTypeArray[Math.floor(Math.random()*this.ingredientTypeArray.length)], this.container).setOrigin(0,0);
                }*/
                //Add ingredient to ingredient group and change hitbox to circle
                this.ingHolder.add(spawnedIngredient);
                // let ingredientHitBox = spawnedIngredient.body;
                // ingredientHitBox.setCircle(spawnedIngredient.height/2);
                // spawnedIngredient.body.collideWorldBounds = true; //Stay within the game frame
                console.log('ingredients left = ' + this.clickTarget.getData('numIngredients'))
            }
            // for(let i of this.ingredients.getChildren()){
            //     if(this.container.body.hitTest(i.x,i.y) == true) {
            //         i.setVelocity(this.container.body.velocity.x, this.container.body.velocity.y)
            //     }
            // }
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

    clickOn(gObj) {
        console.log('button clicked');
        // let x = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.width-100);
        // let y = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.height-100);
        // for(let r of this.refillButtons.getChildren()) {
        //     if(gObj == r) {
        //         buyIngredients(gObj);
        //     }
        // }
        
            
        for(let b of this.buttons.getChildren()) {
            if(gObj == b) {
                this.spawnIngredientLoop = true;
            }
        }

        for(let r of this.refillButtons.getChildren()) {
            if(gObj == r) {
                this.buyIngredients(r);
                
            }
        }
    }

    clickOff() {
        //console.log('click over');
        this.spawnIngredientLoop = false;
    }

    // hoverOn(gObj) {
    //     console.log(gObj);
    //     let priceText;
    //     if(gObj == this.dispOneRefill) {
    //         priceText = this.add.text(this.dispOneRefill.x,this.dispOneRefill.y, 'this item costs $' /*+ b.getData('priceToRefill')*/, this.defaultTextConfig);
    //         priceText.setScale(0.5);
    //         console.log('disp1refill');
    //     } else if(gObj == this.dispTwoRefill) {
    //         priceText = this.add.text(this.dispTwoRefill.x,this.dispTwoRefill.y, 'this item costs $' /*+ b.getData('priceToRefill')*/, this.defaultTextConfig);
    //         priceText.setScale(0.5);
    //     } else if(gObj == this.dispThreeRefill) {
    //         priceText = this.add.text(this.dispThreeRefill.x,this.dispThreeRefill.y, 'this item costs $' /*+ b.getData('priceToRefill')*/, this.defaultTextConfig);
    //         priceText.setScale(0.5);
    //     }  
        
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

    // Call this method when spending any amount of money
    spendCash(spent) {
        this.money -= spent;
    }

    buyIngredients(gObj) {
        let priceToBuy = gObj.getData('priceToRefill');
        if(this.money - priceToBuy > 0) {
            this.spendCash(priceToBuy);
            // if(gObj == this.dispOneRefill) {
            //     this.dispOneRefill.setData('numIngredients', this.dispOneRefill.getData('maxIngredients'));
            // } else if(gObj == this.dispTwoRefill) {
            //     this.dispOneRefill.setData('numIngredients', this.dispOneRefill.getData('maxIngredients'));
            // } else if(gObj == this.dispThreeRefill) {
            //     this.dispOneRefill.setData('numIngredients', this.dispOneRefill.getData('maxIngredients'));
            // }
            let disp = gObj.getData('dispenser');
            disp.setData('numIngredients', disp.getData('maxIngredients'));
            gObj.setData('priceToRefill', 0);
            console.log(disp.getData('numIngredients'));
            console.log(disp.getData('maxIngredients'));
        } else {
            this.insufficientFunds(priceToBuy);
        }
    }

    insufficientFunds(price) {
        let insFundText = this.add.text(game.config.width/2-50, game.config.height/2-100, 'You do not have enough funds, you need $' + price + ' to purchase', this.defaultTextConfig).setOrigin(0.5,0.5);
        insFundText.setScale(0.4);
        this.time.delayedCall(2000, () => {
            insFundText.destroy();
        });
    }

}



// Matter ideas
// Matter.Body.translate(body, translation) // Moves a body by a given vector relative to its current position, without imparting any velocity.
// body.restitution // A Number that defines the restitution (elasticity) of the body. The value is always positive and is in the range (0, 1). A value of 0 means collisions may be perfectly inelastic and no bouncing may occur. A value of 0.8 means the body may bounce back with approximately 80% of its kinetic energy. Note that collision response is based on pairs of bodies, and that restitution values are combined with the following formula:
// body.sleepThreshold //A Number that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the Matter.Sleeping module (if sleeping is enabled by the engine).
// body.slop //A Number that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies. Avoid changing this value unless you understand the purpose of slop in physics engines. The default should generally suffice, although very large bodies may require larger values for stable stacking.