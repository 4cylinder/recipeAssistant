# Recipe Assistant

**Group 11**: T.S. Yew, Caitlin Gruis, David Winer, William Ho

This application uses both a desktop and a voice interface. The `website` folder contains an AngularJS-based serverless web app which allows users to create new recipes, which are stored in a DynamoDB table. The `alexa` folder contains an Alexa skill which lets users ask Alexa what ingredients they need for a particular recipe and what the recipe steps are.

**Setup Instructions (Website)**
* Enter the `website` folder and run `python -m SimpleHttpServer`, or if you already have a HTTP server (i.e. Apache), copy the website folder to your server’s location.
* If you used the python command, navigate to 127.0.0.1:8000 in your browser.

**Setup Instructions (Alexa Skill)**
* Enter the `alexa` folder and find the `alexa.zip` file
* Upload the entire zipped archive as your lambda function in the AWS Console.

**Technologies used**:
* Alexa Skills Kit
* Bootstrap
* Angular 1.5.7
* jQuery
