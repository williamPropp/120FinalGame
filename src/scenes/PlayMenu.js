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

        //All Text
        this.upgradeConfig = { fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.nameConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.ingConfig = { fontFamily: 'Helvetica', fontSize: '30px', backgroundColor: '#00000000', color: '#000000', align: 'center' };
        this.upgradeOne  = this.add.text(game.config.width/4.5, game.config.height/6, 'Contracts', this.upgradeConfig).setOrigin(0.5,0.5);
        this.company  = this.add.text(game.config.width/1.37, game.config.height/4, 'Welcome Young', this.nameConfig).setOrigin(0.5,0.5);
        this.multiplier = this.add.text(game.config.width/1.37, game.config.height/3, 'Capitalist!', this.nameConfig).setOrigin(0.5,0.5);
        this.ingOne  = this.add.text(game.config.width/1.37, game.config.height/2.3, 'Buy upgrades on the left', this.ingConfig).setOrigin(0.5,0.5);
        this.ingTwo  = this.add.text(game.config.width/1.37, game.config.height/1.95, 'Get Contracts on right', this.ingConfig).setOrigin(0.5,0.5);
        this.ingThree  = this.add.text(game.config.width/1.37, game.config.height/1.7, 'You will now be charged', this.ingConfig).setOrigin(0.5,0.5);
        this.ingFour  = this.add.text(game.config.width/1.37, game.config.height/1.5, '$3 for this', this.ingConfig).setOrigin(0.5,0.5);
        

        //Text Arrays
        this.companyNames = ['Scam Co.', 'Capital Inc', 'Extor Shun Ltd']
        this.multChanges = ['x1.1', 'x1.2', 'x0.9']
        this.ingredients = ['Raisins', 'Nuts', 'M&Ms', '']

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
            console.log(this.company);
            // console.log(gameObject);
            // console.log(event);
            this.company.text = this.companyNames[2];
            this.multiplier.text = this.multChanges[1];
            this.ingOne.text = this.ingredients[0];
            this.ingTwo.text = this.ingredients[1];
            this.ingThree.text = this.ingredients[2];
            this.ingFour.text = this.ingredients[3];
            this.upgradeOne.text = 'Next One'
        });
    }

}