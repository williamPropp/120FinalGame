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
  // this.tutorialText = this.add.text(game.config.width/2, game.config.height/2, 'Welcome to the tutorial!', this.textConfig).setOrigin(0.5,0.5);
    
        this.defaultTextConfig = {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#FFFFFF00', color: '#000000', align: 'center'};
        this.quesTextConfig = {fontFamily: 'Helvetica', fontSize: '20px', backgroundColor: '#FFFFFF00', color: '#FFFFFF', align: 'center'};
        this.descriptionTextConfig = {fontFamily: 'Helvetica', fontSize: '40px', backgroundColor: '#000000', color: '#FFFFFF', align: 'center'};
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
        this.currentContract = this.add.text(840, 100, contractInfo[0], this.defaultTextConfig).setOrigin(0.5,0.5).setScale(1,1);
        this.ingOne = this.add.text(840, 140, contractInfo[1], this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingTwo = this.add.text(840, 180, contractInfo[2], this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingThree = this.add.text(840, 220, contractInfo[3], this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
        this.ingFour = this.add.text(840, 260, contractInfo[4], this.defaultTextConfig).setOrigin(0.5,0.5).setScale(.5, .5);
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
        this.iconOne = this.add.circle(20,this.moneyText.y + 60, 16, 0x5F20FF).setInteractive();
        this.iconTwo = this.add.circle(20,this.playMenu.y + 145, 16, 0x5F20FF).setInteractive();
        this.iconThree = this.add.circle(this.bag.x + 100, this.bag.y, 16, 0x5F20FF).setInteractive();
        this.iconFour = this.add.circle(this.scale.x, this.scale.y - 35, 16, 0x5F20FF).setInteractive();
        this.iconFive = this.add.circle(380, 50, 16, 0x5F20FF).setInteractive();
   
        
        //Question Marks
        this.questionOne = this.add.text(this.iconOne.x - 5,this.iconOne.y - 10,'?', this.quesTextConfig);
        this.questionTwo = this.add.text(this.iconTwo.x - 5,this.iconTwo.y - 10,'?', this.quesTextConfig);
        this.questionThree = this.add.text(this.iconThree.x - 5,this.iconThree.y - 10,'?', this.quesTextConfig);
        this.questionFour = this.add.text(this.iconFour.x - 5,this.iconFour.y - 10,'?', this.quesTextConfig);
        this.questionFive = this.add.text(this.iconFive.x - 5,this.iconFive.y - 10,'?', this.quesTextConfig);


        //Descriptions
        this.descriptionOne = this.add.text(this.iconOne.x + 25, this.iconOne.y + 25, 'Your current amount of money will always be displayed here.', this.decriptionTextConfig).setVisible(false);
        this.descriptionTwo = this.add.text(this.iconTwo.x + 25, this.iconTwo.y + 25, 'This is the upgrades button where you can buy and see your purchased upgrades.', this.decriptionTextConfig).setVisible(false);
        this.descriptionThree = this.add.text(this.iconThree.x + 25, this.iconThree.y + 25, 
                ['Catch the ingredients in this bag to sell your mix and earn', 
                 'money! Use the left and right arrow keys to move your bag on', 
                 'the conveyor belt.'], this.decriptionTextConfig).setVisible(false);
       
        this.descriptionFour = this.add.text(this.iconFour.x - 360, this.iconFour.y + 20, ['Move your bag to this scale to have your mix weighed', 'and earnings calculated!'], this.decriptionTextConfig).setVisible(false);
        this.descriptionFive = this.add.text(this.iconFive.x + 20, this.iconFive.y + 20, ['These are your dispensers. The red button dispenses your', 
                                                                                          'ingredients into the bag, the green meter lets you know', 
                                                                                          'how full each dispenser is, and you may refill your',
                                                                                          'dispensers for money by pressing the blue button'], this.decriptionTextConfig).setVisible(false);
        
        //Interactivity
        this.iconOne.on('pointerover', () => {
            this.descriptionOne.setVisible(true);
            this.descriptionOne.setBackgroundColor('#000000');
        });
        this.iconOne.on('pointerout', () => {
            this.descriptionOne.setVisible(false);
        });

        this.iconTwo.on('pointerover', () => {         
             this.descriptionTwo.setVisible(true);
             this.descriptionTwo.setBackgroundColor('#000000');
         });
        this.iconTwo.on('pointerout', () => {
             this.descriptionTwo.setVisible(false);
         });
        this.iconThree.on('pointerover', () => {         
            this.descriptionThree.setVisible(true);
            this.descriptionThree.setBackgroundColor('#000000');
        });
        this.iconThree.on('pointerout', () => {
            this.descriptionThree.setVisible(false);
        }); 
        this.iconFour.on('pointerover', () => {         
            this.descriptionFour.setVisible(true);
            this.descriptionFour.setBackgroundColor('#000000');
        });
        this.iconFour.on('pointerout', () => {
            this.descriptionFour.setVisible(false);
        });
        this.iconFive.on('pointerover', () => {         
            this.descriptionFive.setVisible(true);
            this.descriptionFive.setBackgroundColor('#000000');
        });
        this.iconFive.on('pointerout', () => {
            this.descriptionFive.setVisible(false);
        });

    }

    update(){
        
    }

}