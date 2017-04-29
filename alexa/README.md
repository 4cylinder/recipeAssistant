# Voice UI Overview

Program flow for our Alexa skill:

![Flow Diagram](https://github.com/4cylinder/recipeAssistant/alexa/AlexaFlow.jpg)

Upon opening the Recipe Assistant skill, the user is asked what recipe they would like to make. The user can respond in one of three ways:

* Asking for help - This causes Alexa to emit a list of recipes the user can choose, as well as telling the user they can quit the app
* Asking to quit - This causes the application to quit.
* Stating what recipe they want to cook.

The user responding with a recipe they want to cook allows for the program flow to continue. The skill then accesses our DynamoDB “recipes” table and searches for a recipe that matches the user’s request. If no such recipe is found, Alexa asks the user to try again. If the recipe is found, Alexa alerts the user and asks if the user would like to hear the list of ingredients or the recipe instructions. If the user says “ingredients”, Alexa lists off the ingredients one at a time, with the user saying “next” whenever they would like the next ingredient to be read. Once the list of ingredients is done, or if the user says “recipe”, Alexa begins to read off the recipe instructions step by step. Once again, the user needs to respond “next” in between each recipe step in order for Alexa to speak the next instruction. Once the recipe is completed, Alexa will let the user know, and then exit out of the application.
Additionally, if the user says “help” at any point during the recipe dialogue, Alexa lets the user know what they can say within the dialogue. If the user asks to “quit”, Alexa will return to the main menu of the application.

**Sample Scenario 1**
* User: Alexa, open Recipe Assistant.
* Alexa: Recipe assistant. What recipe would you like to make?
* User: What can I say?
* Alexa: You can ask me to make a recipe from your online recipe book. Or, say “exit, or quit recipe assistant” to leave the app.
* User: I’d like to bake pumpkin pie.
* Alexa: I’m sorry, I found no recipes matching pumpkin pie. Please try a different recipe.
* User: I’d like to make cheesecake.
* Alexa: I found a recipe for cheesecake. Please say “ingredients” if you want to hear the ingredients, or say “recipe” if you want to hear the recipe.
* User: Recipe.
* Alexa: Beginning the recipe. First, create cookie bottom from crackers. Say “next step” when you’re ready for the next step.
* User: Next step.
* Alexa: The next step is mix wet ingredients. Say “next step” when you’re ready for the next step.
* User: Next step.
* Alexa: The next step is mix dry ingredients. Say “next step” when you’re ready for the next step.
* User: What’s the next step?
* Alexa: The next step is bake the cake. Say “next step” when you’re ready for the next step.
* User: Next step.
* Alexa: Great job! You have finished the recipe. Goodbye!

**Sample Scenario 2**

* User: Alexa, open Recipe Assistant.
* Alexa: Recipe assistant. What recipe would you like to make?
* User: Let’s make spaghetti.
* Alexa:  I found a recipe for spaghetti. Please say ingredients if you want to hear the ingredients, or say recipe if you want to hear the recipe.
* User: Tell me the ingredients.
* Alexa: Beginning the list of ingredients. The first ingredient is meatballs. Say “next ingredient” when you’re ready for the next ingredient.
* User: Next ingredient.
* Alexa: The next ingredient is sauce. Say “next ingredient” when you’re ready for the next ingredient.
* User: Start again.
* Alexa: Beginning the list of ingredients. The first ingredient is meatballs. Say “next ingredient” when you’re ready for the next ingredient.
* User: Next ingredient.
* Alexa: The next ingredient is sauce. Say “next ingredient” when you’re ready for the next ingredient.
* User: Previous ingredient?
* Alexa: The previous ingredient is meatballs. Say “next ingredient” when you’re ready for the next ingredient.
* User: Next.
* Alexa: The next ingredient is sauce. Say “next ingredient” when you’re ready for the next ingredient.
* User: Next ingredient.
* Alexa: The next ingredient is noodles. Say “next ingredient” when you’re ready for the next ingredient.
* User: Next.
* Alexa: That was the last ingredient. Moving on to the recipe. To start reading the recipe, say “begin recipe.”
* User:  Start recipe.
* Alexa: Beginning the recipe. First, boil noodles. Say “next step” when you’re ready for the next step.
* User: Exit recipes.
* Alexa: Do you want to stop hearing the recipe?
* User: Yes.
* Alexa: Recipe assistant. What recipe would you like to make?
* User: Quit recipe assistant.
* Alexa: Are you sure you want to quit the Recipe Assistant?
* User: Yes.
* Alexa: Ok, Goodbye!