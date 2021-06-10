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
        this.load.image('sign','Sign.png');
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
        // this.mainTab = this.add.image(83, game.config.height/9, 'plain').setOrigin(0, 0);
        // this.mainTab.setInteractive({
        //     useHandCursor: true
        // });
        // this.mainTab.setDataEnabled;
        // this.upgradeTab = this.add.image(83, game.config.height/9*2.8, 'green').setOrigin(0, 0);
        // this.upgradeTab.setInteractive({
        //     useHandCursor: true
        // });
        // this.upgradeTab.setDataEnabled;
        // this.contractTab = this.add.image(83, game.config.height/9*4.6, 'red').setOrigin(0, 0);
        // this.contractTab.setInteractive({
        //     useHandCursor: true
        // });
        // this.contractTab.setDataEnabled;
        // this.buyTab = this.add.image(83, game.config.height/9*6.4, 'blue').setOrigin(0, 0);
        // this.buyTab.setInteractive({
        //     useHandCursor: true
        // });
        // this.buyTab.setDataEnabled;

        //tab setup
        this.mainTab = this.add.image(83, game.config.height/9, 'plain').setOrigin(0, 0);
        this.upgradeTab = this.add.image(83, game.config.height/9*2.8, 'green').setOrigin(0, 0);
        this.contractTab = this.add.image(83, game.config.height/9*4.6, 'red').setOrigin(0, 0);
        this.buyTab = this.add.image(83, game.config.height/9*6.4, 'blue').setOrigin(0, 0);

        this.tabsHolder = this.add.group();
        this.tabsHolder.addMultiple([this.mainTab, this.upgradeTab, this.contractTab, this.buyTab]);

        for(let t of this.tabsHolder.getChildren()) {
            t.setInteractive({
                useHandCursor: true
            });
            t.setDataEnabled;
        }
        this.contractTab.alpha = 0;

        //post-it setup
        // this.postIt = this.add.image(150, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postIt.setInteractive({
        //     useHandCursor: true
        // });
        // this.postIt.setDataEnabled;
        // this.postItTwo = this.add.image(300, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItTwo.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItTwo.setDataEnabled;
        // this.postItThree = this.add.image(150, 220, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItThree.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItThree.setDataEnabled;
        // this.postItFour = this.add.image(300, 220, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItFour.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItFour.setDataEnabled;
        // this.postItFive = this.add.image(150, 370, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItFive.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItFive.setDataEnabled;
        // this.postItSix = this.add.image(300, 370, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItSix.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItSix.setDataEnabled;
        // this.postItSeven = this.add.image(150, 520, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItSeven.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItSeven.setDataEnabled;
        // this.postItEight = this.add.image(300, 520, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        // this.postItEight.setInteractive({
        //     useHandCursor: true
        // });
        // this.postItEight.setDataEnabled;

        //Create post-its
        this.postIt = this.add.image(150, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItTwo = this.add.image(300, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItThree = this.add.image(150, 220, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItFour = this.add.image(300, 220, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItFive = this.add.image(150, 370, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItSix = this.add.image(300, 370, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItSeven = this.add.image(150, 520, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItEight = this.add.image(300, 520, 'post').setOrigin(0, 0).setTint(0xFAF28C);

        this.postHolder = this.add.group();
        this.postHolder.addMultiple([this.postIt, this.postItTwo,this.postItThree, this.postItFour,this.postItFive,this.postItSix,this.postItSeven,this.postItEight]);
        let postItCounter = 0;
        for(let p of this.postHolder.getChildren()){
            p.alpha = 0;
            p.setDataEnabled;
            p.setData('elementIndex', postItCounter);
            postItCounter++;
            p.setInteractive({
                useHandCursor: true
            }).on('pointerdown', function(pointer, localX, localY, event){
                this.scene.deselectObj('all');
            }).on('pointerup', function(pointer, localX, localY, event){
                this.scene.deselectObj('all');
            });
        }
        this.clickAction = false;

        //buttons
        // this.assignOne  = this.add.image(560, 510, 'first').setOrigin(0,0);
        // this.assignOne.setInteractive({
        //     useHandCursor: true
        // });
        // this.assignOne.setDataEnabled;
        // this.assignTwo  = this.add.image(620, 510, 'second').setOrigin(0,0);
        // this.assignTwo.setInteractive({
        //     useHandCursor: true
        // });
        // this.assignTwo.setDataEnabled;
        // this.assignThree  = this.add.image(680, 510, 'third').setOrigin(0,0);
        // this.assignThree.setInteractive({
        //     useHandCursor: true
        // });
        // this.assignThree.setDataEnabled;
        // this.assignFour  = this.add.image(740, 510, 'fourth').setOrigin(0,0);
        // this.assignFour.setInteractive({
        //     useHandCursor: true
        // });
        // this.assignFour.setDataEnabled;
        // this.assignFive  = this.add.image(800, 510, 'fifth').setOrigin(0,0);
        // this.assignFive.setInteractive({
        //     useHandCursor: true
        // });
        // this.assignFive.setDataEnabled;

        //Create dispenser selector buttons for ingredient tab
        this.assignOne  = this.add.image(560, 510, 'first').setOrigin(0,0);
        this.assignTwo  = this.add.image(620, 510, 'second').setOrigin(0,0);
        this.assignThree  = this.add.image(680, 510, 'third').setOrigin(0,0);
        this.assignFour  = this.add.image(740, 510, 'fourth').setOrigin(0,0);
        this.assignFive  = this.add.image(800, 510, 'fifth').setOrigin(0,0);

        this.assignGroup = this.add.group();
        this.assignGroup.addMultiple([this.assignOne, this.assignTwo, this.assignThree,this.assignFour,this.assignFive]);

        for(let i of this.assignGroup.getChildren()) {
            i.alpha = 0;
            i.setDataEnabled;
            // i.setData('selected', false)
            this.deselectObj(i, 'assign');

            let assignGroupPointer = this.assignGroup;

            i.setInteractive({
                useHandCursor: true
            }).on('pointerdown', function(pointer, localX, localY, event){
                for(let j of assignGroupPointer.getChildren()) {
                    //Selection handler
                    if(i == j) {
                        (j.getData('selected')) ? this.scene.deselectObj(j, 'assign') : this.scene.selectObj(j, 'assign'); //If the dispenser is already selected, deselect it
                    } else {
                        this.scene.deselectObj(j, 'assign'); //Deselect every other dispenser selector
                    }

                }
            });
        }

        this.assignOne.setData('disp', this.scenePointer.dispenser1);
        this.assignTwo.setData('disp', this.scenePointer.dispenser2);
        this.assignThree.setData('disp', this.scenePointer.dispenser3);
        this.assignFour.setData('disp', this.scenePointer.dispenser4);
        this.assignFive.setData('disp', this.scenePointer.dispenser5);

        //Text Arrays
        this.intros = ['Welcome Young','Capitalist!','Use the tabs on the side','to navigate our files.','Click on sticky notes','to see more info!']
        this.contractInfo = ['Motivation','You invested all','your money in','this. Good luck', 'lol']
        this.companyNames = ['Scam Co.', 'Capital Inc', 'Nuts TM', 'Rob Airy co', 'Small Mix Inc', 'Big Mix TM', 'Company Co', 'Snackz Inc', 'Trails TM']
        this.multChanges = [0.7, 0.8, 0.9, 1.1, 1.2, 1.3]
        this.openIng = ['Peanuts', 'Raisins', 'M&Ms', 'Almonds']
        this.ingredients = [];
        this.categories = ['Nuts', 'Fruits', 'Sweet', 'Savory'];
        this.nuts = ['Peanuts', 'Almonds', '???', '???'];
        this.fruits = ['Raisins', '???', '???', '???'];
        this.sweets = ['M&Ms', '???', '???', '???'];
        this.savorys = ['Pretzels', '???', '???', '???'];
        this.catText = ['A classic filler', 'Dried to Perfection', 'The best Part', 'Insert Text'];

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
        this.noteHolder.addMultiple([this.noteOne,this.noteTwo,this.noteThree,this.noteFour, this.noteFive, this.noteSix, this.noteSeven,this.noteEight]);

        this.textLineGroup = this.add.group(); 
        this.textLineGroup.addMultiple([this.lineOne, this.lineTwo, this.lineThree, this.lineFour]);

        //Make upgrade objs
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
            infoThree: 'Almond',
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
        
        this.upgrades = [this.openContracts, this.bag2x, this.dispenserOne, this.bag4x, this.dispenserTwo, this.bag8x, this.bag16x, this.lobbyOne, this.lobbyTwo, this.lobbyThree];
        this.contracts = [];
        if (localStorage.getItem('LobbyIII') != null){
            this.upgrades.splice(9,1);
        }
        if (localStorage.getItem('LobbyII') != null){
            this.upgrades.splice(8,1);
        }
        if (localStorage.getItem('LobbyI') != null){
            this.upgrades.splice(7,1);
        }
        if (localStorage.getItem('Bag16x') != null){
            this.upgrades.splice(6,1);
        }
        if (localStorage.getItem('Bag8x') != null){
            this.upgrades.splice(5,1);
        }
        if (localStorage.getItem('disp5Type') != null){
            this.upgrades.splice(4,1);
        }
        if (localStorage.getItem('Bag4x') != null){
            this.upgrades.splice(3,1);
        }
        if (localStorage.getItem('disp4Type') != null){
            this.upgrades.splice(2,1);
        }
        if (localStorage.getItem('Bag2x') != null){
            this.upgrades.splice(1,1);
        }
        


        //Define keys
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(this.contracts.length < 9){
            this.makeContract();
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyESC)) {
            // for(let i of this.textLineGroup.getChildren()) {
            //     this.deselectObj(i, 'text');
            // }
            // for(let d of this.assignGroup.getChildren()) {
            //     this.deselectObj(d, 'assign');
            // }
            this.deselectObj('all');
            this.scene.sleep('playMenuScene');
            this.scene.resume('playScene');
        }

        this.input.on('gameobjectdown', (pointer, gameObject, event) => {

            //Select tab
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

            //Upgrade tab
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

            //Contract tab
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

            //Ingredient purchase tab
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

            for(let p of this.postHolder.getChildren()) {
                if(gameObject == p && this.clickAction == false) {
                    this.element = p.getData('elementIndex');
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
            }
            // //post-it clicks
            // if(gameObject == this.postIt && this.clickAction == false) {
            //     this.element = 0;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }

            // if(gameObject == this.postItTwo && this.clickAction == false) {
            //     this.element = 1;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }
            // if(gameObject == this.postItThree && this.clickAction == false) {
            //     this.element = 2;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }

            // }
            // if(gameObject == this.postItFour && this.clickAction == false) {
            //     this.element = 3;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }
            // if(gameObject == this.postItFive && this.clickAction == false) {
            //     this.element = 4;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }
            // if(gameObject == this.postItSix && this.clickAction == false) {
            //     this.element = 5;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }
            // if(gameObject == this.postItSeven && this.clickAction == false) {
            //     this.element = 6;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }
            // if(gameObject == this.postItEight && this.clickAction == false) {
            //     this.element = 7;
            //     this.signature.alpha = 1;
            //     if (this.currentTab == 'upgrades') {
            //         this.getUpgrades(this.element);
            //     }
            //     else if(this.currentTab == 'contracts'){
            //         this.getContracts(this.element);
            //     }
            //     else if(this.currentTab == 'buy'){
            //         this.getBuys(this.element);
            //         for(let i of this.assignGroup.getChildren()) {
            //             i.alpha = 1;
            //         }
            //     }
            // }


            if(gameObject == this.signature && this.clickAction == false) {
                // console.log('Signing!')
                // //play signing animation
                // let signName = this.add.sprite(710, 570, 'signName');
                // signName.anims.play('signAnim');
                // this.time.delayedCall(3000, () => {
                //     signName.destroy();
                // });

                if(this.currentTab == 'upgrades') {
                    console.log('upgrading!!')
                    if(this.scenePointer.money > this.upgrades[this.element].cost){

                        this.scenePointer.spendCash(this.upgrades[this.element].cost);
                        this.buyUpgrades(this.upgrades[this.element].postName, this.upgrades[this.element].cost);
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
                        //Play the sign animation
                        this.playSignAnim();
                    } else {
                        this.buyUpgrades('insFunds');
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
                } else if(this.currentTab == 'contracts') {
                    //Play the sign animation
                    this.playSignAnim();

                    console.log('contracting!!');
                    contractInfo = this.contracts[this.element]; //I think maybe you meant to write this.contractInfo?
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
                } else if(this.currentTab == 'buy') {
                    // console.log('buying ingredients!!');
                    let selectedIng, selectedDisp;
                    let ingExists = true;
                    for(let i of this.textLineGroup.getChildren()) {
                        if(i.getData('selected') == true) {
                            selectedIng = i.text;
                            if(selectedIng == '???') {
                                this.purchaseError('ing???');
                                ingExists = false;
                                this.deselectObj('all');
                            } else {
                                selectedIng = selectedIng.toLocaleLowerCase().slice(0, selectedIng.length - 1); //Make sure the ingredient name in the text is in the format 'Peanuts', 'Almonds', etc. Capital first, ending with s;
                                console.log(selectedIng);
                                this.deselectObj(i, 'text');
                            }
                            // this.time.delayedCall(3000, () => {
                            //     this.deselectObj(i, 'text');
                            // });
                        }
                    }
                    let upgradeExists = true;
                    for(let d of this.assignGroup.getChildren()) {
                        if(d.getData('selected') == true) {
                            selectedDisp = d.getData('disp');
                            //If the selected dispenser if 4 or 5, check if the dispenser upgrade has been Purchased
                            if(selectedDisp == this.scenePointer.dispenser4 || selectedDisp == this.scenePointer.dispenser5) {
                                if(localStorage.getItem('disp4Type') == null || localStorage.getItem('disp5Type') == null) {
                                    this.purchaseError('lackOfUpgrade', selectedDisp);
                                    upgradeExists = false;
                                    this.deselectObj('all');
                                }
                            }
                        }
                    }
                    if((selectedIng == null || selectedDisp == null) && upgradeExists && ingExists) {
                        this.purchaseError('incompleteSelection');
                        this.deselectObj('all');
                    } else if(upgradeExists && ingExists){
                        let priceToBuyIngredient = this.calculateBuyPrice(selectedIng);
                        if(this.scenePointer.money > priceToBuyIngredient) {
                            console.log('buying ingredients!!');
                            //Play the sign animation
                            this.playSignAnim();
                            console.log(selectedDisp);
                            console.log(selectedIng);
                            selectedDisp.changeType(selectedIng);
                            this.scenePointer.spendCash(priceToBuyIngredient);
                            this.deselectObj('all');
                            // selectedDisp = null;
                            // selectedIng = null;
                        } else {
                            this.purchaseError('insFunds', priceToBuyIngredient);
                        }
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

        let textIndex = 0;

        // if(element == 0){
        //     this.lineOne.text = this.nuts[0];
        //     this.lineTwo.text = this.nuts[1];
        //     this.lineThree.text = this.nuts[2];
        //     this.lineFour.text = this.nuts[3];
        // } else if(element == 1){
        //     this.lineOne.text = this.fruits[0];
        //     this.lineTwo.text = this.fruits[1];
        //     this.lineThree.text = this.fruits[2];
        //     this.lineFour.text = this.fruits[3];
        // } else if(element == 2){
        //     this.lineOne.text = this.sweets[0];
        //     this.lineTwo.text = this.sweets[1];
        //     this.lineThree.text = this.sweets[2];
        //     this.lineFour.text = this.sweets[3];
        // } else if(element == 3){
        //     this.lineOne.text = this.savorys[0];
        //     this.lineTwo.text = this.savorys[1];
        //     this.lineThree.text = this.savorys[2];
        //     this.lineFour.text = this.savorys[3];
        // }

        for(let t of this.textLineGroup.getChildren()) {
            if(element == 0){
                t.text = this.nuts[textIndex];
            } else if(element == 1){
                t.text = this.fruits[textIndex];
            } else if(element == 2){
                t.text = this.sweets[textIndex];
            } else if(element == 3){
                t.text = this.savorys[textIndex];
            }
            textIndex++;

            let textGroupPointer = this.textLineGroup;

            t.setDataEnabled;
            this.deselectObj(t, 'text')
            t.setInteractive({
                useHandCursor: true
            }).on('pointerdown', function(/*pointer, localX, localY, event*/){
                for(let u of textGroupPointer.getChildren()) {
                    if(t == u) {
                        (u.getData('selected')) ? this.scene.deselectObj(u, 'text') : this.scene.selectObj(u, 'text'); //If the ingredient is already selected, deselect it
                    } else {
                        this.scene.deselectObj(u, 'text'); //Deselect every other ingredient
                    }
                }
            });
        }
    }

    //Call when selecting ingredients or dispensers in buy tab
    selectObj(obj, type) {
        obj.setData('selected', true);
        if(type == 'assign') {
            obj.setTint(0xbababa);
        } else if(type == 'text') {
            obj.setStyle({
                color: '#FFFFFF',
                backgroundColor: '#bababa'
            });
        } else {
            console.log('invalid type in selectObj() in playMenuScene')
        }
    }

    //Call when selecting ingredients or dispensers in buy tab
    deselectObj(obj, type) {
        if(obj == null) {
            console.log('null passed as obj arg in deselectObj');
            return;
        }
        // obj.setData('selected', false);
        if(type == 'assign') {
            obj.setTint(0xFFFFFF);
        } else if(type == 'text') {
            obj.setStyle({
                color: '#000000',
                backgroundColor: '#00000000'
            });
        } else if(obj == 'all') {
            for(let i of this.textLineGroup.getChildren()) {
                this.deselectObj(i, 'text');
            }
            for(let d of this.assignGroup.getChildren()) {
                this.deselectObj(d, 'assign');
            }
            return;
        } else {
            console.log('invalid type in deselectObj() in playMenuScene');
            return;
        }
        obj.setData('selected', false);
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
        this.amountMaker = Math.floor(Math.random() * 20) + 5
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
            amountString: this.amountMaker.toString().concat(' Left'),
            amount: this.amountMaker
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

    //Purchase Upgrades
    buyUpgrades(upgradeStr, price) {
        this.lobby = false;
        if(!this.upgrades.some(upgrade => upgrade.postName === "LobbyI")){
            this.lobby = true;
        }
        if(upgradeStr == 'Contracts') {
            this.contractTab.alpha = 1;
        }
        if(upgradeStr == 'Dispenser I') {
            console.log('disp4 bought');
            this.scenePointer.dispenser4 = new Dispenser(this.scenePointer, 565, 0, 'dispenser', null, 'almond', 4, this.lobby, 'roach'); //Update x location when new sprites are added
            localStorage.setItem('disp4Type', 'almond');
        } else if(upgradeStr == 'Dispenser II') {
            console.log('disp5 bought');
            this.scenePointer.dispenser5 = new Dispenser(this.scenePointer, 675, 0, 'dispenser', null, 'pretzel', 5, this.lobby, 'roach'); //Update x location when new sprites are added
            localStorage.setItem('disp5Type', 'pretzel');
        } else if(upgradeStr == 'Bag 2x') {
            this.scenePointer.bagMultiplier = 2;
            localStorage.setItem('bagMult', 2);
            localStorage.setItem('Bag2x', 'bought');
        } else if(upgradeStr == 'Bag 4x') {
            this.scenePointer.bagMultiplier = 4;
            localStorage.setItem('bagMult', 4);
            localStorage.setItem('Bag4x', 'bought');
        } else if(upgradeStr == 'Bag 8x') {
            this.scenePointer.bagMultiplier = 8;
            localStorage.setItem('bagMult', 8);
            localStorage.setItem('Bag8x', 'bought');
        } else if(upgradeStr == 'Bag 16x') {
            this.scenePointer.bagMultiplier = 16;
            localStorage.setItem('bagMult', 16);
            localStorage.setItem('Bag16x', 'bought');
        } else if(upgradeStr == 'Lobby I') {
            this.scenePointer.lobbyMultiplier = 2;
            this.scenePointer.dispenser1.lobby = true;
            this.scenePointer.dispenser2.lobby = true;
            this.scenePointer.dispenser3.lobby = true;
            localStorage.setItem('lobbyMult', 2);
            localStorage.setItem('LobbyI', 'bought');
        } else if(upgradeStr == 'Lobby II') {
            this.scenePointer.lobbyMultiplier = 4;
            this.scenePointer.enableRatEvent = true;
            localStorage.setItem('lobbyMult', 4);
            localStorage.setItem('LobbyII', 'bought');
        } else if(upgradeStr == 'Lobby III') {
            this.scenePointer.lobbyMultiplier = 8;
            localStorage.setItem('lobbyMult', 8);
            localStorage.setItem('LobbyIII', 'bought');
        } else if (upgradeStr =='insFunds') {
            this.purchaseError('insFunds', price);
        }
    }

    //Call when a refill price needs to be calculated
    calculateBuyPrice(ingType) {
        let ingPrice = this.scenePointer.dispenser1.getIngredientData(ingType, 'price');
        let ingWeight = this.scenePointer.dispenser1.getIngredientData(ingType, 'weight');
        let priceToBuyIng = Math.ceil(ingPrice * (this.scenePointer.binWeight / ingWeight));
        return priceToBuyIng;
    }

    
    //Call when a purchase results in an error, err is the type of error, arg is any info needed to output to the play like price needed 
    purchaseError(err, arg) {
        let errStr;
        if(err == 'insFunds') { //Insufficient funds for a purchase
            console.log('you need $' + arg + ' to purchase this');
            errStr = 'You do not have enough funds, you need $' + arg + ' to purchase';
        } else if(err == 'lackOfUpgrade') { //Selected dispenser does not exist
            if(arg == this.scenePointer.dispenser4) {
                console.log('you have not purchased dispenser IV');
                errStr = 'You have not purchased dispenser IV';
            } else if (arg == this.scenePointer.dispenser5) {
                console.log('you have not purchased dispenser V');
                errStr = 'You have not purchased dispenser V';
            } else {
                console.log('invalid disp passed to purchaseError()');
            }
        } else if(err == 'ing???') { //Selected ingredient does not exist
            errStr = 'You have not unlocked this ingredient yet!';
        } else if(err == 'incompleteSelection') {
            errStr = 'You must select both an ingredient and dispenser';
        } else {
            console.log('invalid err arg in purchaseError() in playMenuScene');
            return;
        }
        let errText = this.add.text((game.config.width/4 * 3) - 20, game.config.height/6, errStr, this.scenePointer.defaultTextConfig).setOrigin(0.5,0.5);
        errText.setScale(0.4);
        errText.setStyle({wordWrap: { width: 800 }})
        this.time.delayedCall(2000, () => {
            errText.destroy();
        });
    }

    //Play the signature animation 
    playSignAnim() {
        console.log('Signing!')
        let signName = this.add.sprite(710, 570, 'signName');
        signName.anims.play('signAnim');
        signName.on('animationcomplete', () => {
            this.deselectObj('all');
            signName.destroy();
        });
    }
}