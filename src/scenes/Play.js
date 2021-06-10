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
        this.load.image('pretzel', 'pretzel.png');
        this.load.audio('dispense', 'dispenserNoise.mp3');
        this.load.audio('soundtrack', 'PlayTrack.mp3');
        this.load.audio('emptyDispenser', 'dispenserEmpty.mp3');
        this.load.audio('shortHydraulic', 'hydraulic.mp3');
        this.load.audio('tubeSuction', 'suction.mp3');
        this.load.image('scale', 'scale.png');
        this.load.image('files', 'files.png');
        this.load.image('dispenser', 'Dispenser.png');
        this.load.image('arrow', 'Arrow.png');
        this.load.image('roach', 'Roach.png');
        this.load.image('rat', 'Rat.png');
        this.load.image('ratSign', 'RatSign.png');
        this.load.image('trash', 'Trash.png');
        this.load.image('hammer', 'Hammer.png');
        this.load.image('squashed', 'Squashed.png');
    }

    create() {

        //Initialize data variables
        this.matter.world.setBounds(0, 0, 960, 720);
        this.matter.world.setGravity(0, 1.3); 
        this.frameCount = 0;
        this.flowRate = 5; //How often in frames to spawn Ingredients
        this.money;
        this.binWeight = 1000; //How many grams of ingredients can fit in one dispenser
        this.lift = false; //for sell action
        this.enableRatEvent = false; //allows rats attack bag
        this.ratEvent = false; //if the rat event is actually happeing
        this.ratSign = false;
        this.evalution = false;
        this.contractChecker = 0;
        this.contractMulti = 1;

        //Initialize player money based on previous gameplay
        if(localStorage.getItem('money') == null){
            this.money = 50.00;
            localStorage.setItem('money', this.money);
        }
        else{
            this.money = parseFloat(localStorage.getItem('money')).toFixed(2);
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
        if(localStorage.getItem('bagMult') == null){
            this.bagMultiplier = 1;
        }
        else{
            this.bagMultiplier = parseInt(localStorage.getItem('bagMult'));
        }
        
        this.contractMultiplier = 1;
        if(localStorage.getItem('lobbyMult') == null){
            this.lobbyMultiplier = 1;
        }
        else{
            this.lobbyMultiplier = parseInt(localStorage.getItem('lobbyMult'));
        }

        //Add boolean flags
        this.spawnIngredientLoop = false;
        this.priceCalculated = false;
        this.sideMovement = false;

        
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
        this.defaultTextConfig = {fontFamily: 'purse', fontSize: '38px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'};
        this.whiteTextConfig = {fontFamily: 'fred', fontSize: '40px', backgroundColor: '#00000033', color: '#FFFFFF', align: 'center'};
        this.scaleTextConfig = {fontFamily: 'screen', fontSize: '62px', backgroundColor: '#FFFFFF00', color: '#00FC10', align: 'center'};

        //Keep track of clickTarget globally
        this.clickTarget;
        
        //Draw Background
        this.bg = this.add.tileSprite(0, 0, screenWidth, game.config.height, 'bg').setOrigin(0 ,0);

        //Menu
        this.playMenu = this.add.image(10, 100, 'files').setOrigin(0 ,0);
        this.playMenuText = this.add.text(44,139, 'Files', this.defaultTextConfig);
        this.playMenu.setInteractive({
            useHandCursor: true
        });
        this.playMenu.setDataEnabled;

        //Make conveyor belt
        this.anims.create({ key: 'conveyorLeft', frames: this.anims.generateFrameNumbers('conveyor', { start: 0, end: 2, first: 0}), frameRate: 12 });
        this.anims.create({ key: 'conveyorRight', frames: this.anims.generateFrameNumbers('conveyor', { start: 2, end: 0, first: 0}), frameRate: 12 });
        this.conveyorBelt = this.matter.add.image(308, 510, 'conveyor').setIgnoreGravity(true).setStatic(true);

        //Make Render Layers
        this.ingLayer = this.add.layer();
        this.dispenserLayer = this.add.layer();

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

        this.ingredientTypeArray = ['peanut','raisin', 'm&m', 'almond', 'roach'];
        this.dispenserArray = [];

        this.lobby = true;
        if(localStorage.getItem('LobbyI') == null){
            this.lobby = false;
        }


        //Create dispensers
        this.dispenser1 = new Dispenser(this, 235, 0, 'dispenser', null, 'peanut', 1, this.lobby, 'roach');
        this.dispenser2 = new Dispenser(this, 345, 0, 'dispenser', null, 'raisin', 2, this.lobby, 'roach');
        this.dispenser3 = new Dispenser(this, 455, 0, 'dispenser', null, 'm&m', 3, this.lobby, 'roach');
        if(localStorage.getItem('disp4Type') == null) {
            this.dispenser4; //Don't spawn dispenser4 until it is bought;
        } else {
            this.dispenser4 = new Dispenser(this, 565, 0, 'dispenser', null, localStorage.getItem('disp4Type'), 4, this.lobby, 'roach'); //Update x location when new sprites are added
        }
        if(localStorage.getItem('disp5Type') == null) {
            this.dispenser5; //Don't spawn dispenser5 until it is bought;
        } else {
            this.dispenser5 = new Dispenser(this, 675, 0, 'dispenser', null, localStorage.getItem('disp5Type'), 4, this.lobby, 'roach'); //Update x location when new sprites are added
        }

        //Create Trail Mix Bag
        this.inform = this.cache.json.get('bag_physics');
        this.bag = this.matter.add.image(100, 400, 'bag_info', 'bag.png',{ shape: this.inform.bag });

        //Create tube, scale, and tracker
        this.scale = this.add.image(game.config.width - 120, 579, 'scale').setOrigin(0, 0);
        this.matter.add.gameObject(this.scale).setIgnoreGravity(true).setStatic(true);
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(725, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);

        //Current Contract Info
        this.contractBg = this.add.rectangle(735, 60, 205, 230, 0xFFFFFF).setOrigin(0 ,0);

        //Initialize graphical contract info
        this.currentContract = this.add.text(838, 100, contractInfo.amountString, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(1,1);
        this.ingOne = this.add.text(838, 140, contractInfo.infoOne, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingTwo = this.add.text(838, 180, contractInfo.infoTwo, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingThree = this.add.text(838, 220, contractInfo.infoThree, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingFour = this.add.text(838, 260, contractInfo.infoFour, this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);

        //Create floor
        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.matter.add.image(this.floor);

        //Create trash can
        this.trash = this.add.image(10, game.config.height - 140, 'trash').setOrigin(0,0);
        this.trash.setInteractive({
            useHandCursor: true
        });
        this.trash.setDataEnabled;

        //The rats
        this.middleRat = this.add.image(game.config.width - 135, 30, 'rat').setOrigin(0, 0);
        this.leftRat = this.add.image(game.config.width - 165, 10, 'rat').setOrigin(0, 0);
        this.rightRat = this.add.image(game.config.width - 105, 10, 'rat').setOrigin(0, 0);
        this.theRats = this.add.group();
        this.theRats.addMultiple([this.middleRat, this.leftRat, this.rightRat]);
        console.log(this.theRats)
        for(let i of this.theRats.getChildren()){
            i.alpha = 0;
        }

        //Create hammer
        this.hammer = this.add.image(150, 600, 'hammer').setOrigin(0 ,0);
        this.hammer.setInteractive();
        this.input.setDraggable(this.hammer);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('dragend', function(pointer, gameObject, dragX, dragY, dropped) {
            gameObject.x = 150;
            gameObject.y = 600;
        });

        //Add UI element to keep track on the player's money
        this.moneyText = this.add.text(10, 5, 'Bank: $' + this.money, this.whiteTextConfig);

        //Enable event based click interaction
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            this.clickTarget = gameObject;
            this.clickOn(gameObject);
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            this.clickTarget = null;
            this.clickOff();
        });

        //Conveyor buttons
        this.leftArrow = this.add.image(270, 510, 'arrow').setOrigin(0,0.5);
        this.leftArrow.setFlipX(true);
        this.leftArrow.setInteractive({
            useHandCursor: true
        });
        this.leftArrow.setDataEnabled;
        this.rightArrow = this.add.image(387, 510, 'arrow').setOrigin(0,0.5);
        this.rightArrow.setFlipX(false);
        this.rightArrow.setInteractive({
            useHandCursor: true
        });
        this.rightArrow.setDataEnabled;

        //Define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    }

    update() {
        this.playMenuText.setVisible(true);
        this.playMenu.alpha = 1;

        //How many frames have elapsed since the start of the scene
        this.frameCount++;

        this.currentContract.text = contractInfo.amountString;
        this.ingOne.text = contractInfo.infoOne;
        this.ingTwo.text = contractInfo.infoTwo;
        this.ingThree.text = contractInfo.infoThree;
        this.ingFour.text = contractInfo.infoFour;

        //Dispense ingredients when button is clicked and conditions are met
        if(this.spawnIngredientLoop && (this.frameCount % this.flowRate) == 0) {
            for(let d of this.dispenseButtons.getChildren()) {
                if(d == this.clickTarget) {
                    let dispPrefab = this.clickTarget.getData('prefab');
                    dispPrefab.spawnIngredient();
                }
            }
        }

        //Rat handling
        if(this.ratEvent == true){
            if(this.middleRat.y < this.bag.y - 100) {
                for(let i of this.theRats.getChildren()){
                    i.y += 5;
                }
            }
            else {
                this.ratSign = this.add.image(this.bag.x, this.bag.y - 20, 'ratSign').setOrigin(.5,.5);
                this.ingHolder.clear(true, true);
                for(let i of this.theRats.getChildren()){
                    i.alpha = 0;
                }
                this.middleRat.y = 0;
                this.leftRat.y = -20;
                this.rightRat.y = -20;
                this.time.delayedCall(500, () => {
                    this.ratSign.destroy();
                });
                this.evalution = true;
                this.ratEvent = false;
            }
        }

        //Calculate bag value and weight when on the scale
        if(this.bag.x > 840 && !this.priceCalculated) {
            console.log(this.ingHolder);
            if(this.enableRatEvent == true && Math.random() > 0.5 && this.evalution == false) {
                this.ratEvent = true;
                for(let i of this.theRats.getChildren()){
                    i.alpha = 1;
                }
            }
            else {
                this.priceCalculated = true;

                //Calculate which ingredients are in the bag, then add them to an array
                let bagContentsArray = [];
                for(let i of this.ingHolder.getChildren()) {
                    if(i.x > this.bag.x - (this.bag.width / 2) && i.x < this.bag.x + (this.bag.width / 2) && i.y > this.bag.y - (this.bag.height/2) - 15 && i.y < this.bag.y + (this.bag.height/2)) {
                        bagContentsArray.push(i);
                    }
                }
                
                //Use the array to calculate the bag's ingredient percents, weight, and price
                let percentages = this.calculatePercentages(bagContentsArray);
                let value = parseFloat(this.calculatePrice(bagContentsArray, percentages));
                let weight = parseFloat(this.calculateWeight(bagContentsArray));
                
    
                //Display bag's price and weight
                let weightText = this.add.text(700, 350, (Number.isNaN(weight)) ? ('this bag is empty') : ('this bag weighs ' + weight + 'g'), this.defaultTextConfig).setOrigin(0.5,0.5);
                let valueText = this.add.text(700, 380, (Number.isNaN(value)) ? ('this bag is worth $0') : ('this bag is worth $' + value.toFixed(2)), this.defaultTextConfig).setOrigin(0.5,0.5);
                weightText.setScale(0.5);
                valueText.setScale(0.5);
    
                //Display bag's ingredient percents
                let percentageOffset = 30;
                if(percentages != null) {
                    for(let p of percentages) {
                        let percentText = this.add.text(841, 583 + (percentageOffset * percentages.indexOf(p)), p[0].toUpperCase() + ' : ' + p[1] + '%', this.scaleTextConfig).setOrigin(0.5,0.5);
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
                        this.bag.setVelocity(0, 0);
                        this.priceCalculated = false;
                        this.lift = false;
                    });
                    for(let i of this.ingHolder.getChildren()){
                        if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                            i.setVelocity(0,-20);
                        }
                    }
                });
                this.evalution = false;
            }
        }

        //Move the bag right
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                //    console.log("right called");
                    i.setVelocity(6,3)
                }
            }
            if(localStorage.getItem('volume') == null){
                this.sound.play('shortHydraulic');
            } 
            else{
                this.sound.play('shortHydraulic', {volume: parseFloat(localStorage.getItem('volume'))});
            }
                this.bag.setVelocity(6, 3);
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
            this.bag.setVelocity(-6, 3);
            let conveyorAnim = this.add.sprite(305, 510, 'conveyor');
            conveyorAnim.anims.play('conveyorLeft');
            this.time.delayedCall(2500, () => {
                conveyorAnim.destroy();
            })
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                //    console.log("left called");
                    i.setVelocity(-6,3);
                    
                }
            }
        }
        
        //Auto move bag to scale when it reaches the end of the conveyor belt
        if(this.bag.x > 840 && this.lift == false){
            this.bag.setVelocity(0,0);
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                    i.setVelocity(0,0);
                }
            }
        } else if(this.bag.x > 690 && this.bag.x < 840) {
            this.bag.setVelocity(10,2);
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                    i.setVelocity(10,0);
                }
            }
        }

        //Hammer event
        if(this.hammer.x < this.bag.x + 50 && this.hammer.x > this.bag.x - 50 && this.hammer.y < this.bag.y + 30 && this.hammer.y > this.bag.y - 70){
            console.log('hammer time');
            for(let i of this.ingHolder.getChildren()){
                if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 70) {
                    if(i.type == 'roach') {
                        i.setTexture('squashed');
                        this.time.delayedCall(1500, () => {
                            i.destroy();
                        })
                    }
                }
            }
        }

        //Go back to menu when you press ESC
        if(Phaser.Input.Keyboard.JustDown(this.keyESC)) {
            this.soundtrack.stop();
            this.scene.start("menuScene");
        }
        
        //Change dispenser1 to a roach dispenser when you hit spacebar
        if(Phaser.Input.Keyboard.JustDown(keySPACE) && this.dispenser1.lobby) {
            this.dispenser1.changeType('roach');
        }

    }

    clickOn(gObj) {
        
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
            this.playMenuText.setVisible(false);
            this.scene.pause('playScene');
        }

        //Use right arrow, move bag right
        if(gObj == this.rightArrow){
            this.sideMovement = true;
            this.holder = 1;
            if(this.sideMovement == true){
                for(let i of this.ingHolder.getChildren()){
                    if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
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
        }

        //Use left arrow, move bag left
        if(gObj == this.leftArrow){
            this.sideMovement = true;
            if(this.sideMovement == true){
                for(let i of this.ingHolder.getChildren()){
                    if(i.x > this.bag.x - 55 && i.x < this.bag.x + 55 && i.y > this.bag.y - 50) {
                        i.setVelocity(-7,0)
                    }
                }
                if(localStorage.getItem('volume') == null){
                    this.sound.play('shortHydraulic');
                } 
                else{
                    this.sound.play('shortHydraulic', {volume: parseFloat(localStorage.getItem('volume'))});
                }
                this.bag.setVelocity(-7, 2);
                let conveyorAnim = this.add.sprite(305, 510, 'conveyor');
                conveyorAnim.anims.play('conveyorRight');
                this.time.delayedCall(2500, () => {
                    conveyorAnim.destroy();
                })
            }
        }

        //When the trash is clicked, clear items from the scene
        if(gObj == this.trash){
            this.ingHolder.clear(true, true);
        }
            
        //If the dispenser button is pushed, spawn ingredients
        for(let b of this.dispenseButtons.getChildren()) {
            if(gObj == b) {
                this.spawnIngredientLoop = true;
            }
        }

        //Refill dispenser on refillButton click
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

    //Callback when mouse is unclicked
    clickOff() {
        this.spawnIngredientLoop = false;
        this.sideMovement = false;
    }

    //Call this method when spending any amount of money
    spendCash(spent) {
        if(Number.isNaN(spent)) {
            console.log('NaN passed to spendCash() in play scene')
        } else {
            this.money -= spent;
        }
        this.money = this.money.toFixed(2);
        this.moneyText.setText('Bank: $'+ this.money);
        localStorage.setItem('money', this.money);
    }

    //Call this method when gaining any amount of money
    getCash(gained) {
        if(Number.isNaN(gained)) {
            console.log('NaN passed to getCash() in play scene')
        } else {
            this.money = parseFloat(this.money);
            this.money += gained;
        }
        this.money = this.money.toFixed(2);
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
        //If the bag is empty, return null
        if(contents.length == 0) {
            return null;

        //Calculate freeform bag value
        } else {
            if(contractInfo.amountString != 'Motivation') {
                for(let p of percents) {
                    if(contractInfo.infoOne.toUpperCase().split(' ')[1] == p[0].toUpperCase().concat('S') && contractInfo.infoOne.toUpperCase().split(' ')[0].slice(0, -1) + 5 >= p[1] && contractInfo.infoOne.split(' ')[0].slice(0, -1) - 5 <= p[1]){
                        this.contractChecker += 1;
                        console.log('ignOne good');
                    }
                    if(contractInfo.infoTwo.toUpperCase().split(' ')[1] == p[0].toUpperCase().concat('S') && contractInfo.infoTwo.split(' ')[0].slice(0, -1) + 5 >= p[1] && contractInfo.infoTwo.split(' ')[0].slice(0, -1) - 5 <= p[1]){
                        this.contractChecker += 1;
                        console.log('ignTwo good');
                    }
                    if(contractInfo.infoThree.split(' ')[1].toUpperCase() == p[0].toUpperCase().concat('S') && contractInfo.infoThree.split(' ')[0].slice(0, -1) + 5 >= p[1] && contractInfo.infoThree.split(' ')[0].slice(0, -1) - 5 <= p[1]){
                        this.contractChecker += 1;
                        console.log('ignThree good');
                    }
                    if(contractInfo.infoFour.split(' ')[1].toUpperCase() == p[0].toUpperCase().concat('S') && contractInfo.infoFour.split(' ')[0].slice(0, -1) + 5 >= p[1] && contractInfo.infoFour.split(' ')[0].slice(0, -1) - 5 <= p[1]){
                        this.contractChecker += 1;
                        console.log('ignFour good');
                    }
                }
                if(this.contractChecker == 4) {
                    contractInfo.amount -= 1;
                    if(contractInfo.amount == 0) {
                        contractInfo = {
                            infoOne: 'Your life savings were',
                            infoTwo: 'spent opening this up.',
                            infoThree: 'It better have been',
                            infoFour: 'worth it...',
                            amountString: 'Motivation',
                            amount: -10
                        };
                    }
                    contractInfo.amountString = contractInfo.amount.toString().concat(' Left')
                    this.contractChecker = 0;
                    this.contractMulti = contractInfo.multTag;
                }
            }

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
            bagValue *= this.bagMultiplier * this.lobbyMultiplier * varietyMultiplier * filledMultiplier * this.contractMulti;
            this.contractMulti = 1;
            bagValue = bagValue.toFixed(2);
            return bagValue;
        }
    }

    //Calculate the percentages of ingredients in a bag, return a 2 dimensional array in the form [[type1 string, % of type1 in the bag], [type2 string, # of type2 in the bag]...etc]
    calculatePercentages(contents) {

        if(contents.length == 0) {
            return null;
        } 
        else {
            let typeArray = [];
            for(let c of contents) {
                let itemType = c.type;
                let found = false;
                for(let t of typeArray) {
                    if(c.type == t[0]) {
                        found = true;
                        t[1] += 1;
                    } 
                }
                if(!found){
                    typeArray.push([itemType, 1]);
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
        dispPrefab.ingredientText.text = dispPrefab.ingredientType.toUpperCase() + ((dispPrefab.ingredientType == 'empty') ? '' : 's');
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