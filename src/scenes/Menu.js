class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

    }

    preload() {
        //Load all assets
        this.load.path = './assets/';
    }

    create() {
        this.input.on('pointerdown', function (pointer) {

            console.log('down');
            // this.pointerClicked(pointer);
            while (pointer.isDown) {
                this.add.text(pointer.x, pointer.y, Math.floor(Math.random()*64), { 
                    fontFamily: 'Helvetica', 
                    fontSize: '40px', 
                    backgroundColor: '#FFFFFF00', 
                    color: '#000000', 
                    stroke: '#FFFFFF', 
                    strokeThickness: 3, 
                    align: 'right' });
                break;
            }
    
        }, this);
    }

    update() {
        // this.testText.setText('mouse1 is not pressed');
        // if(game.input.activePointer.leftButton.isDown) {
        //     this.testText.setText('mouse1 pressed');
        // }
        // while(this.input.on('pointerdown', function (pointer) {
        //     console.log('down pointer');
        //     this.add.text(pointer.x, pointer.y, Math.floor(Math.random()*64), { 
        //         fontFamily: 'Helvetica', 
        //         fontSize: '40px', 
        //         backgroundColor: '#FFFFFF00', 
        //         color: '#000000', 
        //         stroke: '#FFFFFF', 
        //         strokeThickness: 3, 
        //         align: 'right' });
        // })) {
    }

    clickPlay() {
        this.scene.start("playScene");
    }

    // pointerClicked(pointer) {
    //     while(pointer.isDown) {
    //         this.add.text(pointer.x, pointer.y, Math.floor(Math.random()*64), { 
    //             fontFamily: 'Helvetica', 
    //             fontSize: '40px', 
    //             backgroundColor: '#FFFFFF00', 
    //             color: '#000000', 
    //             stroke: '#FFFFFF', 
    //             strokeThickness: 3, 
    //             align: 'right' });
    //     }
    // }
}