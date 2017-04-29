# Web Application Overview

The `index.html` file dynamically loads these templates from the `pages` directory using AngularJS:
* `home.html`: Displays all recipes in the form of picture cards with the ability to pop up each recipe’s ingredients and steps in modals.
* `create.html`: Allows the user to input a new recipe with a name, ingredient list, list of steps, and photograph.
* `view.html`: Accessed by clicking one of the cards. Displays all relevant details of the recipe in its own page.

All pages share a navigation bar from which the user can perform searches or access settings (neither function was implemented in this assignment). AngularJS is used to simulate a single-page experience in a serverless environment.

**Screenshots**

Our index page, showing all existing recipes:

![image](https://github.com/4cylinder/recipeAssistant/website/0.png)

Index page on mobile:

![image](https://github.com/4cylinder/recipeAssistant/website/1.png)

Page for adding a recipe:

![image](https://github.com/4cylinder/recipeAssistant/website/2.png)

Viewing an individual recipe (mobile):

![image](https://github.com/4cylinder/recipeAssistant/website/3.png)

Viewing ingredients straight away (mobile by pressing the blue “Ingredients” button in the card):

![image](https://github.com/4cylinder/recipeAssistant/website/4.png)

Viewing recipe steps straight away (mobile) by pressing the blue “Steps” button in the card:

![image](https://github.com/4cylinder/recipeAssistant/website/5.png)

Input validation on “create recipe” page, warning the user of a missing field:

![image](https://github.com/4cylinder/recipeAssistant/website/6.png)

Notification to user that a new recipe was successfully inserted:

![image](https://github.com/4cylinder/recipeAssistant/website/7.png)