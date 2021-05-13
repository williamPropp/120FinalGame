class Dispenser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Add object to existing scene
        scene.add.existing(this);
        
        this.ingredientType;
        this.scene = scene;
    }

    update() {
        //Add updates here
    }

    spawnIngredient() {
        new Ingredient(this.x, this.y, this.scene.image('square')).setOrigin(0,0);
    }
}