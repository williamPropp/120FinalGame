class Ingredient extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, type) {
        super(scene, x, y, texture, frame, type);

        //Add object to existing scene
        scene.add.existing(this);

        this.color; 
        this.weight;    //in grams
        this.price;     //in dollars
        this.value;     // in dollars

        let candy_colors = ["blue", "red", "green", "yellow", "brown"];
        
        if(type.equals("peanut")){
            this.color = "light brown";
            this.weight = 1
            this.price = 0.0029;
            this.value = 0.0214;
        }
        else if(type.equals("raisin")){
            this.color = "dark purple";
            this.weight = 0.5; 
            this.price = 0.0023;
            this.value = 0.0208;
        }
        else if(type.equals("m&m")){
            this.color = candy_colors[Math.floor(Math.random() * 5)];
            this.weight = 1.1; 
            this.price = 0.056;
            this.value = 0.0745;
        }
        else if(type.equals("almond")){
            this.color = "brown";
            this.weight = 1.3;
            this.price = 0.028;
            this.value = 0.0465;
        }
        


    }

    update() {
        //Add updates here
    }
}