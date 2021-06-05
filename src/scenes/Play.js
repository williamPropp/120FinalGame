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
        this.load.spritesheet('conveyor', 'conveyorSpritesheet.png', {frameWidth: 831, frameHeight: 123, startFrame: 0, endFrame: 2});
        this.load.image('bg', 'FactoryBG.png');
        this.load.image('m&m', 'm&m.png');
        this.load.image('almond', 'almond.png');
        this.load.image('peanut', 'peanut.png');
        this.load.image('raisin', 'raisin.png');
        this.load.audio('dispense', 'dispenserNoise.mp3');
        this.load.audio('soundtrack', 'PlayTrack.mp3');
        this.load.audio('emptyDispenser', 'dispenserEmpty.mp3');
        this.load.audio('shortHydraulic', 'hydraulic.mp3');
        this.load.audio('tubeSuction', 'suction.mp3');
        this.load.image('scale', 'scale.png');
        this.load.image('files', 'files.png');
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
        this.upgradesArray = [['dispenser I', 0],//250], 
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
        this.spawnIngredientLoop = false;
        this.priceCalculated = false;
        this.contractEnabled = false;

        
        //Add music to the scene
        if(localStorage.getItem('volume') == null){
            this.soundtrack = this.sound.add('soundtrack', {
                volume: 0.5,
                loop: true,
            });
        } 
        else{
            this.soundtrack = this.sound.add('soundtrack', {
                volume: parseFloat(localStorage.getItem('volume')),
                loop: true,
            });
        }
        this.soundtrack.play();

        //Text configs
        this.defaultTextConfig = {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'};
        this.whiteTextConfig = {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#00000033', color: '#FFFFFF', align: 'center'};

        //Keep track of clickTarget globally
        this.clickTarget;
        
        //Draw Background
        this.bg = this.add.tileSprite(0, 0, screenWidth, game.config.height, 'bg').setOrigin(0 ,0);
        // this.bg = this.add.rectangle(0, 0, screenWidth, game.config.height, 0xf0f0f0).setOrigin(0 ,0);

        //Menu
        this.playMenu = this.add.image(10, 100, 'files').setOrigin(0 ,0);
        this.playMenu.setInteractive({
            useHandCursor: true
        });
        this.playMenu.setDataEnabled;

        //Make conveyor belt
        this.anims.create({ key: 'conveyorLeft', frames: this.anims.generateFrameNumbers('conveyor', { start: 0, end: 2, first: 0}), frameRate: 12 });
        this.anims.create({ key: 'conveyorRight', frames: this.anims.generateFrameNumbers('conveyor', { start: 2, end: 0, first: 0}), frameRate: 12 });
        this.conveyorBelt = this.matter.add.image(305, 510, 'conveyor').setIgnoreGravity(true).setStatic(true);

        //Make Render Layers
        this.ingLayer = this.add.layer();
        this.dispenserLayer = this.add.layer();
        //this.ingLayer.add([this.player]);

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

        this.dispenser1 = new Dispenser(this, 250, 0, null, null, 'peanut', 1);
        this.dispenser2 = new Dispenser(this, 370, 0, null, null, 'raisin', 2);
        this.dispenser3 = new Dispenser(this, 490, 0, null, null, 'm&m', 3);
        if(localStorage.getItem('disp4Type') == null) {
            this.dispenser4; //Don't create dispenser4 until it is bought;
        } else {
            this.dispenser4 = new Dispenser(this, 610, 0, null, null, 'empty', 4); //Update x location when new sprites are added
        }
        if(localStorage.getItem('disp5Type') == null) {
            this.dispenser5; //Don't create dispenser5 until it is bought;
        } else {
            this.dispenser5 = new Dispenser(this, 730, 0, null, null, 'empty', 5); //Update x location when new sprites are added
        }

        // this.almondDispenser = new Dispenser(this, 610, 0, 'almond');

        this.inform = this.cache.json.get('bag_physics');
        this.bag = this.matter.add.image(100, 400, 'bag_info', 'bag.png',{ shape: this.inform.bag });
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

        this.scale = this.add.image(game.config.width - 120, 580, 'scale').setOrigin(0, 0);
        this.matter.add.gameObject(this.scale).setIgnoreGravity(true).setStatic(true);
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(725, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);

        //Current Contract Info
        this.contractBg = this.add.rectangle(735, 60, 205, 230, 0xFFFFFF).setOrigin(0 ,0);

        this.currentContract = this.add.text(840, 100, contractInfo.ammount, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(1,1);
        this.ingOne = this.add.text(840, 140, contractInfo.infoOne, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingTwo = this.add.text(840, 180, contractInfo.infoTwo, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingThree = this.add.text(840, 220, contractInfo.infoThree, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingFour = this.add.text(840, 260, contractInfo.infoFour, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);


        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.matter.add.image(this.floor);

        // this.bin = this.add.rectangle(25, 600, 100, 200, 0x808080).setOrigin(0 ,0);
        // this.bin.setInteractive();
        // this.input.setDraggable(this.bin);
        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });
        // this.input.on('dragend', function(pointer, gameObject, dragX, dragY, dropped) {
        //     gameObject.x = 25;
        //     gameObject.y = 600;
        // });
        // this.bin.on('drop', (pointer, target) => {
            // note: the message below will be superseded by the dragend event above
            // console.log(`Dropped '${this.burrito.texture.key}' on '${target.texture.key}'`);
            // this.printMessage(`Dropped '${this.burrito.texture.key}' on '${target.texture.key}'`);
    
            // if (target.texture.key === 'dispenser') {
            //     this.bin.destroy();
            // }
        // });

        //Add UI element to keep track on the player's money
        // this.moneyText = this.add.text(10, 5, 'Bank: $'+this.money, this.whiteTextConfig);
        this.moneyText = this.add.text(10, 5, 'Bank: $'+this.money, this.whiteTextConfig);

        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            this.clickTarget = gameObject;
            this.clickOn(gameObject);
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            this.clickTarget = null;
            this.clickOff();
        });

        //Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    }

    update() {

        this.playMenu.alpha = 1;

        //How many frames have elapsed since the start of the scene
        this.frameCount++;

        this.currentContract.text = contractInfo.ammount;
        this.ingOne.text = contractInfo.infoOne;
        this.ingTwo.text = contractInfo.infoTwo;
        this.ingThree.text = contractInfo.infoThree;
        this.ingFour.text = contractInfo.infoFour;

        if(this.spawnIngredientLoop && this.frameCount % this.flowRate == 0) {
            for(let d of this.dispenseButtons.getChildren()) {
                if(d == this.clickTarget) {
                    let dispPrefab = this.clickTarget.getData('prefab');
                    dispPrefab.spawnIngredient();
                }
            }
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
            
            //Use the array to calculate the bag's ingredient percents, weight, and price
            let percentages = this.calculatePercentages(bagContentsArray);
            let value = parseFloat(this.calculatePrice(bagContentsArray, percentages));
            let weight = parseFloat(this.calculateWeight(bagContentsArray));
            

            //Display bag's price and weight
            let weightText = this.add.text(700, 350, (Number.isNaN(weight)) ? ('this bag is empty') : ('this bag weighs ' + weight + 'g'), this.defaultTextConfig).setOrigin(0.5,0.5);
            let valueText = this.add.text(700, 380, (Number.isNaN(value)) ? ('this bag is worth $0') : ('this bag is worth $' + value), this.defaultTextConfig).setOrigin(0.5,0.5);
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
            //Play suction sound
            if(localStorage.getItem('volume') == null){
                this.sound.play('tubeSuction');
            } 
            else{
                this.sound.play('tubeSuction', {volume: parseFloat(localStorage.getItem('volume'))});
            }
            

            //After the player gets a chance to read everything, reset bag and ingredients
            this.time.delayedCall(2000, () => {
                weightText.destroy();
                valueText.destroy();
                this.lift = true;
                
                this.bag.setVelocity(0, -20);
                this.time.delayedCall(550, () => {
                    this.getCash((Number.isNaN(value) ? 0 : value));
                    this.ingHolder.clear(true, true);
                    this.bag.setPosition(100, 400);
                    this.priceCalculated = false;
                    this.lift = false;
                });
                for(let i of this.ingHolder.getChildren()){
                    if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
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
            if(localStorage.getItem('volume') == null){
                this.sound.play('shortHydraulic');
            } 
            else{
                this.sound.play('shortHydraulic', {volume: parseFloat(localStorage.getItem('volume'))});
            }
                this.bag.setVelocity(7, 2);
            let conveyorAnim = this.add.sprite(305, 510, 'conveyor');
            conveyorAnim.anims.play('conveyorRight');
            this.time.delayedCall(2500, () => {
                conveyorAnim.destroy();
            })
        }

        //Move the bag left
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if(localStorage.getItem('volume') == null){
                this.sound.play('shortHydraulic');
            } 
            else{
                this.sound.play('shortHydraulic', {volume: parseFloat(localStorage.getItem('volume'))});
            }
            this.bag.setVelocity(-7, 2);
            let conveyorAnim = this.add.sprite(305, 510, 'conveyor');
            conveyorAnim.anims.play('conveyorLeft');
            this.time.delayedCall(2500, () => {
                conveyorAnim.destroy();
            })
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                //    console.log("left called");
                    i.setVelocity(-7,0);
                    
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
            this.soundtrack.stop();
            this.scene.start("menuScene");
        }

    }

    clickOn(gObj) {

        // let x = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.width-100);
        // let y = Phaser.Math.Clamp((Math.floor(Math.random()*game.config.width)), 0, game.config.height-100);
        
        if(gObj == this.playMenu) {
            if(this.scene.isSleeping("playMenuScene")){
                this.playMenu.alpha = 0;
                this.scene.wake("playMenuScene");
            }
            else {
                let sceneData = {
                    scene: this,
                };
                this.playMenu.alpha = 0;
                this.scene.launch("playMenuScene", sceneData);
            }
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
                    this.refillDispenser(gObj);
                }
                
            }
        }
    }

    clickOff() {
        this.spawnIngredientLoop = false;
    }

    //Calculates money made from selling trail mix bag
    //Mix will be an array of the weight of each ingredient contained in the bag: [peanuts, raisins, m&ms, almonds] 
    // sellMix(mix){
    //     this.money += (0.0214 * mix[0] + 0.0208 * mix[1] / 0.5 + 0.0745 * mix[2] / 1.1 + 0.0465 * mix[3] / 1.3);         
    // }

    //Call this method when spending any amount of money
    spendCash(spent) {
        if(Number.isNaN(spent)) {
            console.log('NaN passed to spendCash() in play scene')
        } else {
            this.money -= spent;
        }
        this.money = this.money.toFixed(2);
        this.money = Number.parseFloat(this.money);
        this.moneyText.setText('Bank: $'+ this.money);
        localStorage.setItem('money', this.money);
    }

    //Call this method when gaining any amount of money
    getCash(gained) {
        if(Number.isNaN(gained)) {
            console.log('NaN passed to getCash() in play scene')
        } else {
            this.money += gained;
        }
        this.money += gained;
        this.money = this.money.toFixed(2);
        this.money = Number.parseFloat(this.money);
        this.moneyText.setText('Bank: $'+ this.money);
        localStorage.setItem('money', this.money);
    }

    //Calculate the weight of a bag
    calculateWeight(contents) {
        if(contents.length == 0) {
            return null;
        }
        let bagWeight = 0;
        for(let c of contents) {
            bagWeight += c.weight;
        }
        bagWeight = bagWeight.toFixed(1);
        return bagWeight;
    }

    //Calculate the price of a bag
    calculatePrice(contents, percents) {
        //If the bad is empty, return null
        if(contents.length == 0) {
            return null;

        //Do contract logic if a contract is active
        } else if(this.contractEnabled) {
            console.log('implement contracts')

        //Calculate freeform bag value
        } else {
            let bagValue = 0;
            for(let c of contents) {
                bagValue += c.value;
            }

            //Reward precise ratios in a bag (1/2, 1/3, 1/4, 1/5), and penalize less than 3 ingredients used
            let varietyMultiplier = 1;
            let percentsArray = [];
            for (let p of percents) {
                percentsArray.push(p[1]);
            }
            if(percentsArray.length < 3) {
                varietyMultiplier = 0.5;
            } else {
                varietyMultiplier += 0.25;
                let bonusArray = [50,33,25,20];
                for(let u of percentsArray) {
                    for(let b of bonusArray) {
                        if(b >= (u - 3) && b <= (u + 3)) {
                            varietyMultiplier += 0.25;
                        }
                    }
                }
            }
            //If the bag isn't filled enough, there will be a large penalty to the bag's value
            let filledMultiplier = 1;
            if(contents.length < 15) {
                filledMultiplier = 0.1;
            } else if(contents.length < 25) {
                filledMultiplier = 0.5;
            }
            //Multiply base value by the multipliers
            bagValue *= this.bagMultiplier * this.lobbyMultiplier * varietyMultiplier * filledMultiplier;
            bagValue = bagValue.toFixed(2);
            return bagValue;
        }
    }

    //Calculate the percentages of ingredients in a bag, return a 2 dimensional array in the form [[type1 string, % of type1 in the bag], [type2 string, # of type2 in the bag]...etc]
    calculatePercentages(contents) {

        if(contents.length == 0) {
            return null;
        } else {
            let typeArray = [];
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
    }

    //Refill a dispenser to max
    refillDispenser(gObj) {
        let dispPrefab = gObj.getData('prefab');
        let priceToBuy = dispPrefab.priceToRefill;
        if(this.money > priceToBuy) {
            this.spendCash(priceToBuy);
            dispPrefab.numIngredients = dispPrefab.maxIngredients;
            dispPrefab.priceToRefill = 0;
            dispPrefab.refillMeter.height = 75;
            dispPrefab.updateLocalStorage();
        } else {
            this.insufficientRefillFunds(priceToBuy);
        }
    }

    //Call when the user doesn't have enough cash to cover an ingredient refill transaction
    insufficientRefillFunds(price) {
        let insFundText = this.add.text(game.config.width/2-50, game.config.height/2-75, 'You do not have enough funds, you need $' + price + ' to purchase', this.defaultTextConfig).setOrigin(0.5,0.5);
        insFundText.setScale(0.4);
        this.time.delayedCall(2000, () => {
            insFundText.destroy();
        });
    }

}