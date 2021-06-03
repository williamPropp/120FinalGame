class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('menuScreenBack', 'TitleScreenBack.png');
        this.load.image('menuScreenMid', 'TitleScreenMid.png');
        this.load.image('menuScreenFront', 'TitleScreenFront.png');
        this.load.audio('soundtrackMenu', 'menuSoundtrack.mp3')
    }

    create() {

        //Add titleScreen background
        this.titleScreenBack = this.add.tileSprite(0, 0, 960, 720, 'menuScreenBack').setOrigin(0,0);
        this.titleScreenMid = this.add.tileSprite(-50, -50, 1030, 848, 'menuScreenMid').setOrigin(0,0);
        this.titleScreenMid.setScale(1.2);
        this.titleScreenFront = this.add.tileSprite(0, 0, 960, 720, 'menuScreenFront').setOrigin(0,0);

        this.moveDirection = true;

        this.menuSoundtrack = this.sound.add('soundtrackMenu', {
            volume: 0.5,
            loop: true,
        });
        this.menuSoundtrack.play();
    

        this.pointerDown = false;
        this.textConfig = { fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center' };
        this.playButton = this.add.rectangle(game.config.width/2, game.config.height/2 + 100, game.config.width/10, game.config.height/12, 0x00FF00).setOrigin(0.5,0.5);
        this.playText = this.add.text(game.config.width/2, game.config.height/2 + 100, 'Play', this.textConfig).setOrigin(0.5,0.5);
        this.optionsButton = this.add.rectangle(game.config.width/2, game.config.height/2 + 180, game.config.width/6, game.config.height/12, 0x0000FF).setOrigin(0.5,0.5);
        this.optionsText = this.add.text(game.config.width/2, game.config.height/2 + 180, 'Options', this.textConfig).setOrigin(0.5,0.5);
        this.tutorialButton = this.add.rectangle(game.config.width/2, game.config.height/2 + 260, game.config.width/6, game.config.height/12, 0x5F20FF).setOrigin(0.5,0.5);
        this.optionsText = this.add.text(game.config.width/2, game.config.height/2 + 260, 'Tutorial', this.textConfig).setOrigin(0.5,0.5);
        
        this.playButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.optionsButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.tutorialButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        // }, this);
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            // console.log('down');
            this.clickOn(gameObject);
            this.doPrintLoop = true;
        }, this);
    }

    update() {
        

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
        if(gObj == this.playButton) {
            this.menuSoundtrack.stop();
            this.scene.start("playScene");
        } else if(gObj == this.optionsButton) {
            this.menuSoundtrack.stop();
            this.scene.start("optionsScene");
        } else if(gObj == this.tutorialButton) {
            this.menuSoundtrack.stop();
            this.scene.start("tutorialScene");
        }    

    }
}