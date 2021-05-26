class PlayMenu extends Phaser.Scene {
    constructor() {
        super("playMenuScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('manilla', 'manilla.png');
        this.load.image('post', 'PostIt.png')
        this.load.image('order', 'OrderForm.png')
    }

    create() {
        console.log('play menu');
        this.pauseMenu = this.add.image(80, 50, 'manilla').setOrigin(0, 0);
        this.postIt = this.add.image(150, 70, 'post').setOrigin(0, 0);
        this.postIt.setInteractive({
            useHandCursor: true
        });
        this.postIt.setDataEnabled;
        this.postItTwo = this.add.image(300, 70, 'post').setOrigin(0, 0);
        this.postItThree = this.add.image(150, 240, 'post').setOrigin(0, 0);
        this.postItFour = this.add.image(300, 240, 'post').setOrigin(0, 0);
        this.clickAction = false;

        //All Text
        this.upgradeConfig = { fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.nameConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.ingConfig = { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.upgradeOne  = this.add.text(game.config.width/4.5, game.config.height/6, upgrades[0], this.upgradeConfig).setOrigin(0.5,0.5);
        this.upgradeTwo  = this.add.text(game.config.width/2.65, game.config.height/6, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.upgradeThree  = this.add.text(game.config.width/4.5, game.config.height/2.5, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.upgradeFour  = this.add.text(game.config.width/2.65, game.config.height/2.5, '', this.upgradeConfig).setOrigin(0.5,0.5);
        this.company  = this.add.text(game.config.width/1.37, game.config.height/4, 'Welcome Young', this.nameConfig).setOrigin(0.5,0.5);
        this.multiplier = this.add.text(game.config.width/1.37, game.config.height/3, 'Capitalist!', this.nameConfig).setOrigin(0.5,0.5);
        this.ingOne  = this.add.text(game.config.width/1.37, game.config.height/2.3, 'Buy upgrades on the left', this.ingConfig).setOrigin(0.5,0.5);
        this.ingTwo  = this.add.text(game.config.width/1.37, game.config.height/1.95, 'Get Contracts on right', this.ingConfig).setOrigin(0.5,0.5);
        this.ingThree  = this.add.text(game.config.width/1.37, game.config.height/1.7, 'You will now be charged', this.ingConfig).setOrigin(0.5,0.5);
        this.ingFour  = this.add.text(game.config.width/1.37, game.config.height/1.5, '$3 for this', this.ingConfig).setOrigin(0.5,0.5);
        

        //Text Arrays
        this.companyNames = ['Scam Co.', 'Capital Inc', 'Extore Shun Ltd']
        this.multChanges = ['x1.1', 'x1.2', 'x0.9']
        this.ingredients = ['Peanuts', 'Raisins', 'M&Ms', 'Almonds']

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            console.log('esc');
            this.scene.sleep('playMenuScene');
            this.scene.resume('playScene');
        }
        this.input.on('gameobjectdown', (pointer, gameObject, event) => {
            console.log(upgrades);
            // console.log(gameObject);
            // console.log(event);
            if(gameObject == this.postIt && this.clickAction == false) {
                this.company.text = this.companyNames[2];
                this.multiplier.text = this.multChanges[1];
                this.ingOne.text = this.ingredients[0];
                this.ingTwo.text = this.ingredients[1];
                this.ingThree.text = this.ingredients[2];
                this.ingFour.text = this.ingredients[3];
                upgrades.shift();
                this.upgradeOne.text = upgrades[0];
                this.upgradeTwo.text = upgrades[1];
                this.upgradeThree.text = upgrades[2];
                this.upgradeFour.text = upgrades[3];
            }
            this.clickAction = true;
            contractInfo = ['Contract', this.ingOne._text, this.ingTwo._text, this.ingThree._text, this.ingFour._text]
        });
        this.input.on('gameobjectup', (pointer, gameObject, event) => {
            this.clickAction = false;
        });
    }

}