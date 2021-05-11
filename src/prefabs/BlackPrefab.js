class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Add object to existing scene
        scene.add.existing(this);
    }

    update() {

    }
}