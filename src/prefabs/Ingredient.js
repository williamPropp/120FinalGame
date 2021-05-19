class Ingredient extends Phaser.Physics.Matter.Sprite {
    constructor(scene, x, y, texture, frame, type) {
        super(scene.matter.world, x, y, texture, frame, type);

        //Add object to existing scene
        scene.add.existing(this);
        this.type = type;

        //this.setCollisionGroup(1);
        //this.setDensity(.2); 

        this.color;     //In hexadecimal
        this.weight;    //In grams
        this.price;     //In dollars
        this.value;     //In dollars

        //Bag booleans
        this.insideBag = false;
        this.bagQuery = true;

        // let candy_colors = ["blue", "red", "green", "yellow", "brown"];
        let candy_colors = [0x1c3ca6, 0xad1111, 0x4e9c0b, 0xeff53b, 0x523a00];
        
        if(type == "peanut"){
            // this.color = "light brown";
            this.color = 0xeddeb4;
            this.weight = 1
            this.price = 0.0029;
            this.value = 0.0214;
        }
        else if(type == "raisin"){
            // this.color = "dark purple";
            this.color = 0x722D5E;
            this.weight = 0.5; 
            this.price = 0.0023;
            this.value = 0.0208;
        }
        else if(type == "m&m"){
            // this.color = candy_colors[Math.floor(Math.random() * 5)];
            this.color = candy_colors[Math.floor(Math.random() * candy_colors.length)];
            this.weight = 1.1; 
            this.price = 0.056;
            this.value = 0.0745;
        }
        else if(type == "almond"){
            // this.color = "brown";
            this.color = 0x523f0a;
            this.weight = 1.3;
            this.price = 0.028;
            this.value = 0.0465;
        }
        this.setTint(this.color);

    }

    update() {

    }
}