class Dispenser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, /*texture, */type, index) {
        super(scene, x, y, /*texture, */type, index);

        //Add object to existing scene
        scene.add.existing(this);
        
        //Dispenser data
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.ingredientType = (type == null) ? 'empty' : type;

        this.scene.dispenserArray.push(this);
        
        console.log(this.scene.dispenserArray);
        console.log(this.scene.dispenserArray.length - 1);
        this.dispenserIndex = this.scene.dispenserArray.length - 1;

        // if(localStorage.getItem('dispenserArray') == null) {
        //     console.log('empty dispenser array');
        // } else {
        //     console.log('huh : ' + this.scene.parseJSONString('dispenserArray').length /*< this.dispenserIndex*/);
        //     console.log('what');
        // }

        if(localStorage.getItem('dispenserArray') == null) {
            this.initializeDispenser();

            // this.maxIngredients = (this.ingredientType == 'empty') ? null : (Math.round(this.scene.binWeight / this.getIngredientData(this.ingredientType, 'weight')));
            // this.numIngredients = this.maxIngredients;
            // this.priceToRefill = (this.ingredientType == 'empty') ? null : 0;
            // this.refillHeight = (this.ingredientType == 'empty') ? 0 : 75;
        } else if((this.scene.parseJSONString('dispenserArray').length - 1) < this.dispenserIndex){
            this.initializeDispenser();

            // this.maxIngredients = (this.ingredientType == 'empty') ? null : (Math.round(this.scene.binWeight / this.getIngredientData(this.ingredientType, 'weight')));
            // this.numIngredients = this.maxIngredients;
            // this.priceToRefill = (this.ingredientType == 'empty') ? null : 0;
            // this.refillHeight = (this.ingredientType == 'empty') ? 0 : 75;

        } else {
            let loadedDispData = this.scene.parseJSONString('dispenserArray', this.dispenserIndex);
            this.maxIngredients = loadedDispData.maxIngredients;
            this.numIngredients = loadedDispData.numIngredients;
            this.priceToRefill = loadedDispData.priceToRefill;
            this.refillHeight = loadedDispData.refillHeight;
            console.log('MaxIng = ' + loadedDispData.maxIngredients);
            console.log('NumIng = ' + loadedDispData.numIngredients);
            console.log('PriceToRefill = ' + loadedDispData.priceToRefill);
            console.log('refillHeight = ' + loadedDispData.refillHeight);
        }
        
        //Dispenser components
        this.dispenserFrame = this.scene.add.rectangle(this.x, this.y, 100, 250, 0xD3D3D3).setOrigin(0.5, 0);
        this.dispenseButton = this.scene.add.circle(this.x, this.y + 200, 25, 0xFF0000).setOrigin(0.5,0.5);
        this.refillButton = this.scene.add.circle(this.x + 30, this.y + 150, 10, 0x0000FF).setOrigin(0.5,0.5);
        this.ingredientText = this.scene.add.text(this.x, this.y + 235, this.ingredientType + ((this.ingredientType == 'empty') ? '' : 's'), this.scene.defaultTextConfig).setOrigin(0.5,0.5);
        this.ingredientText.setScale(0.5);
        this.priceText = this.scene.add.text(440, 265, 'init text', this.scene.defaultTextConfig).setScale(0.5).setOrigin(0.5,0.5);
        this.priceText.setVisible(false);
        this.refillMeterBacking = this.scene.add.rectangle(this.x, this.y + 150, 25, 75, 0x000000).setOrigin(0.5, 1);
        this.refillMeter = this.scene.add.rectangle(this.x, this.y + 150, 25, this.refillHeight, 0x00FF00).setOrigin(0.5, 1);;

        this.scene.dispenserLayer.add([this]);

