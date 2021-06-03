class Options extends Phaser.Scene {
    constructor() {
        super("optionsScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('menuScreenBack', 'TitleScreenBack.png');
        this.load.image('menuScreenMid', 'TitleScreenMid.png');
        this.load.image('menuScreenFront', 'TitleScreenFront.png');
        this.load.audio('soundtrack', 'PlayTrack.mp3');
    }

    create() {
        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        this.titleScreenBack = this.add.tileSprite(0, 0, 960, 720, 'menuScreenBack').setOrigin(0,0);
        this.titleScreenMid = this.add.tileSprite(-50, -50, 1030, 848, 'menuScreenMid').setOrigin(0,0);
        this.titleScreenMid.setScale(1.2);
        this.titleScreenFront = this.add.tileSprite(0, 0, 960, 720, 'menuScreenFront').setOrigin(0,0);
        this.moveDirection = true;
        
        this.defaultTextConfig = {fontSize: '30px', backgroundColor: '#0050DF', color: '#FFFFFF', align: 'center'};
        this.volTextConfig = { fontSize: '25px', color: '#FFFFFF', align: 'center'};

        this.volText = this.add.text(450, 444, 'Volume', this.defaultTextConfig).setOrigin(0.5,0.5);

        this.volume0 = this.add.rectangle(365, 475, 45, 40, 0x0000ff).setOrigin(0 ,0);
        this.vol0 = this.add.text(385, 490, '0', this.volTextConfig).setOrigin(0.5,0.5);
        this.volume50 = this.add.rectangle(420, 475, 45, 40, 0x0000ff).setOrigin(0 ,0);
        this.vol50 = this.add.text(442, 490, '50', this.volTextConfig).setOrigin(0.5,0.5);
        this.volume100 = this.add.rectangle(472, 475, 45, 40, 0x0000ff).setOrigin(0 ,0);
        this.vol100 = this.add.text(494, 490, '100', this.volTextConfig).setOrigin(0.5,0.5);

        this.dataButton = this.add.rectangle(game.config.width/2 + 275, game.config.height/2 + 200, game.config.width/6, 
                                             game.config.height/12, 0xFF2002).setOrigin(0.5,0.5);
        this.dataText = this.add.text(game.config.width/2 + 275, game.config.height/2 + 200, 'Reset All Data', 
                                      this.textConfig).setOrigin(0.5,0.5);
        this.moneyButton = this.add.rectangle(game.config.width/2 - 275, game.config.height/2 + 200, game.config.width/6, 
                                             game.config.height/12, 0x00FF81).setOrigin(0.5,0.5);
        this.moneyText = this.add.text(game.config.width/2 - 275, game.config.height/2 + 200, 'Infinite Money', 
                                      this.textConfig).setOrigin(0.5,0.5);
        
        this.dataButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.volume0.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.volume50.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.volume100.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.moneyButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });


        this.input.on('gameobjectdown', function (pointer, gameObject) {
            // console.log('down');
            this.clickOn(gameObject);
            this.doPrintLoop = true;
        }, this);

        this.soundtrack = this.sound.add('soundtrack');
    } 

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }

        if(this.moveDirection) {
            if(this.titleScreenFront.y < 20) {
                this.titleScreenMid.y -= 0.25;
                this.titleScreenFront.y += 0.25;
            } else {
                this.moveDirection = false;
            }
        } else {
            if(this.titleScreenFront.y > 0) {
                this.titleScreenMid.y += 0.25;
                this.titleScreenFront.y -= 0.25;
            } else {
                this.moveDirection = true;
            }
        }
    }

    clickOn(gObj) {
        if(gObj == this.dataButton) {
            localStorage.removeItem('money');        
            localStorage.removeItem('heightPeanuts');
            localStorage.removeItem('numPeanuts');
            localStorage.removeItem('heightM&Ms');
            localStorage.removeItem('numM&Ms');
            localStorage.removeItem('heightAlmonds');
            localStorage.removeItem('numAlmonds');
            localStorage.removeItem('heightRaisins');
            localStorage.removeItem('numRaisins');

        }    
        else if(gObj == this.volume0){
           localStorage.setItem('volume', 0.0); 
           this.soundtrack.stop();
        }
        else if(gObj == this.volume50){
            localStorage.setItem('volume', 0.25);
            this.soundtrack.stop();
            this.soundtrack.play({volume: .25});
        }
        else if(gObj == this.volume100){
            localStorage.setItem('volume', 0.5);
            this.soundtrack.stop();
            this.soundtrack.play({volume: .50});
        }
        else if(gObj == this.moneyButton){
            localStorage.setItem('money', 9999.99)
        }

    }


}