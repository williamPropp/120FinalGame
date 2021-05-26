class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");

    }


    create(){
        this.scene.launch("playScene");
        this.scene.pause("playScene");
        
        this.tutorialText = this.add.text(game.config.width/2, game.config.height/2, 'Welcome to the turorial!', this.textConfig).setOrigin(0.5,0.5);
    }
}