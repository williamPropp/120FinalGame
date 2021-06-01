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
    }

    create() {
        console.log('play menu');
        console.log(this.scenePointer.money);
        this.pauseMenu = this.add.image(121, 50, 'manilla').setOrigin(0, 0);
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
        this.postItThree = this.add.image(150, 240, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItThree.setInteractive({
            useHandCursor: true
        });
        this.postItThree.setDataEnabled;
        this.postItFour = this.add.image(300, 240, 'post').setOrigin(0, 0).setTint(0xFAF28C);
        this.postItFour.setInteractive({
            useHandCursor: true
        });
        this.postItFour.setDataEnabled;
        this.postHolder = this.add.group();
        this.postHolder.addMultiple([this.postIt, this.postItTwo,this.postItThree, this.postItFour]);
        for(let i of this.postHolder.getChildren()){
            i.alpha = 0;
        }
        this.clickAction = false;

        //Text Arrays
        this.intros = ['Welcome Young','Capitalist!','Use the tabs on the side','to navigate our files.','Click on sticky notes','to see more info!']
        this.contractInfo = ['Motivation','You invested all','your money in','this. Good luck', 'lol']
        this.companyNames = ['Scam Co.', 'Capital Inc', 'Nuts TM', 'Rob Airy co', 'Small Mix Inc', 'Big Mix TM']
        this.multChanges = [0.7, 0.8, 0.9, 1.1, 1.2, 1.3]
        this.openIng = ['Peanuts', 'Raisins', 'M&Ms', 'Almonds']
        this.percentages = []

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
        this.ingFour  = this.add.text(game.config.width/1.37, game.config.height/1.5, this.intros[5], this.ingConfig).setOrigin(0.5,0.5);
        this.noteOne  = this.add.text(game.config.width/4.5, game.config.height/6, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteTwo  = this.add.text(game.config.width/2.65, game.config.height/6, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteThree  = this.add.text(game.config.width/4.5, game.config.height/2.5, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteFour  = this.add.text(game.config.width/2.65, game.config.height/2.5, '', this.upgradeConfig).setOrigin(0.5,0.5);

        this.noteHolder = this.add.group();
        this.noteHolder.addMultiple([this.noteOne,this.noteTwo,this.noteThree,this.noteFour]) 

        //upgrade objs
        this.openContracts = {
            postName: 'Contracts',
            infoName: 'Sell your labor!',
            cost: 5,
            priceTag: 'Price: $5',
            infoOne: 'Pay this fee to',
            infoTwo: 'open up the world',
            infoThree: 'of being a sellout!',
        }
        this.bag2x = {
            postName: 'bag 2x',
            infoName: 'Fill twice as much!',
            cost: 10,
            priceTag: 'Price: $20',
            infoOne: 'With new deep pocket',
            infoTwo: 'technology your bags are',
            infoThree: 'bigger but the same size',
        }
        this.bag4x = {
            postName: 'bag 4x',
            infoName: 'Fill 4x as much!',
            cost: 50,
            priceTag: 'Price: $50',
            infoOne: 'Warp reality to your',
            infoTwo: 'will and redefine the',
            infoThree: 'causal trail mix bag',
        }
        this.bag8x = {
            postName: 'bag 8x',
            infoName: 'Fill 8x as much!',
            cost: 500,
            priceTag: 'Price: $500',
            infoOne: 'A spacial rift in an',
            infoTwo: 'unstable trail mix bag',
            infoThree: 'lets you stuff more in',
        }
        this.bag16x = {
            postName: 'bag 16x',
            infoName: 'Fill 16x as much!',
            cost: 5000,
            priceTag: 'Price: $5,000',
            infoOne: 'A pocket dimension in',
            infoTwo: 'the palm of you hand,',
            infoThree: 'and you used it for this?',
        }

        this.upgrades = [this.openContracts, this.bag2x,this.bag4x,this.bag8x,this.bag16x];
        this.contracts = [];

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(this.contracts.length < 5){
            this.makeContract();
        }


        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.sleep('playMenuScene');
            this.scene.resume('playScene');
        }

        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            //console.log(this.upgrades);
            // console.log(gameObject);
            // console.log(event);

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
                this.boldOne.text = this.intros[0];
                this.boldTwo.text = this.intros[1];
                this.lineOne.text = this.intros[2];
                this.lineTwo.text = this.intros[3];
                this.lineThree.text = this.intros[4];
                this.ingFour.text = this.intros[5];

            }
            if(gameObject == this.upgradeTab && this.clickAction == false) {
                console.log('Upgrade!!');
                this.currentTab= 'upgrades';
                this.signature.alpha = 0;
                for(let i of this.postHolder.getChildren()){
                    i.alpha = 1;
                    i.setTint(0x00fe2d);
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.upgrades[this.count].postName;
                    this.count++;
                }
                this.boldOne.text = 'Time to Upgrade';
                this.boldTwo.text = 'your factory';
                this.lineOne.text = 'Line your pockets';
                this.lineTwo.text = 'with cash to buy';
                this.lineThree.text = 'even more money!';
                this.ingFour.text = 'No matter the price...';

            }
            if(gameObject == this.contractTab && this.clickAction == false) {
                console.log('Contract!!');
                this.currentTab= 'contracts';
                this.signature.alpha = 0;
                for(let i of this.postHolder.getChildren()){
                    i.alpha = 1;
                    i.setTint(0xFF1493);
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.contracts[this.count].postName;
                    this.count++;
                }
                this.boldOne.text = 'A few Contracts';
                this.boldTwo.text = 'came in the mail';
                this.lineOne.text = 'Sell the fruits of your';
                this.lineTwo.text = 'labor up the ladder!';
                this.lineThree.text = 'Ethical deals til';
                this.ingFour.text = 'coprate gets their way';
            }
            if(gameObject == this.buyTab && this.clickAction == false) {
                console.log('Buy!!');  
                this.currentTab= 'buy';
                this.signature.alpha = 0;
                for(let i of this.postHolder.getChildren()){
                    i.alpha = 1;
                    i.setTint(0x0dd5fc);
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.openIng[this.count];
                    this.count++;
                }
                this.boldOne.text = 'Restock at your';
                this.boldTwo.text = 'leisure';
                this.lineOne.text = 'The finest ingrdients';
                this.lineTwo.text = 'one can buy! ';
                this.lineThree.text = 'Or at least for someone ';
                this.ingFour.text = 'with your budget!';
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
                    this.clickAction = true;
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
                    this.clickAction = true;
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
                    this.clickAction = true;
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
                    this.clickAction = true;
                }
            }
            if(gameObject == this.signature && this.clickAction == false) {
                console.log('Signing!')
                if(this.currentTab == 'upgrades') {
                    console.log('upgrading!!')
                    if(this.scenePointer.money > this.upgrades[this.element].cost){
                        console.log(this.scenePointer.money);
                        this.scenePointer.money -= this.upgrades[this.element].cost;
                        console.log(this.scenePointer.money);
                        this.upgrades.splice(this.element, 1);
                        this.boldOne.text = 'Time to Upgrade';
                        this.boldTwo.text = 'your factory';
                        this.lineOne.text = 'Line your pockets';
                        this.lineTwo.text = 'with cash to buy';
                        this.lineThree.text = 'even more money!';
                        this.ingFour.text = 'No matter the price...';
                        this.signature.alpha = 0;
                    }
                    if(this.upgrades.length > 0) {
                        this.noteOne.text = this.upgrades[0].postName;
                    }
                    else{
                        this.noteOne.text = '';
                    }
                    if(this.upgrades.length > 1) {
                        this.noteTwo.text = this.upgrades[1].postName;
                    }
                    else{
                        this.noteTwo.text = '';
                    }
                    if(this.upgrades.length > 2) {
                        this.noteThree.text = this.upgrades[2].postName;
                    }
                    else{
                        this.noteThree.text = '';
                    }
                    if(this.upgrades.length > 3) {
                        this.noteFour.text = this.upgrades[3].postName;
                    }
                    else{
                        this.noteFour.text = '';
                    }
                }
                else if (this.currentTab == 'contracts') {
                    console.log('contracting!!')
                    this.contracts.splice(this.element, 1);
                    this.boldOne.text = 'A few Contracts';
                    this.boldTwo.text = 'came in the mail';
                    this.lineOne.text = 'Sell the fruits of your';
                    this.lineTwo.text = 'labor up the ladder!';
                    this.lineThree.text = 'Ethical deals til';
                    this.ingFour.text = 'coprate gets their way';
                    this.signature.alpha = 0;
                    if(this.upgrades.length > 0) {
                        this.noteOne.text = this.contracts[0].postName;
                    }
                    else{
                        this.noteOne.text = '';
                    }
                    if(this.upgrades.length > 1) {
                        this.noteTwo.text = this.contracts[1].postName;
                    }
                    else{
                        this.noteTwo.text = '';
                    }
                    if(this.upgrades.length > 2) {
                        this.noteThree.text = this.contracts[2].postName;
                    }
                    else{
                        this.noteThree.text = '';
                    }
                    if(this.upgrades.length > 3) {
                        this.noteFour.text = this.contracts[3].postName;
                    }
                    else{
                        this.noteFour.text = '';
                    }
                }
                this.clickAction = true;
            }

            this.clickAction = true;
            this.contractInfo = ['Contract', this.lineOne._text, this.lineTwo._text, this.lineThree._text, this.ingFour._text]
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            this.clickAction = false;
        });
        // console.log(this.money);
    }

    getUpgrades(element) {
        console.log(element);
        this.boldOne.text = this.upgrades[element].postName;
        this.boldTwo.text = this.upgrades[element].infoName;
        this.lineOne.text = this.upgrades[element].priceTag;
        this.lineTwo.text = this.upgrades[element].infoOne;
        this.lineThree.text = this.upgrades[element].infoTwo;
        this.ingFour.text = this.upgrades[element].infoThree;
    }
    getContracts(element) {
        console.log(element);
        this.boldOne.text = this.contracts[element].postName;
        this.boldTwo.text = this.contracts[element].multiplier;
        this.lineOne.text = this.contracts[element].infoOne;
        this.lineTwo.text = this.contracts[element].infoTwo;
        this.lineThree.text = this.contracts[element].infoThree;
        this.ingFour.text = this.contracts[element].infoFour;
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
        console.log(this.percentOne, this.percentTwo, this.percentThree, this.percentFour);

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
        console.log(this.infoWriter);
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
            percentFour: this.percentFour
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
        console.log(this.madeContract.postName);
    }

}