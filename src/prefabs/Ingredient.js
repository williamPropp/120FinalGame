class Ingredient extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame, type, data) {
        super(scene.matter.world, x, y, texture, frame, type, data);

        //Add object to existing scene
        scene.add.existing(this);
        this.type = type;

        //this.setCollisionGroup(1);
        //this.setDensity(.2); 

        let dataArray = data;
        this.color = dataArray[0];     //In hexadecimal
        this.weight = dataArray[1];    //In grams
        this.price = dataArray[2];     //In dollars
        this.value = dataArray[3];     //In dollars

        //Bag booleans
        this.insideBag = false;
        this.bagQuery = true;

        if(this.type == 'm&m') {
            this.setTint(this.color);
        }
    }

}