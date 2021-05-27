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
    }

    create() {
        console.log('play menu');
        console.log(this.scenePointer.money);
        this.pauseMenu = this.add.image(121, 50, 'manilla').setOrigin(0, 0);
        this.currentTab = 'main';

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
        this.postItTwo = this.add.image(300, 70, 'post').setOrigin(0, 0).setTint(0xFAF28C);;
        this.postItThree = this.add.image(150, 240, 'post').setOrigin(0, 0).setTint(0xFAF28C);;
        this.postItFour = this.add.image(300, 240, 'post').setOrigin(0, 0).setTint(0xFAF28C);;
        this.postHolder = this.add.group();
        this.postHolder.addMultiple([this.postIt, this.postItTwo,this.postItThree, this.postItFour]);
        for(let i of this.postHolder.getChildren()){
            i.alpha = 0;
        }
        this.clickAction = false;

        //Text Arrays
        this.intros = ['Welcome Young','Capitalist!','Use the tabs on the side','to navigate our files.','Click on sticky notes','to see more info!']
        this.contractInfo = ['Motivation','You invested all','your money in','this. Good luck', 'lol']
        this.contracts = ['Offer 1','Offer 2','Offer 3','Offer 4','Offer 5','Offer 6'];
        this.upgrades = ['Contracts', 'Marketing', 'Farmers', 'Exploitation', 'Raisins', 'Files'];
        this.companyNames = ['Scam Co.', 'Capital Inc', 'Extore Shun TM', 'Rob Airy co']
        this.multChanges = ['x1.1', 'x1.2', 'x0.9']
        this.ingredients = ['Peanuts', 'Raisins', 'M&Ms', 'Almonds']
        this.percentages = []

        //All Text
        this.upgradeConfig = { fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.nameConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.ingConfig = { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.company  = this.add.text(game.config.width/1.37, game.config.height/4, this.intros[0], this.nameConfig).setOrigin(0.5,0.5);
        this.multiplier = this.add.text(game.config.width/1.37, game.config.height/3, this.intros[1], this.nameConfig).setOrigin(0.5,0.5);
        this.ingOne  = this.add.text(game.config.width/1.37, game.config.height/2.3, this.intros[2], this.ingConfig).setOrigin(0.5,0.5);
        this.ingTwo  = this.add.text(game.config.width/1.37, game.config.height/1.95, this.intros[3], this.ingConfig).setOrigin(0.5,0.5);
        this.ingThree  = this.add.text(game.config.width/1.37, game.config.height/1.7, this.intros[4], this.ingConfig).setOrigin(0.5,0.5);
        this.ingFour  = this.add.text(game.config.width/1.37, game.config.height/1.5, this.intros[5], this.ingConfig).setOrigin(0.5,0.5);
        this.noteOne  = this.add.text(game.config.width/4.5, game.config.height/6, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteTwo  = this.add.text(game.config.width/2.65, game.config.height/6, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteThree  = this.add.text(game.config.width/4.5, game.config.height/2.5, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.noteFour  = this.add.text(game.config.width/2.65, game.config.height/2.5, '', this.upgradeConfig).setOrigin(0.5,0.5);

        this.noteHolder = this.add.group();
        this.noteHolder.addMultiple([this.noteOne,this.noteTwo,this.noteThree,this.noteFour]) 

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
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
                for(let i of this.postHolder.getChildren()){
                    //i.setTint(0xFAF28C);
                    i.alpha = 0;
                }
                for(let i of this.noteHolder.getChildren()){
                    //i.setTint(0xFAF28C);
                    i.alpha = 0;
                }
                this.company.text = this.intros[0];
                this.multiplier.text = this.intros[1];
                this.ingOne.text = this.intros[2];
                this.ingTwo.text = this.intros[3];
                this.ingThree.text = this.intros[4];
                this.ingFour.text = this.intros[5];

            }
            if(gameObject == this.upgradeTab && this.clickAction == false) {
                console.log('Upgrade!!');
                this.currentTab= 'upgrades';
                for(let i of this.postHolder.getChildren()){
                    i.alpha = 1;
                    i.setTint(0x00fe2d);
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.upgrades[this.count];
                    this.count++;
                }
                this.company.text = 'Time to Upgrade';
                this.multiplier.text = 'your factory';
                this.ingOne.text = 'Line your pockets';
                this.ingTwo.text = 'with cash to buy';
                this.ingThree.text = 'even more money!';
                this.ingFour.text = 'No matter the price...';

            }
            if(gameObject == this.contractTab && this.clickAction == false) {
                console.log('Contract!!');
                this.currentTab= 'contracts';
                for(let i of this.postHolder.getChildren()){
                    i.alpha = 1;
                    i.setTint(0xFF1493);
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.contracts[this.count];
                    this.count++;
                }
                this.company.text = 'A few Contracts';
                this.multiplier.text = 'came in the mail';
                this.ingOne.text = 'Sell the fruits of your';
                this.ingTwo.text = 'labor up the ladder!';
                this.ingThree.text = 'Ethical deals til';
                this.ingFour.text = 'coprate gets their way';
            }
            if(gameObject == this.buyTab && this.clickAction == false) {
                console.log('Buy!!');  
                this.currentTab= 'buy';
                for(let i of this.postHolder.getChildren()){
                    i.alpha = 1;
                    i.setTint(0x0dd5fc);
                }
                this.count = 0;
                for(let i of this.noteHolder.getChildren()){
                    i.alpha = 1;
                    i.text = this.ingredients[this.count];
                    this.count++;
                }
                this.company.text = 'Restock at your';
                this.multiplier.text = 'leisure';
                this.ingOne.text = 'The finest ingrdients';
                this.ingTwo.text = 'one can buy! ';
                this.ingThree.text = 'Or at least for someone ';
                this.ingFour.text = 'with your budget!';
            }

            //post-it clicks
            if(gameObject == this.postIt && this.clickAction == false && this.currentTab == 'upgrades') {
                // this.company.text = this.companyNames[2];
                // this.multiplier.text = this.multChanges[1];
                // this.ingOne.text = this.ingredients[0];
                // this.ingTwo.text = this.ingredients[1];
                // this.ingThree.text = this.ingredients[2];
                // this.ingFour.text = this.ingredients[3];
                this.upgrades.shift();
                console.log(this.upgrades);
                this.noteOne.text = this.upgrades[0];
                this.noteTwo.text = this.upgrades[1];
                this.noteThree.text = this.upgrades[2];
                this.noteFour.text = this.upgrades[3];
                this.clickAction = true;
            }
            if(gameObject == this.postIt && this.clickAction == false && this.currentTab == 'contracts') {
                // this.company.text = this.companyNames[2];
                // this.multiplier.text = this.multChanges[1];
                // this.ingOne.text = this.ingredients[0];
                // this.ingTwo.text = this.ingredients[1];
                // this.ingThree.text = this.ingredients[2];
                // this.ingFour.text = this.ingredients[3];
                this.upgrades.shift();
                console.log(this.upgrades);
                this.noteOne.text = this.upgrades[0];
                this.noteTwo.text = this.upgrades[1];
                this.noteThree.text = this.upgrades[2];
                this.noteFour.text = this.upgrades[3];
                this.clickAction = true;
            }
            this.clickAction = true;
            this.contractInfo = ['Contract', this.ingOne._text, this.ingTwo._text, this.ingThree._text, this.ingFour._text]
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            this.clickAction = false;
        });
        // console.log(this.money);
    }

    makeContract() {
        percentOne = math.random() * 10;
        percentTwo = math.random() * 10;
        percentThree = math.random() * 10;
        percentFOur = math.random() * 10;
    }

}