class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");

    }
    preload() {
        //Load all assets
        this.load.path = './assets/';
        this.load.image('manilla', 'manilla.png');
        this.load.image('post', 'PostIt.png')
        this.load.image('order', 'OrderForm.png')
        this.load.image('circle', 'circle.png');
        this.load.image('contract', 'Contract.png');
        this.load.image('wall', 'bagWall.png');
        this.load.image('base', 'bagBase.png');
        this.load.atlas('bag_info', 'bag.png', 'bagIcon.json');
        this.load.spritesheet('conveyor', 'conveyorSpritesheet.png', {frameWidth: 831, frameHeight: 123, startFrame: 0, endFrame: 2});
        this.load.json('bag_physics', 'bag.json');
        this.load.image('files', 'files.png');
        this.load.image('scale', 'scale.png');
        this.load.image('bg', 'FactoryBG.png');
        this.load.image('dispenser', 'Dispenser.png');
        this.load.image('arrow', 'Arrow.png');
        this.load.image('trash', 'trash.png');
        this.load.image('hammer', 'Hammer.png');
    }

    create(){            
        
        //Create art assets
        this.bg = this.add.tileSprite(0, 0, screenWidth, game.config.height, 'bg').setOrigin(0 ,0);
        this.defaultTextConfig = {fontFamily: 'purse', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'};
        this.quesTextConfig = {fontFamily: 'purse', fontSize: '20px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center'};
        this.descriptionTextConfig = {fontFamily: 'purse', fontSize: '17px', color: '#000000', align: 'center'};
        this.whiteTextConfig = {fontFamily: 'fred', fontSize: '40px', backgroundColor: '#00000033', color: '#FFFFFF', align: 'center'};
        this.playMenu = this.add.image(10, 100, 'files').setOrigin(0,0);
        this.conveyor = this.add.image(305, 510, 'conveyor');
        this.scale = this.add.image(724, 450, 'scale').setOrigin(0 ,0);
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(724, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);
        this.bag = this.add.image(200, 400, 'bag_info', 'bag.png');
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(725, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);
        this.contractBg = this.add.rectangle(735, 60, 205, 230, 0xFFFFFF).setOrigin(0 ,0);
        this.currentContract = this.add.text(840, 159, '', this.descriptionTextConfig).setOrigin(0.5,0.5).setScale(1,1);
        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.playMenuText = this.add.text(44, 139, 'Files', this.defaultTextConfig);
        this.hammer = this.add.image(150, 600, 'hammer').setOrigin(0 ,0);
        this.trash = this.add.image(10, game.config.height - 140, 'trash').setOrigin(0,0);
        
        this.ingredientArray = ['peanut', 'raisin', 'm&m', 'almond'];
        for(let i = 0; i < 4; i++){
            this.dispenserFrame = this.add.image(250 + i * 120, 0, 'dispenser').setOrigin(0.5, 0);
            this.dispenseButton = this.add.circle(250 + i * 120, 200 + 6, 18, 0xFF0000).setOrigin(0.5,0.5);
            this.refillButton = this.add.circle(250 + 30 + i * 120 - 30, 150 + 5, 10, 0x0000FF).setOrigin(0.5,0.5);
            this.ingredientText = this.add.text(250 + i * 120, 241, this.ingredientArray[i].toUpperCase(), this.defaultTextConfig).setOrigin(0.5,0.5);
            this.ingredientText.setScale(0.5);
            this.refillMeterBacking = this.add.rectangle(250 + i * 120, 130, 25, 75, 0x000000).setOrigin(0.5, 1);
            this.refillMeter = this.add.rectangle(250 + i * 120, 130, 25, 75, 0x00FF00).setOrigin(0.5, 1);
        }
        this.moneyText = this.add.text(10, 5, 'Bank: $50.00', this.whiteTextConfig);
        this.leftArrow = this.add.image(270, 510, 'arrow').setOrigin(0,0.5);
        this.leftArrow.setFlipX(true);
        this.rightArrow = this.add.image(387, 510, 'arrow').setOrigin(0,0.5);
        this.rightArrow.setFlipX(false);
       

        //Icons
        this.iconOne = this.add.circle(20,this.moneyText.y + 60, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconTwo = this.add.circle(20,this.playMenu.y + 145, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconThree = this.add.circle(this.bag.x + 100, this.bag.y, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconFour = this.add.circle(this.scale.x, this.scale.y - 35, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconFive = this.add.circle(385, 35, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconSix = this.add.circle(this.trash.x + 45, this.trash.y + 75, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconSeven = this.add.circle(this.hammer.x + 78, this.hammer.y + 53, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
       
        
        //Question Marks
        this.questionOne = this.add.text(this.iconOne.x - 5.5,this.iconOne.y - 12,'?', this.quesTextConfig);
        this.questionTwo = this.add.text(this.iconTwo.x - 5,this.iconTwo.y - 10,'?', this.quesTextConfig);
        this.questionThree = this.add.text(this.iconThree.x - 5,this.iconThree.y - 10,'?', this.quesTextConfig);
        this.questionFour = this.add.text(this.iconFour.x - 5,this.iconFour.y - 10,'?', this.quesTextConfig);
        this.questionFive = this.add.text(this.iconFive.x - 5,this.iconFive.y - 10,'?', this.quesTextConfig);
        this.questionSix = this.add.text(this.iconSix.x - 5,this.iconSix.y - 10,'?', this.quesTextConfig);
        this.questionSeven = this.add.text(this.iconSeven.x - 5,this.iconSeven.y - 10,'?', this.quesTextConfig);

         //Effects
         this.bounce = this.tweens.add({

            targets: [this.iconOne, this.questionOne, this.iconTwo, this.questionTwo, this.iconThree, this.questionThree,
                      this.iconFour, this.questionFour, this.iconFive, this.questionFive, this.iconSix, this.questionSix, 
                      this.iconSeven, this.questionSeven],
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
    
        });

        //Descriptions
        this.tutorialText = this.add.text(752,97, ['Hover over an icon', 'with the mouse to', 'get information on', 'the Factory object next',  'to it. Press Esc to', 'go back to the main', 'menu.'], this.descriptionTextConfig)

        //Interactivity
        this.iconOne.on('pointerover', () => {
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Your current amount of', 'money will always be', 'displayed here. Sell', 'bags of mix to keep', 'building your fortune!'];
            this.bounce.pause();
        });
        this.iconOne.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
            this.bounce.resume();
        });
        this.iconTwo.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['In your files you have', 'access to new upgrades,', 'contracts, and restocks', 
                                         'that will help you on', 'your trail-mix making', 'journey.'];
            this.bounce.pause();
         });
        this.iconTwo.on('pointerout', () => {
            this.tutorialText.setVisible(true); 
            this.currentContract.text = '';
            this.bounce.resume();
         });
        this.iconThree.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Catch the ingredients in', 'this bag to sell your mix', 'and earn money! Use the', 
                                         'left and right arrow keys', 'to move your bag on the', 'conveyor belt.'];
            this.bounce.pause();
        });
        this.iconThree.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
            this.bounce.resume();
        }); 
        this.iconFour.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Move your bag to this', 'scale to have your mix', 'weighed and sold for cash!'];
            this.bounce.pause();
        });
        this.iconFour.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
            this.bounce.resume();
        });
        this.iconFive.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text =  ['These are your dispensers.', ' Press or hold the red', 'button to dispense your',  
                                          'ingredients into the bag.', 'Use the blue button to', 'refill a dispenser, whose', 
                                          'ingredient level is', 'indicated by the green', 'meter in the middle of', 'each dispenser.'];
            this.bounce.pause();
        });
        this.iconFive.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
            this.bounce.resume();
        });
        this.iconSix.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text =  ['This is your trash can.', 'Click on it to clear the', 'screen of all ingredients,', 
                                          'including the ones in your', 'bag.'];  
                                          
            this.bounce.pause();
        });
        this.iconSix.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
            this.bounce.resume();
        });
        this.iconSeven.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text =  ['Here is your mighty', 'hammer. In the unlikely', 'event any bug or critter', 
                                          'appears in your factory', 'you may smash them by', 'using this hammer.'];
            this.bounce.pause();
        });
        this.iconSeven.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
            this.bounce.resume();
        });

        //Define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update(){
        //Go to main menu
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.start("menuScene");
        }
    }

}