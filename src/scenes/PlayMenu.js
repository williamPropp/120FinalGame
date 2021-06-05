class PlayMenu extends Phaser.Scene {
    constructor() {
        super("playMenuScene");

    }

    init(sceneData) {
        this.scenePointer = sceneData.scene;
    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('manilla', 'manilla.png');
        this.load.image('post', 'PostIt.png');
        this.load.image('order', 'OrderForm.png');
        this.load.image('plain', 'TabPlain.png');
        this.load.image('red', 'TabRed.png');
        this.load.image('green', 'TabGreen.png');
        this.load.image('blue', 'TabBlue.png');
        this.load.image('sign','sign.png');
        this.load.spritesheet('signName', 'signatureSpritesheet.png', {frameWidth: 220, frameHeight: 91, startFrame: 0, endFrame: 34});
        this.load.image('first','Assign-01.png');
        this.load.image('second','Assign-02.png');
        this.load.image('third','Assign-03.png');
        this.load.image('fourth','Assign-04.png');
        this.load.image('fifth','Assign-05.png');

    }

    create() {
        this.pauseMenu = this.add.image(121, 50, 'manilla').setOrigin(0, 0);

        //create signature animation
        this.anims.create({ key: 'signAnim', frames: this.anims.generateFrameNumbers('signName', { start: 0, end: 34, first: 0}), frameRate: 24 });
        // this.signName = this.add.image(305, 510, 'signName')

        this.signature = this.add.image(game.config.width/1.37, 550, 'sign').setOrigin(.5, 0);
        this.signature.setInteractive({
            useHandCursor: true
        });
        this.signature.setDataEnabled;
        this.signature.alpha = 0;

        this.currentTab = 'main';
        this.element = -1;

        //tab setup
        this.mainTab = this.add.image(83, game.config.height/9, 'plain').setOrigin(0, 0);
        this.mainTab.setInteractive({
            useHandCursor: true
        });
        this.mainTab.setDataEnabled;
        this.upgradeTab = this.add.image(83, game.config.height/9*2.8, 'green').setOrigin(0, 0);
        this.upgradeTab.setInteractive({
            useHandCursor: true
        });
        this.upgradeTab.setDataEnabled;
        this.contractTab = this.add.image(83, game.config.height/9*4.6, 'red').setOrigin(0, 0);
        this.contractTab.setInteractive({
            useHandCursor: true
        });
        this.contractTab.setDataEnabled;
        this.buyTab = this.add.image(83, game.config.height/9*6.4, 'blue').setOrigin(0, 0);
        this.buyTab.setInteractive({
            useHandCursor: true
        });
        this.buyTab.setDataEnabled;

        //post-it setup
        this.postIt = this.add.image(150, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postIt.setInteractive({
            useHandCursor: true
        });
        this.postIt.setDataEnabled;
        this.postItTwo = this.add.image(300, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItTwo.setInteractive({
            useHandCursor: true
        });
        this.postItTwo.setDataEnabled;
        this.postItThree = this.add.image(150, 220, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItThree.setInteractive({
            useHandCursor: true
        });
        this.postItThree.setDataEnabled;
        this.postItFour = this.add.image(300, 220, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItFour.setInteractive({
            useHandCursor: true
        });
        this.postItFour.setDataEnabled;
        this.postItFive = this.add.image(150, 370, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItFive.setInteractive({
            useHandCursor: true
        });
        this.postItFive.setDataEnabled;
        this.postItSix = this.add.image(300, 370, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItSix.setInteractive({
            useHandCursor: true
        });
        this.postItSix.setDataEnabled;
        this.postItSeven = this.add.image(150, 520, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItSeven.setInteractive({
            useHandCursor: true
        });
        this.postItSeven.setDataEnabled;
        this.postItEight = this.add.image(300, 520, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItEight.setInteractive({
            useHandCursor: true
        });
        this.postItEight.setDataEnabled;
        this.postHolder = this.add.group();
        this.postHolder.addMultiple([this.postIt, this.postItTwo,this.postItThree, this.postItFour,this.postItFive,this.postItSix,this.postItSeven,this.postItEight]);
        for(let i of this.postHolder.getChildren()){
            i.alpha = 0;
        }
        this.clickAction = false;

        //buttons
        this.assignOne  = this.add.image(560, 510, 'first').setOrigin(0,0);
        this.assignOne.setInteractive({
            useHandCursor: true
        });
        this.assignOne.setDataEnabled;
        this.assignTwo  = this.add.image(620, 510, 'second').setOrigin(0,0);
        this.assignTwo.setInteractive({
            useHandCursor: true
        });
        this.assignTwo.setDataEnabled;
        this.assignThree  = this.add.image(680, 510, 'third').setOrigin(0,0);
        this.assignThree.setInteractive({
            useHandCursor: true
        });
        this.assignThree.setDataEnabled;
        this.assignFour  = this.add.image(740, 510, 'fourth').setOrigin(0,0);
        this.assignFour.setInteractive({
            useHandCursor: true
        });
        this.assignFour.setDataEnabled;
        this.assignFive  = this.add.image(800, 510, 'fifth').setOrigin(0,0);
        this.assignFive.setInteractive({
            useHandCursor: true
        });
        this.assignFive.setDataEnabled;
        this.assignGroup = this.add.group();
        this.assignGroup.addMultiple([this.assignOne, this.assignTwo, this.assignThree,this.assignFour,this.assignFive]);
        for(let i of this.assignGroup.getChildren()) {
            i.alpha = 0;
        }


        //Text Arrays
        this.intros = ['Welcome Young','Capitalist!','Use the tabs on the side','to navigate our files.','Click on sticky notes','to see more info!']
        this.contractInfo = ['Motivation','You invested all','your money in','this. Good luck', 'lol']
        this.companyNames = ['Scam Co.', 'Capital Inc', 'Nuts TM', 'Rob Airy co', 'Small Mix Inc', 'Big Mix TM', 'Company Co', 'Snackz Inc', 'Trails TM']
        this.multChanges = [0.7, 0.8, 0.9, 1.1, 1.2, 1.3]
        this.openIng = ['Peanuts', 'Raisins', 'M&Ms', 'Almonds']
        this.ingredients = [];
        this.categories = ['Nuts', 'Fruits', 'Sweet', 'Savory'];
        this.nuts = ['Peanuts', 'Almonds', '???', '???'];
        this.fruits = ['Raisins', '???', '???', '???']
        this.sweets = ['M&Ms', '???', '???', '???'];
        this.savorys = ['???', '???', '???', '???'];
        this.catText = ['A classic filler', 'Dried to Perfection', 'The best Part', 'Insert Text']

        //Text Configs
        this.upgradeConfig = { fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.nameConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.ingConfig = { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#00000000', color: '#000000', align: 'center' };

        //All Text
        this.boldOne  = this.add.text(game.config.width/1.37, game.config.height/4, this.intros[0], this.nameConfig).setOrigin(0.5,0.5);
        this.boldTwo = this.add.text(game.config.width/1.37, game.config.height/3, this.intros[1], this.nameConfig).setOrigin(0.5,0.5);
        this.lineOne  = this.add.text(game.config.width/1.37, game.config.height/2.3, this.intros[2], this.ingConfig).setOrigin(0.5,0.5);
        this.lineTwo  = this.add.text(game.config.width/1.37, game.config.height/1.95, this.intros[3], this.ingConfig).setOrigin(0.5,0.5);
        this.lineThree  = this.add.text(game.config.width/1.37, game.config.height/1.7, this.intros[4], this.ingConfig).setOrigin(0.5,0.5);
        this.lineFour  = this.add.text(game.config.width/1.37, game.config.height/1.5, this.intros[5], this.ingConfig).setOrigin(0.5,0.5);
        this.noteOne  = this.add.text(game.config.width/4.5, 120, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteTwo  = this.add.text(game.config.width/2.65, 120, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteThree  = this.add.text(game.config.width/4.5, 270, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteFour  = this.add.text(game.config.width/2.65, 270, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteFive  = this.add.text(game.config.width/4.5, 420, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteSix  = this.add.text(game.config.width/2.65, 420, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteSeven  = this.add.text(game.config.width/4.5, 570, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteEight  = this.add.text(game.config.width/2.65, 570, '', this.upgradeConfig).setOrigin(0.5,0.5);

        this.noteHolder = this.add.group();
        this.noteHolder.addMultiple([this.noteOne,this.noteTwo,this.noteThree,this.noteFour, this.noteFive, this.noteSix, this.noteSeven,this.noteEight]) 

        //upgrade objs
        this.openContracts = {
            postName: 'Contracts',
            infoName: 'Sell your labor!',
            cost: 0,
            priceTag: 'Price: $5',
            infoOne: 'Pay this fee to',
            infoTwo: 'open up the world',
            infoThree: 'of being a sellout!',
        }
        this.bag2x = {
            postName: 'Bag 2x',
            infoName: 'Fill twice as much!',
            cost: 0,
            priceTag: 'Price: $20',
            infoOne: 'With new deep pocket',
            infoTwo: 'technology your bags are',
            infoThree: 'bigger but the same size',
        }
        this.dispenserOne = {
            postName: 'Dispenser I',
            infoName: 'Insert Text',
            cost: 0,
            priceTag: 'Price: $50',
            infoOne: 'Fill your bags with',
            infoTwo: 'one more ingredient!',
            infoThree: 'IDK',
        }
        this.bag4x = {
            postName: 'Bag 4x',
            infoName: 'Fill 4x as much!',
            cost: 0,
            priceTag: 'Price: $50',
            infoOne: 'Warp reality to your',
            infoTwo: 'will and redefine the',
            infoThree: 'causal trail mix bag',
        }
        this.dispenserTwo = {
            postName: 'Dispenser II',
            infoName: 'Insert Text',
            cost: 0,
            priceTag: 'Price: $50',
            infoOne: 'Another chance to',
            infoTwo: 'increase the mixing',
            infoThree: ' power of your factory!',
        }
        this.bag8x = {
            postName: 'Bag 8x',
            infoName: 'Fill 8x as much!',
            cost: 0,
            priceTag: 'Price: $500',
            infoOne: 'A spacial rift in an',
            infoTwo: 'unstable trail mix bag',
            infoThree: 'lets you stuff more in',
        }
        this.bag16x = {
            postName: 'Bag 16x',
            infoName: 'Fill 16x as much!',
            cost: 0,
            priceTag: 'Price: $5,000',
            infoOne: 'A pocket dimension in',
            infoTwo: 'the palm of you hand,',
            infoThree: 'and you used it for this?',
        }
        this.lobbyOne = {
            postName: 'Lobby I',
            infoName: 'Democracy at work',
            cost: 0,
            priceTag: 'Price: $5,000',
            infoOne: 'Regulations just hinder',
            infoTwo: 'production. Fix labor',
            infoThree: 'laws with the right bribes',
        }
        this.lobbyTwo = {
            postName: 'Lobby II',
            infoName: 'Democracy?',
            cost: 0,
            priceTag: 'Price: $5,000',
            infoOne: 'Fund a senator to',
            infoTwo: 'gain the upper hand.',
            infoThree: "It's Totally legal!",
        }
        this.lobbyThree = {
            postName: 'Lobby III',
            infoName: 'Liberation ',
            cost: 0,
            priceTag: 'Price: $5,000',
            infoOne: 'Your senetor friend is',
            infoTwo: 'running for president.',
            infoThree: 'Bye Bye labor laws!',
        }

        this.upgrades = [this.openContracts, this.bag2x,this.dispenserOne, this.bag4x, this.dispenserTwo, this.bag8x,this.bag16x, this.lobbyOne, this.lobbyTwo, this.lobbyThree];
        this.contracts = [];

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(this.contracts.length < 9){
            this.makeContract();
        }


        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.sleep('playMenuScene');
            this.scene.resume('playScene');
        }

        this.input.on('gameobjectdown', (pointer, gameObject, event) => {

            //tab clicks 
            if(gameObject == this.mainTab && this.clickAction == false) {
                console.log('Main!!');
                this.currentTab= 'main';
                this.signature.alpha = 0;
                for(let i of this.postHolder.getChildren()){
                    //i.setTint(0xFAF28C);
                    i.alpha = 0;
                }
                for(let i of this.noteHolder.getChildren()){
                    //i.setTint(0xFAF28C);
                    i.alpha = 0;
                }
                for(let i of this.assignGroup.getChildren()) {
                    i.alpha = 0;
                }
                this.boldOne.text = this.intros[0];
                this.boldTwo.text = this.intros[1];
                this.lineOne.text = this.intros[2];
                this.lineTwo.text = this.intros[3];
                this.lineThree.text = this.intros[4];
                this.lineFour.text = this.intros[5];

            }
            if(gameObject == this.upgradeTab && this.clickAction == false) {
                console.log('Upgrade!!');
                this.currentTab= 'upgrades';
                this.signature.alpha = 0;
                this.count = 0;
                for(let i of this.postHolder.getChildren()){
                    if(this.count < this.upgrades.length){
                        i.alpha = 1;
                        i.setTint(0x00fe2d);
                        this.count++;
                    }
                    else {
                        i.alpha = 0;
                    }

                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    if(this.count < this.upgrades.length){
                        i.alpha = 1;
                        i.text = this.upgrades[this.count].postName;
                        this.count++;
                    }
                    else {
                        i.alpha = 0;
                    }
                }
                for(let i of this.assignGroup.getChildren()) {
                    i.alpha = 0;
                }
                this.boldOne.text = 'Time to Upgrade';
                this.boldTwo.text = 'your factory';
                this.lineOne.text = 'Line your pockets';
                this.lineTwo.text = 'with cash to buy';
                this.lineThree.text = 'even more money!';
                this.lineFour.text = 'No matter the price...';

            }
            if(gameObject == this.contractTab && this.clickAction == false) {
                console.log('Contract!!');
                this.currentTab= 'contracts';
                this.signature.alpha = 0;
                this.count = 0; 
                for(let i of this.postHolder.getChildren()){
                    if(this.count < this.contracts.length){
                        i.alpha = 1;
                        i.setTint(0xFF1493);
                        this.count++;
                    }
                    else {
                        i.alpha = 0;
                    }
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    if(this.count < this.contracts.length){
                        i.alpha = 1;
                        i.text = this.contracts[this.count].postName;
                        this.count++;
                    }
                    else {
                        i.alpha = 0;
                    }
                }
                for(let i of this.assignGroup.getChildren()) {
                    i.alpha = 0;
                }
                this.boldOne.text = 'A few Contracts';
                this.boldTwo.text = 'came in the mail';
                this.lineOne.text = 'Sell the fruits of your';
                this.lineTwo.text = 'labor up the ladder!';
                this.lineThree.text = 'Ethical deals til';
                this.lineFour.text = 'coprate gets their way';
            }
            if(gameObject == this.buyTab && this.clickAction == false) {
                console.log('Buy!!');  
                this.currentTab= 'buy';
                this.signature.alpha = 0;
                this.count = 0;
                for(let i of this.postHolder.getChildren()){
                    if(this.count < 4) {
                        i.alpha = 1;
                        i.setTint(0x0dd5fc);
                        this.count++;
                    } else{ 
                        i.alpha = 0;
                    }
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.categories[this.count];//this.openIng[this.count];
                    this.count++;
                }
                this.boldOne.text = 'Restock at your';
                this.boldTwo.text = 'leisure';
                this.lineOne.text = 'The finest ingrdients';
                this.lineTwo.text = 'one can buy! ';
                this.lineThree.text = 'Or at least for someone ';
                this.lineFour.text = 'with your budget!';
            }

            //post-it clicks
            if(gameObject == this.postIt && this.clickAction == false) {
                this.element = 0;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }

            if(gameObject == this.postItTwo && this.clickAction == false) {
                this.element = 1;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }
            if(gameObject == this.postItThree && this.clickAction == false) {
                this.element = 2;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }

            }
            if(gameObject == this.postItFour && this.clickAction == false) {
                this.element = 3;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }
            if(gameObject == this.postItFive && this.clickAction == false) {
                this.element = 4;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }
            if(gameObject == this.postItSix && this.clickAction == false) {
                this.element = 5;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }
            if(gameObject == this.postItSeven && this.clickAction == false) {
                this.element = 6;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }
            if(gameObject == this.postItEight && this.clickAction == false) {
                this.element = 7;
                this.signature.alpha = 1;
                if (this.currentTab == 'upgrades') {
                    this.getUpgrades(this.element);
                }
                else if(this.currentTab == 'contracts'){
                    this.getContracts(this.element);
                }
                else if(this.currentTab == 'buy'){
                    this.getBuys(this.element);
                    for(let i of this.assignGroup.getChildren()) {
                        i.alpha = 1;
                    }
                }
            }
            if(gameObject == this.signature && this.clickAction == false) {
                console.log('Signing!')
                //play signing animation
                let signName = this.add.sprite(710, 570, 'signName');
                signName.anims.play('signAnim');
                this.time.delayedCall(3000, () => {
                    signName.destroy();
                });
                if(this.currentTab == 'upgrades') {
                    console.log('upgrading!!')
                    if(this.scenePointer.money > this.upgrades[this.element].cost){

                        this.scenePointer.spendCash(this.upgrades[this.element].cost);
                        this.scenePointer.buyUpgrades(this.upgrades[this.element].postName, this.upgrades[this.element].cost);
                        this.scenePointer.money -= this.upgrades[this.element].cost;
                        console.log('buying upgrades');
                        this.upgrades.splice(this.element, 1);
                        this.time.delayedCall(3000, () => {
                            this.boldOne.text = 'Time to Upgrade';
                            this.boldTwo.text = 'your factory';
                            this.lineOne.text = 'Line your pockets';
                            this.lineTwo.text = 'with cash to buy';
                            this.lineThree.text = 'even more money!';
                            this.lineFour.text = 'No matter the price...';
                        });
                        this.signature.alpha = 0;
                    } else {
                        this.scenePointer.buyUpgrades('insFunds');
                    }
                    this.count = 0;
                    for(let i of this.noteHolder.getChildren()){
                        if(this.count < this.upgrades.length){
                            i.text = this.upgrades[this.count].postName;
                            this.count++;
                        }
                        else {
                            i.alpha = 0;
                        }
                    }
                    this.count = 0;
                    for(let i of this.postHolder.getChildren()){
                        if(this.count < this.upgrades.length){
                            this.count++;
                        }
                        else {
                            i.alpha = 0;
                        }
                    }
                }
                else if (this.currentTab == 'contracts') {
                    console.log('contracting!!')
                    contractInfo = this.contracts[this.element];
                    this.contracts.splice(this.element, 1);
                    this.time.delayedCall(3000, () => {
                        this.boldOne.text = 'A few Contracts';
                        this.boldTwo.text = 'came in the mail';
                        this.lineOne.text = 'Sell the fruits of your';
                        this.lineTwo.text = 'labor up the ladder!';
                        this.lineThree.text = 'Ethical deals til';
                        this.lineFour.text = 'coprate gets their way';
                        this.signature.alpha = 0;
                    });
                    this.count = 0;
                    for(let i of this.noteHolder.getChildren()) {
                        i.text = this.contracts[this.count].postName;
                        this.count++;
                    }
                }
                this.clickAction = true;
            }

            this.clickAction = true;
            this.contractInfo = ['Contract', this.lineOne._text, this.lineTwo._text, this.lineThree._text, this.lineFour._text]
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            this.clickAction = false;
        });
    }

    getUpgrades(element) {
        console.log(element);
        this.boldOne.text = this.upgrades[element].postName;
        this.boldTwo.text = this.upgrades[element].infoName;
        this.lineOne.text = this.upgrades[element].priceTag;
        this.lineTwo.text = this.upgrades[element].infoOne;
        this.lineThree.text = this.upgrades[element].infoTwo;
        this.lineFour.text = this.upgrades[element].infoThree;
    }
    getContracts(element) {
        console.log(element);
        this.boldOne.text = this.contracts[element].postName;
        this.boldTwo.text = this.contracts[element].multiplier;
        this.lineOne.text = this.contracts[element].infoOne;
        this.lineTwo.text = this.contracts[element].infoTwo;
        this.lineThree.text = this.contracts[element].infoThree;
        this.lineFour.text = this.contracts[element].infoFour;
    }
    getBuys(element) {
        console.log(element);
        this.boldOne.text = this.categories[element];
        this.boldTwo.text = this.catText[element];
        if(element == 0){
            this.lineOne.text = this.nuts[0];
            this.lineTwo.text = this.nuts[1];
            this.lineThree.text = this.nuts[2];
            this.lineFour.text = this.nuts[3];
        } else if(element == 1){
            this.lineOne.text = this.fruits[0];
            this.lineTwo.text = this.fruits[1];
            this.lineThree.text = this.fruits[2];
            this.lineFour.text = this.fruits[3];
        } else if(element == 2){
            this.lineOne.text = this.sweets[0];
            this.lineTwo.text = this.sweets[1];
            this.lineThree.text = this.sweets[2];
            this.lineFour.text = this.sweets[3];
        } else if(element == 3){
            this.lineOne.text = this.savorys[0];
            this.lineTwo.text = this.savorys[1];
            this.lineThree.text = this.savorys[2];
            this.lineFour.text = this.savorys[3];
        }
    }

    makeContract() {
        this.percentOne = Math.ceil((Math.random() * 100) / 5) * 5;
        if(this.percentOne > 50) {
            this.percentOne = 50;
        }
        this.percentTwo = Math.ceil((Math.random() * 100) / 5) * 5;
        if(100 - this.percentOne < this.percentTwo) {
            this.percentTwo = Math.ceil((100 - this.percentOne)/3/5)*5;
        }
        this.percentThree = Math.ceil((Math.random() * 100) / 5) * 5;
        if(100 - this.percentOne - this.percentTwo < this.percentThree) {
            this.percentThree = Math.ceil((100 - this.percentOne - this.percentTwo)/3/5)*5;;
        }
        this.percentFour = 100 - this.percentOne - this.percentTwo - this.percentThree;

        //set company name
        this.usedCompanies = [];
        this.openCompanies = [];
        this.currentCompany = '';
        for(let i = 0; i < this.contracts.length; i++){
            this.usedCompanies.push(this.contracts[i].postName);
        }
        for(let i = 0; i < this.companyNames.length; i++) {
            if(!this.usedCompanies.includes(this.companyNames[i])) {
                this.currentCompany = this.companyNames[i];
                break;
            }
        }
        this.multi = this.multChanges[Math.floor(Math.random() * this.multChanges.length)]
        this.madeContract = {
            postName: this.currentCompany,
            infoName: 'An Offical Contract',
            multiplier: this.multi.toString().concat( ' Multiplier'),
            multTag: this.multi,
            infoOne: '',
            infoTwo: '',
            infoThree: '',
            infoFour: '',
            percentOne: this.percentOne,
            percentTwo: this.percentTwo,
            percentThree: this.percentThree,
            percentFour: this.percentFour,
            ammount: (Math.floor(Math.random() * 20) + 5).toString().concat(' Left')
        }
        this.usedIng = []
        for (let i = 0; i < 4; i++) {
            this.ing = this.openIng[Math.floor(Math.random() * this.openIng.length)]
            if(!this.usedIng.includes(this.ing)) {
                if(this.madeContract.infoOne == '') {
                    this.madeContract.infoOne = this.percentOne.toString().concat('% ', this.ing);
                    this.usedIng.push(this.ing);
                }
                else if (this.madeContract.infoTwo == '') {
                    this.madeContract.infoTwo = this.percentTwo.toString().concat('% ', this.ing);
                    this.usedIng.push(this.ing);
                }
                else if(this.madeContract.infoTwo == '') {
                    this.madeContract.infoTwo = this.percentTwo.toString().concat('% ', this.ing);
                    this.usedIng.push(this.ing);
                }
                else if(this.madeContract.infoThree == '') {
                    this.madeContract.infoThree = this.percentThree.toString().concat('% ', this.ing);
                    this.usedIng.push(this.ing);
                }
                else if (this.madeContract.infoFour == ''){
                    this.madeContract.infoFour = this.percentFour.toString().concat('% ', this.ing);
                    this.usedIng.push(this.ing);
                }
            }
            else {
                i--;
            }
        }
        this.contracts.push(this.madeContract);
    }

}