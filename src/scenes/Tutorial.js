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
    }

    create(){            
        
        //Create art assets
        this.defaultTextConfig = {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'};
        this.quesTextConfig = {fontFamily: 'Arial', fontSize: '20px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center'};
        this.descriptionTextConfig = {fontFamily: 'Helvetica', fontSize: '16px', color: '#000000', align: 'center'};
        this.bg = this.add.rectangle(0, 0, screenWidth, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.playMenu = this.add.image(10, 100, 'files').setOrigin(0,0);
        this.conveyor = this.add.image(305, 510, 'conveyor');
        this.scale = this.add.image(724, 450, 'scale').setOrigin(0 ,0);
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(724, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);
        this.bag = this.add.image(200, 400, 'bag_info', 'bag.png');
        this.tube = this.add.rectangle(780, 0, 120, 330, 0xadd8e6).setOrigin(0 ,0);
        this.tracker = this.add.rectangle(725, 50, 225, 250, 0xC4A484).setOrigin(0 ,0);
        this.contractBg = this.add.rectangle(735, 60, 205, 230, 0xFFFFFF).setOrigin(0 ,0);
        this.currentContract = this.add.text(840, 147, '', this.descriptionTextConfig).setOrigin(0.5,0.5).setScale(1,1);
        this.floor = this.add.rectangle(0, game.config.height-10, game.config.width, 20, 0x211244).setOrigin(0,0);
        this.moneyText = this.add.text(10, 20, 'Money: $0.00', this.defaultTextConfig);
        
        this.ingredientArray = ['peanut', 'raisin', 'm&m', 'almond'];
        for(let i = 0; i < 4; i++){
            this.dispenserFrame = this.add.rectangle(250 + i * 120, 0, 100, 250, 0xD3D3D3).setOrigin(0.5, 0);
            this.dispenseButton = this.add.circle(250 + i * 120, 200, 25, 0xFF0000).setOrigin(0.5,0.5);
            this.refillButton = this.add.circle(250 + 30 + i * 120, 150, 10, 0x0000FF).setOrigin(0.5,0.5);
            this.ingredientText = this.add.text(250 + i * 120, 235, this.ingredientArray[i], this.defaultTextConfig).setOrigin(0.5,0.5);
            this.ingredientText.setScale(0.5);
            this.refillMeterBacking = this.add.rectangle(250 + i * 120, 150, 25, 75, 0x000000).setOrigin(0.5, 1);
            this.refillMeter = this.add.rectangle(250 + i * 120, 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);
        }
        
       

        //Icons
        this.iconOne = this.add.circle(20,this.moneyText.y + 60, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconTwo = this.add.circle(20,this.playMenu.y + 145, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconThree = this.add.circle(this.bag.x + 100, this.bag.y, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconFour = this.add.circle(this.scale.x, this.scale.y - 35, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
        this.iconFive = this.add.circle(380, 50, 16, 0x5F20FF).setInteractive().setStrokeStyle(2, '#000000');
   
       
        
        //Question Marks
        this.questionOne = this.add.text(this.iconOne.x - 5.5,this.iconOne.y - 12,'?', this.quesTextConfig);
        this.questionTwo = this.add.text(this.iconTwo.x - 5,this.iconTwo.y - 10,'?', this.quesTextConfig);
        this.questionThree = this.add.text(this.iconThree.x - 5,this.iconThree.y - 10,'?', this.quesTextConfig);
        this.questionFour = this.add.text(this.iconFour.x - 5,this.iconFour.y - 10,'?', this.quesTextConfig);
        this.questionFive = this.add.text(this.iconFive.x - 5,this.iconFive.y - 10,'?', this.quesTextConfig);


         //Effects
         this.tweens.add({

            targets: [this.iconOne, this.questionOne, this.iconTwo, this.questionTwo, this.iconThree, this.questionThree,
                this.iconFour, this.questionFour, this.iconFive, this.questionFive],
            scaleX: 0.8,
            scaleY: 0.8,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
    
        });

        //Descriptions
        this.tutorialText = this.add.text(773,107, ['Hover over an icon', 'to get information', 'on the object next', 
                                                    'to it. Press Esc', 'to go back to the', 'main menu.'], this.descriptionTextConfig)

        //Interactivity
        this.iconOne.on('pointerover', () => {
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Your current amount of', 'money will always be', 'displayed here.'];
        });
        this.iconOne.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
        });
        this.iconTwo.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Here you have access to', 'new upgrades, contracts,', ' and restocks that will', 
                                          'help you on your', 'trail-mix making journey.'];
         });
        this.iconTwo.on('pointerout', () => {
            this.tutorialText.setVisible(true); 
            this.currentContract.text = '';
         });
        this.iconThree.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Catch the ingredients in', 'this bag to sell your', 'mix and earn money! Use', 
                                         'the left and right arrow', 'keys to move your bag on', 'the conveyor belt.'];
        });
        this.iconThree.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
        }); 
        this.iconFour.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text = ['Move your bag to this', 'scale to have your mix', 'weighed and earnings', 'calculated!'];
        });
        this.iconFour.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
        });
        this.iconFive.on('pointerover', () => {         
            this.tutorialText.setVisible(false);
            this.currentContract.text =  ['These are your', 'dispensers. The red button', 'dispenses your ingredients', 
                                          'into the bag, the green' , 'meter lets you know how', 'full each dispenser is, and', 
                                          'you may refill your', 'dispensers for money by', 'pressing the blue button.'];
        });
        this.iconFive.on('pointerout', () => {
            this.tutorialText.setVisible(true);
            this.currentContract.text = '';
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