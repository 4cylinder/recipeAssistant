'use strict';
var Alexa = require('alexa-sdk');
var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAJYXA572OAUXGZYRA",
    secretAccessKey: "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"
});

var docClient = new AWS.DynamoDB.DocumentClient();
 
var  skillName = "AlexaRecipeAssistant";
var doneWith = "none";

exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.313c5f16-c0c0-4c98-a719-0abb10e28204";
    //alexa.userId = "cs160group11";
    //alexa.dynamoDBTableName = "recipes";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
 
var handlers = {
    
    //This intent is called upon opening the skill
    "LaunchRequest": function () {
        this.attributes["recipe"] = null;
        this.attributes["ingredients"] = null;
        this.attributes["readingIngredients"] = false;
        this.attributes["readingRecipe"] = false;
        this.attributes["recipeDialogue"] = false;
        var speechText = "Recipe assistant. What recipe would you like to make?";
        var repromptText = "For instructions on what you can say, please say what can i say?";
        this.emit(":ask", speechText, repromptText);
    },
    
    // This intent is called when the user asks what they can say
    
    "helpIntent": function () {
        // Customize message based on whether we are in main menu, or reading ingredients or recipes
        
        if(this.attributes["readingIngredients"] == true){
            // If this case is entered, we are currently reading ingredients
            var speechText = "To hear the next ingredient, say next ingredient.";
            speechText += "To hear the previous ingredient, say last ingredient. ";
            speechText += "To start the ingredients list over, say start over. ";
            speechText += "If you would like to read the recipe instead, say start recipe. ";
            speechText += "Or, you can say quit ingredients to return to the main menu.";
            this.emit("ask:", speechText);
            
        } else if (this.attributes["readingRecipe"] == true){
            // If this case is entered, we are currently reading a recipe
            var speechText = "To hear the next step say next step. ";
            speechText += "To hear the previous step, say last step. ";
            speechText += "If you would like to read the ingredients instead, say begin ingredients. ";
            speechText += "Or, you can say quit recipes to return to the main menu.";
            this.emit("ask:", speechText);
            
        }
        else {
            // If this case is entered, we are in the main menu
        
            var speechText = "You can ask me to make a recipe from your online recipe book,";
            speechText +=  " or say exit or quit recipe assistant to leave the app.";
            this.emit(":ask", speechText);
        }
    },
    
    // This intent is called when the user asks to make a recipe
    
    "whichRecipeIntent": function () {
        var speechText = "";
        var recipeSlot = this.event.request.intent.slots.RECIPES.value;

        console.log("attempt to find " + recipeSlot);
        
        var params = {
            TableName : "recipes",
            FilterExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                 ":name": recipeSlot,
            }
        };
        console.log("params created: " + params);

        var alexa = this;
        docClient.scan(params, function(err, data) {
            console.log("scanning!");
            if (err) {
                console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
                alexa.emit(":tell", "I'm sorry, I'm having trouble looking up your recipes. Please try again later.");
            } else {
                console.log("Query succeeded.");
                console.log("there are " + data.Items.length + " items returned.");
                if (data.Items.length == 0) {
                    console.log("Could not find " + recipeSlot);
                    alexa.emit(":ask", "I'm sorry, I found no recipes matching " + recipeSlot + ". Please try a different recipe.");
                } else {
                    // Just choose the first recipe from the list of matches
                    var recipe = data.Items[0];
                    console.log(recipe.ingredients);
                    console.log(recipe.steps);

                    alexa.attributes["ingredients"] = JSON.parse(recipe.ingredients);
                    alexa.attributes["recipe"] = JSON.parse(recipe.steps);
                    var recipeName = recipe.name;
                    var speechText = "I found a recipe for " + recipeName + ". Please say ingredients if you want to hear the ingredients, or say recipe if you want to hear the recipe.";
                    alexa.attributes["recipeDialogue"] = true;
                    alexa.emit(":ask", speechText);
                }
            }
        });
    },
    
    // This intent is called when the user asks to quit/exit
    
    "quitIntent": function () {
        
        this.attributes["quitting"] = true;
        
        if (this.attributes["readingRecipe"] == true) {
            var speechText = "Do you want to stop hearing the recipe?";
            this.emit(":ask", speechText);
        }
        else if (this.attributes["readingIngredients"] == true) {
            var speechText = "Do you want to stop hearing the ingredients?";
            this.emit(":ask", speechText);
        }
        else {
            // Quit this skill if we're at the main menu
            var speechText = "Are you sure you want to quit the Recipe Assistant?";
            this.emit(":ask", speechText);
        }
    },
    
    // This intent is called when the user requests to begin reading the ingredients
    
    "ingredientIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
        } else {
            // Switch to reading ingredients regardless of whether we're reading a recipe
            this.attributes["readingIngredients"] = true;
            this.attributes["readingRecipe"] = false;
            this.attributes["ingredientNum"] = 0;
        
            // Read the first ingredient from the ingredients array
            var firstIngredient = this.attributes["ingredients"][0];
        
            var speechText = "Beginning the list of ingredients. The first ingredient is ";
            speechText += firstIngredient;
            speechText += ". Say next ingredient when you're ready for the next ingredient.";
        
            this.emit(":ask", speechText);
        }
    },
    
    // This intent is called when the user requests the next ingredient in the recipe
    
    "nextIngredientIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
            
        }  else if (this.attributes["readingIngredients"] == true) {
            
            // Response if it is the last ingredient
            if (this.attributes["ingredientNum"] == this.attributes["ingredients"].length - 1) {
                var speechText = "That was the last ingredient. Moving on to the recipe. ";
                speechText += "To start reading the recipe, say begin recipe.";
                this.emit(":ask", speechText);
            } else {
                this.attributes["ingredientNum"] += 1;
                var i = this.attributes["ingredientNum"];
                var speechText = "The next ingredient is " + this.attributes["ingredients"][i];
                speechText += ". Say next ingredient when you're ready for the next ingredient.";
                this.emit(":ask", speechText);
            }
            
        } else {
            this.emit(":ask", "I'm sorry, I didn't understand your request. Please try again.");
        }
    },
    
    // This intent is called when the user requests the previous ingredient in the recipe
    
    "previousIngredientIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
            
        } else if (this.attributes["readingIngredients"] == true) {
            
            // Read the previous ingredient
            if (this.attributes["ingredientNum"] == 0){
                var speechText = "You are on the first ingredient. Say next ingredient when you're ready for the next ingredient.";
                this.emit(":ask", speechText);
            } else {
                this.attributes["ingredientNum"] -= 1;
                var i = this.attributes["ingredientNum"];
                var speechText = "The previous ingredient is " + this.attributes["ingredients"][i];
                speechText += ". Say next ingredient when you're ready for the next ingredient.";
                this.emit(":ask", speechText);
            }
        }
        else {
            this.emit(":ask", "I'm sorry, I didn't understand your request. Please try again.");
        }
    },
    
    //This intent is called when the user requests to start over the list of ingredients
    
    "startAgainIngredientIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
        } else if (this.attributes["readingIngredients"] == true) {
            
            // Start reading from the beginning of the ingredient array
            this.attributes["ingredientNum"] = 0;
        
            // Read the first ingredient from the ingredients array
            var firstIngredient = this.attributes["ingredients"][0];
        
            var speechText = "Beginning the list of ingredients. The first ingredient is ";
            speechText += firstIngredient;
            speechText += ". Say next ingredient when you're ready for the next ingredient.";
        
            this.emit(":ask", speechText);
        } else {
            this.emit(":ask", "I'm sorry, I didn't understand your request. Please try again.");
        }
    },
    
    //This intent is called when the user requests to begin reading the recipe
    
    "recipeIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
        }
        else {
            this.attributes["readingRecipe"] = true;
            this.attributes["readingIngredients"] = false;
            this.attributes["recipeStep"] = 0;
            
            // Read the first step in the recipe array
            var firstStep = this.attributes["recipe"][0];
            
            var speechText = "Beginning the recipe. First, ";
            speechText += firstStep;
            speechText += ". Say next step when you're ready for the next step.";
            this.emit(":ask", speechText);
        }
    },
    
    //This intent is called when the user requests the next step in the recipe
    
    "nextStepRecipeIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
        }
        
        // Exit if we have read the last step of the recipe
        if (this.attributes["recipeStep"] == this.attributes["recipe"].length - 1) {
            var speechText = "Great job! You have finished the recipe. Goodbye!";
            this.emit(":tell", speechText);
        }
        
        // Read the next step in the recipe
        else if (this.attributes["readingRecipe"] == true) {
            this.attributes["recipeStep"] += 1;
            var i = this.attributes["recipeStep"];
            var speechText = "The next step is " + this.attributes["recipe"][i];
            speechText += ". Say next step when you're ready for the next step.";
            this.emit(":ask", speechText);
        }
        else {
            this.emit(":ask", "I'm sorry, I didn't understand your request. Please try again.");
        }
    },
    
    // This intent is called when the user requests the previous step in the recipe
    
    "previousStepRecipeIntent": function () {
        // It is an error to call this intent without first looking up a recipe
        if (this.attributes["recipeDialogue"] != true) {
            this.emit(":ask", "Please say the recipe name that you want.");
        }
        // Read the previous step of the recipe
        if (this.attributes["readingRecipe"] == true) {
            if (this.attributes["recipeStep"] == 0) {
                var speechText = "You are on the first step. Say next step when you're ready for the next step.";
                this.emit(":tell", speechText);
            } else {
                this.attributes["recipeStep"] -= 1;
                var i = this.attributes["recipeStep"];
                var speechText = "The next step is " + this.attributes["recipe"][i];
                speechText += ". Say next step when you're ready for the next step.";
                this.emit(":ask", speechText);
            }
        }
        else {
            this.emit(":ask", "I'm sorry, I didn't understand your request. Please try again.");
        }
    },
    
    "AMAZON.YesIntent": function () {
       // Enter this state if user has asked to quit
        if (this.attributes["quitting"]) {
            
            if ((this.attributes["readingRecipe"] == true) || (this.attributes["readingIngredients"] == true)){
                // Return to main menu if currently reading recipe or ingredients
                this.attributes["recipe"] = null;
                this.attributes["ingredients"] = null;
                this.attributes["readingIngredients"] = false;
                this.attributes["readingRecipe"] = false;
                this.attributes["recipeDialogue"] = false;
                var speechText = "Recipe assistant. What recipe would you like to make?";
                var repromptText = "For instructions on what you can say, please say what can i say?";
                this.emit(":ask", speechText, repromptText);
                
            } else{
                // If we are in this case, we have requested to exit the application from the main menu.
                this.attributes["quitting"] = false;
                this.emit(":tell", "Okay, goodbye!");
            }
        }
        else {
            // Handle case where this intent is called when not quitting
            var speechText = "I'm sorry, I didn't understand your request. What can I help you with?";
            this.emit(":ask", speechText);
        }
 
    },
    
    "AMAZON.NoIntent": function () {
        if (this.attributes["quitting"]) {
            // Ask user for appropriate prompt depending on if they were listening to recipes or ingredients
            var speechText = "Ok, what can I help you with then?";
            this.attributes["quitting"] = false;
            this.emit(":ask", speechText);
        }
        else {
            // Handle case where this intent is called when not quitting
            var speechText = "I'm sorry, I didn't understand your request. What can I help you with?";
            this.emit(":ask", speechText);
        }
        var speechText = "You have reached the no intent.";
        this.emit(":ask", speechText);
    }
    
};


var pfunc = function(err, data) { 
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data);
    }
}
