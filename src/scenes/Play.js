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
        this.load.audio('dispense', 'dispenserNoise.mp3');
        this.load.audio('emptyDispenser', 'dispenserEmpty.mp3');
    }

    create() {

        //Initialize data variables
        this.matter.world.setBounds(0, 0, 960, 720);
        this.matter.world.setGravity(0, 1); 
        this.frameCount = 0;
        this.flowRate = 5; //How often in frames to spawn Ingredients
        this.money;
        this.binWeight = 1000; //How many grams of ingredients can fit in one dispenser
        this.lift = false; //for sell action

        //Initialize player money based on previous gameplay
        if(localStorage.getItem('money') == null){
            this.money = 50.00;
            localStorage.setItem('money', this.money);
        }
        else{
            this.money = parseFloat(localStorage.getItem('money'));
        }
        
        //Initialize Upgrade Array
        this.upgradesArray = [['dispenser I', 250], 
            ['dispenser II', 500], 
            ['bag 2x', 100], 
            ['bag 4x', 1000], 
            ['bag 8x', 10000], 
            ['bag 16x', 100000], 
            ['lobby I', 100000], 
            ['lobby II', 250000], 
            ['lobby III', 500000]];
        
        this.upgradesAcquiredArray = [];

        //Keep track of multipliers
        this.bagMultiplier = 1;
        this.contractMultiplier = 1;
        this.lobbyMultiplier = 1;

       /* if(baseCache.exists('money')){
            this.money = baseCache.get('money');
        }
        else{
            this.money = 50; //Starting cash
            baseCache.add('money', this.money);
        }
        */

        //Add boolean flags
        this.paused = false;
        this.spawnIngredientLoop = false;
        this.priceCalculated = false;

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

        //Menu
        this.playMenu = this.add.rectangle(10, 100, 220, 100, 0x000000).setOrigin(0 ,0);
        this.playMenu.setInteractive({
            useHandCursor: true
        });
        this.playMenu.setDataEnabled;

        this.conveyor = this.matter.add.image(250, 500, 'conveyor').setIgnoreGravity(true).setStatic(true);
        //this.matter.add.image(this.conveyor);//.body.setImmovable(true).setAllowGravity(false);

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

        this.dispenseButtons = this.add.group();
        this.refillButtons = this.add.group();

        this.ingredientTypeArray = ['peanut','raisin', 'm&m', 'almond'];
        this.dispenserArray = [];

        this.peanutDispenser = new Dispenser(this, 250, 0, 'peanut');
        this.raisinDispenser = new Dispenser(this, 370, 0, 'raisin');
        this.MNMDispenser = new Dispenser(this, 490, 0, 'm&m');
        this.almondDispenser = new Dispenser(this, 610, 0, 'almond');

     /*   if(localStorage.getItem('numPeanuts') == null){
            localStorage.setItem('numPeanuts', this.peanutDispenser.numIngredients);
        }   
        if(localStorage.getItem('numRaisins') == null){
            localStorage.setItem('numRaisins', this.raisinDispenser.numIngredients)
        }
        if(localStorage.getItem('numM&Ms') == null){
            localStorage.setItem('numM&Ms', this.MNMDispenser.numIngredients)
        }      
        if(localStorage.getItem('numAlmonds') == null){
            localStorage.setItem('numAlmonds', this.almondDispenser.numIngredients)
        }
        */


       // for(let i = 0; i < 4; i++) {
       //     this.createDispenser(250 + (120 * i), 0, this.ingredientTypeArray[i]);
       // }

        //Meters to gauge how full a dispenser is
        // this.dispOneMeter = this.add.rectangle(300, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);
        // this.dispTwoMeter = this.add.rectangle(420, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);
        // this.dispThreeMeter = this.add.rectangle(540, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);

                                        //LOCAL STORAGE I GOTTA FIX IT MY BAD
                                        // if(localStorage.getItem('meterOneHeight') != null){
                                        //     this.dispOneMeter.height = localStorage.getItem('meterOneHeight');    
                                        // }
                                        // if(localStorage.getItem('meterTwoHeight') != null){
                                        //     this.dispTwoMeter.height = localStorage.getItem('meterTwoHeight');    
                                        // }
                                        // if(localStorage.getItem('meterThreeHeight') != null){
                                        //     this.dispThreeMeter.height = localStorage.getItem('meterThreeHeight');    
                                        // }


        //Dispenser buttons
        // this.button1 = this.add.circle(300, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        // this.button2 = this.add.circle(420, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);
        // this.button3 = this.add.circle(540, 200, game.config.width/32, 0xFF0000).setOrigin(0.5,0.5);

        // this.dispenseButtons = this.add.group();

        // this.dispenseButtons.addMultiple([this.button1, this.button2, this.button3]); //Make dispenser button group

        //Make all dispenser buttons interactable
        // for(let b of this.dispenseButtons.getChildren()) {
        //     b.setInteractive({
        //         draggable: false,
        //         useHandCursor: true
        //     });
        //     b.setDataEnabled();
        // }

        //Set max ingredients for each dispenser
        // this.button1.data.set('maxIngredients', this.maxPeanuts);
        // this.button2.data.set('maxIngredients', this.maxRaisins);
        // this.button3.data.set('maxIngredients', this.maxMNMs);

                                        //LOCAL STORAGE I GOTTA FIX MY BAD
                                        // if(localStorage.getItem('numPeanuts') == null){
                                        //     this.button1.data.set('numIngredients', this.maxPeanuts);
                                        // }
                                        // else{
                                        //     this.button1.data.set('numIngredients', localStorage.getItem('numPeanuts'));
                                        // }
                                        // if(localStorage.getItem('numRaisins') == null){
                                        //     this.button2.data.set('numIngredients', this.maxRaisins);
                                        // }
                                        // else{
                                        //     this.button2.data.set('numIngredients', localStorage.getItem('numRaisins'));
                                        // }
                                        // if(localStorage.getItem('numM&Ms') == null){
                                        //     this.button3.data.set('numIngredients', this.maxMNMs);
                                        // }
                                        // else{
                                        //     this.button3.data.set('numIngredients', localStorage.getItem('numM&Ms'));
                                        // }        
        

        //Refill button for each dispenser
        // this.dispOneRefill = this.add.circle(330, 100, 10, 0x0000FF).setOrigin(0.5, 0.5);
        // this.dispTwoRefill = this.add.circle(450, 100, 10, 0x0000FF).setOrigin(0.5, 0.5);
        // this.dispThreeRefill = this.add.circle(570, 100, 10, 0x0000FF).setOrigin(0.5, 0.6);

        // this.refillButtons = this.add.group();

        // this.refillButtons.addMultiple([this.dispOneRefill, this.dispTwoRefill, this.dispThreeRefill]);

        //Make all refill buttons interactable
        // for(let b of this.refillButtons.getChildren()) {
        //     b.setInteractive({
        //         draggable: false,
        //         useHandCursor: true
        //     });
        //     b.setDataEnabled();
        //     b.data.set('priceToRefill', 0);

        //     b.on('pointerover',() => {
        //         let priceText = this.add.text(b.x - 10, b.y - 50, 'this item costs $' + b.getData('priceToRefill') + ' to refill', this.defaultTextConfig);
        //         priceText.setScale(0.5);
        //         this.time.delayedCall(2000, () => {
        //             priceText.destroy();
        //         });
        //     });
        // }                    
                                        //LOCAL STORAGE I GOTTA FIX MY BAD
                                        // if(localStorage.getItem('refillOne$') != null){
                                        //     this.dispOneRefill.setData('priceToRefill', localStorage.getItem('refillOne$'));
                                        // }
                                        // if(localStorage.getItem('refillTwo$') != null){
                                        //     this.dispTwoRefill.setData('priceToRefill', localStorage.getItem('refillTwo$'));
                                        // }
                                        // if(localStorage.getItem('refillThree$') != null){
                                        //     this.dispThreeRefill.setData('priceToRefill', localStorage.getItem('refillThree$'));
                                        // }

        this.inform = this.cache.json.get('bag_physics');
        this.bag = this.matter.add.image(200, 400, 'bag_info', 'bag.png',{ shape: this.inform.bag });
        //this.bag.setCollisionGroup(1);
        //this.bag.setDensity(.5);
        //this.bag.setBounce(.5);
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
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
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

        //ingredients physics group
        // this.ingredients = this.matter.add.sprite({
        //     classType: Phaser.Physics.Matter.Sprite,
        //     defaultKey: null,
        //     defaultFrame: null,
        //     active: true,
        //     maxSize: -1,
        //     runChildUpdate: false,
        //     createCallback: null,
        //     removeCallback: null,
        //     createMultipleCallback: null,
        // });

        // this.ingHolder = this.add.group();
        //this.ingHolder.setCollisionGroup(1);

        // this.physics.add.collider(this.ingredients, this.ingredients);
        // this.physics.add.collider(this.floor, this.ingredients);
        // this.physics.add.collider(this.ingredients, this.bag);
        //this.physics.matter.add.collider(this.bagWallOne, this.ingredients);
        //this.physics.add.collider(this.ingredients, this.bagWallOne);
        // this.physics.add.collider(this.bagBase, this.ingredients);
        //this.physics.add.collider(this.bagWallTwo, this.ingredients);
        //this.physics.add.collider(this.ingredients, this.bagWallTwo);
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

        // this.testIng = new Ingredient(this, game.config.width/2, game.config.width/2, 'circle', null, 'peanut', this.container).setOrigin(0.5,0.5)
        // this.testIng.body.density = 1;
        // this.testIng.body.slop = 0;
        // this.testIng.body.friction = 1;

    }

    update() {
        //How many frames have elapsed since the start of the scene
        this.frameCount++;
        //console.log(this.bag.x - this.bag.width/2);


        if(!this.isPaused){
            // this.dispOneMeter.height = (this.button1.getData('numIngredients') / this.maxPeanuts) * 75;
            // this.dispTwoMeter.height = (this.button2.getData('numIngredients') / this.maxRaisins) * 75;
            // this.dispThreeMeter.height = (this.button3.getData('numIngredients') / this.maxMNMs) * 75;

                                    //LOCAL STORAGE I GOTTA FIX MY BAD
                                    // localStorage.setItem('meterOneHeight', this.dispOneMeter.height);
                                    // localStorage.setItem('meterTwoHeight', this.dispTwoMeter.height);
                                    // localStorage.setItem('meterThreeHeight', this.dispThreeMeter.height);

            if(this.spawnIngredientLoop && this.frameCount % this.flowRate == 0) {
                for(let d of this.dispenseButtons.getChildren()) {
                    if(d == this.clickTarget) {
                        let dispPrefab = this.clickTarget.getData('prefab');
                        dispPrefab.spawnIngredient();
                    }
                }

                // let spawnedIngredient;
                // if(this.clickTarget == this.button1) {
                    // this.button1.setData('numIngredients', (this.button1.getData('numIngredients')) - 1);
                    // this.dispOneRefill.setData('priceToRefill', Math.ceil((Math.abs(this.maxPeanuts - (this.button1.getData('numIngredients')))) * 0.0029));
                    // localStorage.setItem('refillOne$', this.dispOneRefill.getData('priceToRefill'));
                    // localStorage.setItem('numPeanuts', this.button1.getData('numIngredients'));
                    // spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', 'peanut'/*, this.container*/).setOrigin(0.5,0.5);
                // } else if(this.clickTarget == this.button2) {
                    // this.button2.setData('numIngredients', (this.button2.getData('numIngredients')) - 1);
                    // this.dispTwoRefill.setData('priceToRefill', Math.ceil((Math.abs(this.maxRaisins - (this.button2.getData('numIngredients')))) * 0.0023));
                    // localStorage.setItem('refillTwo$', this.dispTwoRefill.getData('priceToRefill'));
                    // localStorage.setItem('numRaisins', this.button2.getData('numIngredients'));
                    // spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle','raisin'/*, this.container*/).setOrigin(0.5,0.5);
                // } else if(this.clickTarget == this.button3) {
                    // this.button3.setData('numIngredients', (this.button3.getData('numIngredients')) - 1);
                    // this.dispThreeRefill.setData('priceToRefill', Math.ceil((Math.abs(this.maxMNMs - (this.button3.getData('numIngredients')))) * 0.056));
                    // localStorage.setItem('refillThree$', this.dispThreeRefill.getData('priceToRefill'));
                    // localStorage.setItem('numM&Ms', this.button3.getData('numIngredients'));
                    // spawnedIngredient = new Ingredient(this, this.clickTarget.x+((Math.floor(Math.random()*25)-12)), this.clickTarget.y, 'circle', 'm&m'/*, this.container*/).setOrigin(0.5,0.5);
                // }

                //spawnedIngredient.setCollisionGroup(1);

            }

            //Calculate bag value and weight when on the scale
            if(this.bag.x > 840 && !this.priceCalculated) {
                this.priceCalculated = true;

                //Calculate which ingredients are in the bag, then add them to an array
                let bagContentsArray = [];
                for(let i of this.ingHolder.getChildren()) {
                    if(i.x > this.bag.x - (this.bag.width / 2) && i.x < this.bag.x + (this.bag.width / 2) && i.y > this.bag.y - (this.bag.height/2) && i.y < this.bag.y + (this.bag.height/2)) {
                        bagContentsArray.push(i);
                    }
                }
                
                //Use the array to calculate the bag's weight, price and ingredient percents
                let value = parseFloat(this.calculatePrice(bagContentsArray));
                let weight = parseFloat(this.calculateWeight(bagContentsArray));
                let percentages = this.calculatePercentages(bagContentsArray);

                //Display bag's price and weight
                let weightText = this.add.text(700, 350, 'this bag weighs ' + weight + 'g', this.defaultTextConfig).setOrigin(0.5,0.5);
                let valueText = this.add.text(700, 380, 'this bag is worth $' + value, this.defaultTextConfig).setOrigin(0.5,0.5);
                weightText.setScale(0.5);
                valueText.setScale(0.5);

                //Display bag's ingredient percents
                let percentageOffset = 30;
                if(percentages != null) {
                    for(let p of percentages) {
                        let percentText = this.add.text(850, 580 + (percentageOffset * percentages.indexOf(p)), p[0] + ' : ' + p[1] + '%', this.defaultTextConfig).setOrigin(0.5,0.5);
                        percentText.setScale(0.5);
                        this.time.delayedCall(2000, () => {
                            percentText.destroy();
                        });
                    }
                }

                //After the player gets a chance to read everything, reset bag and ingredients
                this.time.delayedCall(2000, () => {
                    weightText.destroy();
                    valueText.destroy();
                    this.lift = true;
                    this.bag.setVelocity(0, -20);
                    this.time.delayedCall(550, () => {
                        this.getCash(value);
                        this.ingHolder.clear(true, true);
                        this.bag.setPosition(200, 400);
                        this.priceCalculated = false;
                        this.lift = false;
                    });
                    for(let i of this.ingHolder.getChildren()){
                        if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                            // console.log("left called");
                            i.setVelocity(0,-20);
                        }
                    }
                });
            }

            //Move the bag right
            if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                for(let i of this.ingHolder.getChildren()){
                    if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                    //    console.log("right called");
                        i.setVelocity(7,0)
                    }
                }
                this.bag.setVelocity(7, 0);
            }

            //Move the bag left
            if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.bag.setVelocity(-7, 0);
                for(let i of this.ingHolder.getChildren()){
                    if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                    //    console.log("left called");
                        i.setVelocity(-7,0);
                    }
                }
            }

        }
            // for(let i of this.ingredients.getChildren()){
            //     if(this.container.body.hitTest(i.x,i.y) == true) {
            //         i.setVelocity(this.container.body.velocity.x, this.container.body.velocity.y)
            //     }
            // }
            // for(let i of this.ingHolder.getChildren()){
            //     if(i.x > 750) {
            //         i.destroy();
            //     }
            // }
        
        if(this.bag.x > 840 && this.lift == false){
            this.bag.setVelocity(0,0);
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                //    console.log("left called");
                    i.setVelocity(0,0);
                }
            }
        }

        //Go back to menu when you press ESC
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }

    }

    clickOn(gObj) {

        // let x = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.width-100);
        // let y = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.height-100);
        
        if(gObj == this.playMenu) {
            this.scene.launch("playMenuScene");
            this.scene.pause('playScene');
        }
            
        for(let b of this.dispenseButtons.getChildren()) {
            if(gObj == b) {
                this.spawnIngredientLoop = true;
            }
        }

        for(let r of this.refillButtons.getChildren()) {
            if(gObj == r) {
                let dispPrefab = gObj.getData('prefab');
                if(dispPrefab.ingredientType == 'empty') {
                    let priceText = this.scene.add.text(440, 265, 'this dispenser is empty', this.scene.defaultTextConfig).setScale(0.5).setOrigin(0.5,0.5);
                    this.time.delayedCall(2000, () => {
                        priceText.destroy();
                    });
                } else {
                    this.buyIngredients(gObj);
                }
                
            }
        }
    }

    clickOff() {
        //console.log('click over');
        this.spawnIngredientLoop = false;
    }

    //Calculates money made from selling trail mix bag
    //Mix will be an array of the weight of each ingredient contained in the bag: [peanuts, raisins, m&ms, almonds] 
    // sellMix(mix){
    //     this.money += (0.0214 * mix[0] + 0.0208 * mix[1] / 0.5 + 0.0745 * mix[2] / 1.1 + 0.0465 * mix[3] / 1.3);         
    // }

    //Call this method when spending any amount of money
    spendCash(spent) {
        this.money -= spent;
        this.money = this.money.toFixed(2);
        this.money = Number.parseFloat(this.money);
        this.moneyText.setText('Money: $'+ this.money);
        localStorage.setItem('money', this.money);
    }

    //Call this method when gaining any amount of money
    getCash(gained) {
        this.money += gained;
        this.money = this.money.toFixed(2);
        this.money = Number.parseFloat(this.money);
        this.moneyText.setText('Money: $'+ this.money);
        localStorage.setItem('money', this.money);
    }

    //Calculate the price of a bag
    calculatePrice(contents) {
        let bagValue = 0;
        for(let c of contents) {
            bagValue += c.value;
        }
        bagValue *= this.bagMultiplier * this.lobbyMultiplier * this.contractMultiplier;
        bagValue = bagValue.toFixed(2);
        return bagValue;
    }

    //Calculate the percentages of ingredients in a bag, return a 2 dimensional array in the form [[type1 string, % of type1 in the bag], [type2 string, # of type2 in the bag]...etc]
    calculatePercentages(contents) {
        
        if(contents.length == 0) {
            console.log('empty');
            return null;
        }
        let typeArray = [];
        //let typeData = []; //Array with two elements, typeData[0] = type string, typeData[1] = number of items of the same type
        let first = contents[0];
        let firstData = [first.type, 0];
        typeArray.push(firstData);
        for(let c of contents) {
            let maybeAdd; 
            let i = 0;
            for(let t of typeArray) {
                if(c.type == t[0]) {
                    t[1] += 1;
                } else {
                    maybeAdd = c.type;
                    if(i == typeArray.length-1) {
                        let typeData = [maybeAdd, 0]; //Array with two elements, typeData[0] = type string, typeData[1] = number of items of the same type
                        typeArray.push(typeData);
                    }
                }
                i++;
            }
           
        }
        let totalContents = contents.length;
        for(let n of typeArray) {
            let num = n[1];
            let percent = (num / totalContents) * 100;
            percent = percent.toFixed(1);
            n[1] = percent;
        }
        return typeArray;
    }

    //Calculate the weight of a bag
    calculateWeight(contents) {
        let bagWeight = 0;
        for(let c of contents) {
            bagWeight += c.weight;
        }
        bagWeight = bagWeight.toFixed(1);
        return bagWeight;
    }

    //Refill a dispenser to max
    buyIngredients(gObj) {
        let dispPrefab = gObj.getData('prefab');
        let priceToBuy = dispPrefab.priceToRefill;
        if(this.money > priceToBuy) {
            this.spendCash(priceToBuy);
            dispPrefab.numIngredients = dispPrefab.maxIngredients;
            dispPrefab.priceToRefill = 0;
            dispPrefab.refillMeter.height = 75;
        } else {
            this.insufficientFunds(priceToBuy);
        }
    }

    //Purchase Upgrades
    buyUpgrades(upgradeStr) {
        let i = 0;
        for(let u of this.upgradesArray) {
            if(u[0] == upgradeStr) {
                let price = u[1];
                if(this.money >= price){
                    this.spendCash(price);
                    if(upgradeStr == 'dispenser I') {
                        // this.createDispenser(x, y); add x and y when ready
                    } else if(upgradeStr == 'dispenser II') {
                        // this.createDispenser(x, y); add x and y when ready
                    } else if(upgradeStr == 'bag 2x') {
                        this.bagMultiplier = 2;
                    } else if(upgradeStr == 'bag 4x') {
                        this.bagMultiplier = 4;
                    } else if(upgradeStr == 'bag 8x') {
                        this.bagMultiplier = 8;
                    } else if(upgradeStr == 'bag 16x') {
                        this.bagMultiplier = 16;
                    } else if(upgradeStr == 'lobby I') {
                        this.lobbyMultiplier = 2;
                    } else if(upgradeStr == 'lobby II') {
                        this.lobbyMultiplier = 4;
                    } else if(upgradeStr == 'lobby III') {
                        this.lobbyMultiplier = 8;
                    }
                    this.upgradesArray.splice(i, 1);
                    this.upgradesAcquiredArray.push(u);
                } else {
                    this.insufficientFunds(price)
                }
            }
            i++;
        }
    }


    //Call when the user doesn't have enough cash to cover an ingredient refill transaction
    insufficientFunds(price) {
        let insFundText = this.add.text(game.config.width/2-50, game.config.height/2-100, 'You do not have enough funds, you need $' + price + ' to purchase', this.defaultTextConfig).setOrigin(0.5,0.5);
        insFundText.setScale(0.4);
        this.time.delayedCall(2000, () => {
            insFundText.destroy();
        });
    }

 //   createDispenser(x, y, initType) {
 //       let newDispenser = new Dispenser(this, x, y, (initType == null) ? 'empty' : initType);
 //       return newDispenser;
 //   }

}