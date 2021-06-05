class Dispenser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, ingType, dispIndex) {
        super(scene, x, y, texture, frame, ingType, dispIndex);

        //Add object to existing scene
        scene.add.existing(this);
        
        //Dispenser data
        this.scene = scene;
        this.dispIndex = dispIndex;
        this.ingredientType = /*(ingType == null) ? 'empty' : */ingType;
        this.maxIngredients = (this.ingredientType == 'empty') ? null : (Math.round(this.scene.binWeight / this.getIngredientData(this.ingredientType, 'weight')));
        this.numIngredients = this.maxIngredients;
        this.priceToRefill = (this.ingredientType == 'empty') ? null : 0;

        //Dispenser components
        this.dispenserFrame = this.scene.add.rectangle(this.x, this.y, 100, 250, 0xD3D3D3).setOrigin(0.5, 0);
        this.dispenseButton = this.scene.add.circle(this.x, this.y + 200, 25, 0xFF0000).setOrigin(0.5,0.5);
        this.refillButton = this.scene.add.circle(this.x + 30, this.y + 150, 10, 0x0000FF).setOrigin(0.5,0.5);
        this.ingredientText = this.scene.add.text(this.x, this.y + 235, this.ingredientType + ((this.ingredientType == 'empty') ? '' : 's'), this.scene.defaultTextConfig).setOrigin(0.5,0.5);
        this.ingredientText.setScale(0.5);
        this.priceText = this.scene.add.text(440, 265, 'init text', this.scene.whiteTextConfig).setScale(0.5).setOrigin(0.5,0.5);
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
            if(this.priceToRefill == null) {
                priceStr = 'this dispenser is empty';
            } else if(this.priceToRefill == 0) {
                priceStr = 'this dispenser is full';
            } else {
                priceStr = 'this dispenser costs $' + this.priceToRefill + ' to refill';
            }

            this.priceText.setText(priceStr);
            this.priceText.setVisible(true);
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

        //create temp address Strings to access localStorage
        let localStorageAddress = 'disp' + this.dispIndex;
        let ingTypeStr = localStorageAddress + 'Type';
        let maxIngStr = localStorageAddress + 'MaxIngredients';
        let numIngStr = localStorageAddress + 'NumIngredients';
        let refillStr = localStorageAddress + 'PriceToRefill';
        let heightStr = localStorageAddress + 'MeterHeight';

        //First time setup, store dispData in local storage
        if(localStorage.getItem(ingTypeStr) == null) {
            this.updateLocalStorage();
        } else { //If localStorage exists, restore dispData from local storage
            this.ingredientType = localStorage.getItem(ingTypeStr);
            this.maxIngredients = parseInt(localStorage.getItem(maxIngStr));
            this.numIngredients = parseInt(localStorage.getItem(numIngStr));
            this.priceToRefill = parseInt(localStorage.getItem(refillStr));
            this.refillMeter.height = parseFloat(localStorage.getItem(heightStr));
        }       
    }

    spawnIngredient() {
        let spawnedIngredient;

        //If the dispenser is empty, play the empty sound and reset dispenser
        if(this.ingredientType == 'empty' || this.numIngredients < 1) {

            //Reset dispenser when empty
            this.priceToRefill = null;
            this.ingredientText.setText('empty');

            //If the player has edited volume, make sure sound effects are at that volume
            if(localStorage.getItem('volume') == null){
                this.sound.play('emptyDispenser');
            } else{
                this.scene.sound.play('emptyDispenser', {volume: parseFloat(localStorage.getItem('volume'))});
            }

        } else {

            //Spawn Ingredient
            spawnedIngredient = new Ingredient(this.scene, this.x + (Math.floor(Math.random()*10) - 5), this.y + 200 + (Math.floor(Math.random()*50)),  this.ingredientType, null, this.ingredientType, this.getIngredientData(this.ingredientType)).setOrigin(0.5,0.5);
            
            //Play Dispenser Sound, and if the player has edited volume, make sure sound effects are at that volume
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

            //Store dispData in local storage
            this.updateLocalStorage();

        }
    }

    //Change Ingredient in this dispenser to newType, and refill the dispenser to full
    changeType(newType) {
        this.ingredientType = newType;
        let newWeight = this.getIngredientData(newType, 'weight');

        this.ingredientType = newType;
        this.maxIngredients = Math.round(this.scene.binWeight / newWeight);
        this.numIngredients = this.maxIngredients;
        this.priceToRefill = 0;
    }

    //Call to retrieve Ingredient data. Leave data arg blank to request all data in the form of an array, or use data arg to request a specific attribute
    getIngredientData(type, data) {
        let ingColor, ingWeight, ingPrice, ingValue;
        let ingDataArray = [];
        
        //List all ingredient data here. ingPrice = how much it costs to buy. ingValue = how much the ingredient sells for before multipliers are applied.
        if(type == "peanut"){ //Make sure image key is spelled the same as the type
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

        //If the data arg is left blank return an array containing all values. ingDataArray[0] : color, ingDataArray[1] : weight, ingDataArray[2] : price, ingDataArray[3] : value
        if(data == null) {
            ingDataArray.push(ingColor, ingWeight, ingPrice, ingValue);
            return ingDataArray;
        } else if(data == 'color') {
            return ingColor;
        } else if(data == 'weight') {
            return ingWeight;
        } else if(data == 'price') {
            return ingPrice;
        } else if(data == 'value') {
            return ingValue;
        }
        
    }

    updateLocalStorage() {
        //Generate localStorage addresses to access stored data
        let localStorageAddress = 'disp' + this.dispIndex;
        let ingTypeStr = localStorageAddress + 'Type';
        let maxIngStr = localStorageAddress + 'MaxIngredients';
        let numIngStr = localStorageAddress + 'NumIngredients';
        let refillStr = localStorageAddress + 'PriceToRefill';
        let heightStr = localStorageAddress + 'MeterHeight';

        //Replace stored data with updated values
        localStorage.setItem(ingTypeStr, this.ingredientType);
        localStorage.setItem(maxIngStr, this.maxIngredients);
        localStorage.setItem(numIngStr, this.numIngredients);
        localStorage.setItem(refillStr, this.priceToRefill);
        localStorage.setItem(heightStr, this.refillMeter.height);
    }

}