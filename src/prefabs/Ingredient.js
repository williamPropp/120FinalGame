class Ingredient extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, type) {
        super(scene, x, y, texture, frame, type);

        //Add object to existing scene
        scene.add.existing(this);
        this.type = type;
    }

    update() {
        //Add updates here
    }

}