        //Make dispenser and refill buttons interactable
        this.dispenseButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.refillButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });
        this.refillButton.on('pointerover',() => {
            let priceStr;
            if(this.priceToRefill == 0) {
                priceStr = 'this dispenser is full';
            } else {
                priceStr = 'this dispenser costs $' + this.priceToRefill + ' to refill';
            }

            this.priceText.setText(priceStr);
            this.priceText.setVisible(true);
            // let priceText = this.scene.add.text(440, 265, 'init text', this.scene.defaultTextConfig).setScale(0.5).setOrigin(0.5,0.5);
            // priceText.setScale(0.5);
            // this.scene.time.delayedCall(2000, () => {
            //     priceText.destroy();
            // });
        });

        this.refillButton.on('pointerout', () => {
            this.priceText.setVisible(false);
        });

        //Add pointers to buttons as data so the prefab's data can be referenced when they're clicked
        this.dispenseButton.setDataEnabled();
        this.refillButton.setDataEnabled();
        this.dispenseButton.setData('prefab', this);
        this.refillButton.setData('prefab', this);

        //Add components to respective groups
        this.scene.refillButtons.add(this.refillButton);
        this.scene.dispenseButtons.add(this.dispenseButton); 

        // this.scene.dispenserArray.push(this);
        // this.dispenserIndex = this.scene.dispenserArray.length - 1;

        if(localStorage.getItem('dispenserArray') == null) {
            localStorage.setItem('dispenserArray', JSON.stringify(this.getDispenserData()));
        } else {
            let dispArrayString = localStorage.getItem('dispenserArray');
            console.log('getDispData : ' + JSON.stringify(this.getDispenserData()));
            console.log('getDispData type: ' + typeof(JSON.stringify(this.getDispenserData())));
            dispArrayString += ('\n') + JSON.stringify(this.getDispenserData());
            console.log('dispArrayString : ' + dispArrayString);
            localStorage.setItem('dispenserArray', dispArrayString);
        }
        
    }

    initializeDispenser() {
        this.maxIngredients = (this.ingredientType == 'empty') ? null : (Math.round(this.scene.binWeight / this.getIngredientData(this.ingredientType, 'weight')));
        this.numIngredients = this.maxIngredients;
        this.priceToRefill = (this.ingredientType == 'empty') ? null : 0;
        this.refillHeight = (this.ingredientType == 'empty') ? 0 : 75;
    }

    spawnIngredient() {
        let spawnedIngredient;
        let typeString;

        //If the dispenser is empty, play the empty sound
        if(this.ingredientType == 'empty' || this.numIngredients < 1) {
            this.scene.sound.play('emptyDispenser');
        } else {
            //Select correct sprite to load for spawnIngredient
            if(this.ingredientType == 'peanut') {
                typeString = 'peanut'; // typeString = 'peanut';
            } else if(this.ingredientType == 'raisin') {
                typeString = 'raisin'; // typeString = 'raisin';
            } else if(this.ingredientType == 'm&m') {
                // this.scene.load.image('m&m', './assets/m&m.png');
                typeString = 'm&m';
                // typeString = 'cir'; // typeString = 'm&m';
            } else if(this.ingredientType == 'almond') {
                typeString = 'almond'; // typeString = 'almond';
            }

            //Spawn Ingredient
            spawnedIngredient = new Ingredient(this.scene, this.x + (Math.floor(Math.random()*10) - 5), this.y + 200 + (Math.floor(Math.random()*50)), /*'circle'*/typeString, null, this.ingredientType, this.getIngredientData(this.ingredientType)).setOrigin(0.5,0.5);
            
            //Play Dispenser Sound
            this.scene.sound.play('dispense');
            
            //Update numIngredients
            this.numIngredients--;

            //Update spawnedIngredient matter physics config
            spawnedIngredient.body.slop = 0;
            spawnedIngredient.body.restitution = 0;
            spawnedIngredient.setCircle();
            spawnedIngredient.body.density = 0;

            this.scene.ingHolder.add(spawnedIngredient); //Add spawnedIngredient to ingredient group
            this.priceToRefill = Math.ceil(Math.abs(this.numIngredients - this.maxIngredients) * spawnedIngredient.price); //Update priceToRefill
            this.refillMeter.height = (this.numIngredients / this.maxIngredients) * 75; //Update refillMeter

            // if(this.ingredientType == 'peanut') {
            //     localStorage.setItem('numPeanuts',this.numIngredients)
            //     localStorage.setItem('heightPeanuts', this.refillMeter.height);
            // } 
            // else if(this.ingredientType == 'raisin') {
            //     localStorage.setItem('numRaisins',this.numIngredients);
            //     localStorage.setItem('heightRaisins', this.refillMeter.height);
            // } 
            // else if(this.ingredientType == 'm&m') {
            //     localStorage.setItem('numM&Ms',this.numIngredients);
            //     localStorage.setItem('heightM&Ms', this.refillMeter.height);
            // } 
            // else if(this.ingredientType == 'almond') {
            //     localStorage.setItem('numAlmonds',this.numIngredients);
            //     localStorage.setItem('heightAlmonds', this.refillMeter.height);
            // }

        }

    }

    changeType(newType) {
        this.ingredientType = newType;
        let newWeight = this.getIngredientData(newType, 'weight');
        let newPrice = this.getIngredientData(newType, 'price');

        this.ingredientType = newType;
        this.maxIngredients = Math.round(this.scene.binWeight / newWeight);
        this.numIngredients = this.maxIngredients;
        this.priceToRefill = newPrice * this.numIngredients;


        // if(newType == 'peanut') {
        //     this.scene.load.image('peanut', './assets/peanut.png');
        //     this.maxIngredients = this.scene.maxPeanuts;
        // } else if(newType == 'raisin') {
        //     this.scene.load.image('raisin', './assets/raisin.png');
        //     this.maxIngredients = this.scene.maxRaisins;
        // } else if(newType == 'm&m') {
        //     this.scene.load.image('m&m', './assets/m&m.png');
        //     this.maxIngredients = this.scene.maxMNMS;
        // } else if(newType == 'almond') {
        //     this.scene.load.image('almond', './assets/almond.png');
        //     this.maxIngredients = this.scene.maxAlmonds;
        // }
    }

    getIngredientData(type, data) {
        let ingColor, ingWeight, ingPrice, ingValue;
        let ingDataArray = [];
        
        if(type == "peanut"){
            ingColor = 0xeddeb4;
            ingWeight = 1
            ingPrice = 0.0029;
            ingValue = 0.0214;
        }
        else if(type == "raisin"){
            ingColor = 0x722D5E;
            ingWeight = 0.5; 
            ingPrice = 0.0023;
            ingValue = 0.0208;
        } else if(type == "m&m") {
            let candy_colors = [0x1c3ca6, 0xad1111, 0x4e9c0b, 0xeff53b, 0x523a00];
            ingColor = candy_colors[Math.floor(Math.random() * candy_colors.length)];
            ingWeight = 1.1; 
            ingPrice = 0.056;
            ingValue = 0.0745;
        } else if(type == "almond"){
            ingColor = 0x523f0a;
            ingWeight = 1.3;
            ingPrice = 0.028;
            ingValue = 0.0465;
        }

        if(data == null) {
            ingDataArray.push(ingColor, ingWeight, ingPrice, ingValue);
            return ingDataArray;
        } /*else if(data == 'color') {
            return ingColor;
        }*/ else if(data == 'weight') {
            return ingWeight;
        } else if(data == 'price') {
            return ingPrice;
        } else if(data == 'value') {
            return ingValue;
        }
        
    }

    getDispenserData() {
        let dispData = {
            x: this.x,
            y: this.y,
            index: this.dispenserIndex,
            ingredientType: this.ingredientType,
            numIngredients: this.numIngredients,
            maxIngredients: this.maxIngredients,
            priceToRefill: this.priceToRefill,
            refillHeight: this.refillMeter.height,
        }
        return dispData;
    }
}



// constructor(scene, x, y, texture, frame/*, img*/) {
//     super(scene, x, y, texture, frame/*, img*/);

//     //Add object to existing scene
//     scene.add.existing(this);

//     this.scene = scene;
//     this.scene.load.image('cir', './assets/circle.png');
// }

// spawnObj() {
//     let spawnedObj;
//     spawnedObj = new Spawned(this.scene, Math.floor(Math.random()*100)+((game.config.width/2) - 50), Math.floor(Math.random()*100)+((game.config.height/2) - 50), 'cir').setOrigin(0.5,0.5);
//     spawnedObj.setTint(0xFF0000);
//     console.log('spawnedObj spawned');
// }