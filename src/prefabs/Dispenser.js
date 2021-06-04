class Dispenser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, /*texture, */type) {
        super(scene, x, y, /*texture, */type);

        //Add object to existing scene
        scene.add.existing(this);
        
        //Dispenser data
        this.scene = scene;
        // this.dispenserIndex; //Implement later (local storage list of dispensers as multidimensional array)
        this.ingredientType = (type == null) ? 'empty' : type;
        this.maxIngredients = (this.ingredientType == 'empty') ? null : (Math.round(this.scene.binWeight / this.getIngredientData(this.ingredientType, 'weight')));
        this.numIngredients = this.maxIngredients;
        this.priceToRefill = (this.ingredientType == 'empty') ? null : 0;

        //Dispenser components
        this.dispenserFrame = this.scene.add.rectangle(this.x, this.y, 100, 250, 0xD3D3D3).setOrigin(0.5, 0);
        this.dispenseButton = this.scene.add.circle(this.x, this.y + 200, 25, 0xFF0000).setOrigin(0.5,0.5);
        this.refillButton = this.scene.add.circle(this.x + 30, this.y + 150, 10, 0x0000FF).setOrigin(0.5,0.5);
        this.ingredientText = this.scene.add.text(this.x, this.y + 235, this.ingredientType + ((this.ingredientType == 'empty') ? '' : 's'), this.scene.defaultTextConfig).setOrigin(0.5,0.5);
        this.ingredientText.setScale(0.5);
        this.priceText = this.scene.add.text(440, 265, 'init text', this.scene.defaultTextConfig).setScale(0.5).setOrigin(0.5,0.5);
        this.priceText.setVisible(false);

        //Add dispenser to dispenser layer
        this.scene.dispenserLayer.add([this]);

        //Make dispenser and refill buttons interactable
        this.dispenseButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });

        //When mouse leaves dispense button, stop spawning ingredient
        this.dispenseButton.on('pointerout', () => {
            this.scene.spawnIngredientLoop = false;
        });

        //Make refillButton clickable
        this.refillButton.setInteractive({
            draggable: false,
            useHandCursor: true
        });

        //Display refill cost when pointer hovers over refill button
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

        //Hide refill cost text when pointer hovers over refill button
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
        this.scene.dispenserArray.push(this);
        

        //Refill Meter
        this.refillMeterBacking = this.scene.add.rectangle(this.x, this.y + 150, 25, 75, 0x000000).setOrigin(0.5, 1);
        this.refillMeter = this.scene.add.rectangle(this.x, this.y + 150, 25, 75, 0x00FF00).setOrigin(0.5, 1);

        //Load Audio
        this.scene.load.audio('dispense', './assets/dispenserNoise.mp3');
        this.scene.load.audio('emptyDispenser', './assets/dispenserEmpty.mp3');

        if(this.ingredientType == 'peanut'){
            if(localStorage.getItem('heightPeanuts') == null){
                localStorage.setItem('heightPeanuts', this.refillMeter.height);
            }
            else{
                this.refillMeter.height = parseFloat(localStorage.getItem('heightPeanuts'));
            }
            if(localStorage.getItem('numPeanuts') == null){
                localStorage.setItem('numPeanuts', this.numIngredients);
            }
            else{
                this.numIngredients = parseInt(localStorage.getItem('numPeanuts'));
            }
        }
        else if(this.ingredientType == 'raisin'){
            if(localStorage.getItem('heightRaisins') == null){
                localStorage.setItem('heightRaisins', this.refillMeter.height);
            }
            else{
                this.refillMeter.height = parseFloat(localStorage.getItem('heightRaisins'));
            }
            if(localStorage.getItem('numRaisins') == null){
                localStorage.setItem('numRaisins', this.numIngredients);
            }
            else{
                this.numIngredients = parseInt(localStorage.getItem('numRaisins'));
            }
        }
        else if(this.ingredientType == 'm&m'){
            if(localStorage.getItem('heightM&Ms') == null){
                localStorage.setItem('heightM&Ms', this.refillMeter.height);
            }
            else{
                this.refillMeter.height = parseFloat(localStorage.getItem('heightM&Ms'));
            }
            if(localStorage.getItem('numM&Ms') == null){
                localStorage.setItem('numM&Ms', this.numIngredients);
            }
            else{
                this.numIngredients = parseInt(localStorage.getItem('numM&Ms'));
            }
        }
        else if(this.ingredientType == 'almond'){
            if(localStorage.getItem('heightAlmonds') == null){
                localStorage.setItem('heightAlmonds', this.refillMeter.height);
            }
            else{
                this.refillMeter.height = parseFloat(localStorage.getItem('heightAlmonds'));
            }
            if(localStorage.getItem('numAlmonds') == null){
                localStorage.setItem('numAlmonds', this.numIngredients);
            }
            else{
                this.numIngredients = parseInt(localStorage.getItem('numAlmonds'));
            }
        }
        
    }

    spawnIngredient() {
        let spawnedIngredient;
        let typeString;

        //If the dispenser is empty, play the empty sound
        if(this.ingredientType == 'empty' || this.numIngredients < 1) {
            if(localStorage.getItem('volume') == null){
                this.sound.play('emptyDispenser');
            } 
            else{
                this.scene.sound.play('emptyDispenser', {volume: parseFloat(localStorage.getItem('volume'))});
            }
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
            if(localStorage.getItem('volume') == null){
                this.scene.sound.play('dispense');
            } 
            else{
                this.scene.sound.play('dispense', {volume: parseFloat(localStorage.getItem('volume'))});
            }
            
            
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

            if(this.ingredientType == 'peanut') {
                localStorage.setItem('numPeanuts',this.numIngredients)
                localStorage.setItem('heightPeanuts', this.refillMeter.height);
            } 
            else if(this.ingredientType == 'raisin') {
                localStorage.setItem('numRaisins',this.numIngredients);
                localStorage.setItem('heightRaisins', this.refillMeter.height);
            } 
            else if(this.ingredientType == 'm&m') {
                localStorage.setItem('numM&Ms',this.numIngredients);
                localStorage.setItem('heightM&Ms', this.refillMeter.height);
            } 
            else if(this.ingredientType == 'almond') {
                localStorage.setItem('numAlmonds',this.numIngredients);
                localStorage.setItem('heightAlmonds', this.refillMeter.height);
            }

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