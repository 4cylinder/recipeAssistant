var app = angular.module('recipeAssistant', ['ngRoute', 'ngSanitize']);

app.config(function($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl : 'pages/home.html',
		controller  : 'HomeController'
	})

	.when('/view/:recipeId', {
		templateUrl : 'pages/view.html',
		controller  : 'ViewController'
	})

	.when('/create', {
		templateUrl : 'pages/create.html',
		controller  : 'CreateController'
	})

	.otherwise({redirectTo: '/'});
});

var dynamoUrl = "https://rj9ozhp0k3.execute-api.us-east-1.amazonaws.com/prod/accessRecipeDB";
app.controller('HomeController', function($scope,$http) {
	$scope.title = "Recipe Assistant";
	$http.get(dynamoUrl+"?TableName=recipes").then(function (response) {
    	$scope.recipes = response.data.Items;
    	$scope.recipes.forEach(function (recipe){
    		// Capitalize first letter of each word in the name
    		recipe.name = capitalizeFirstLetter(recipe.name);

    		// render ingredients as bullet points
    		var list = JSON.parse(recipe.ingredients);
			var newList = "<ul>";
			for (var i=0; i<list.length; i++){
				newList += "<li>";
				newList += list[i];
				newList += "</li>";
			}
			newList += "</ul>";
			recipe.ingredients = newList;

			// render steps as numbered list
			list = JSON.parse(recipe.steps);
			newList = "<ol>";
			for (var i=0; i<list.length; i++){
				newList += "<li>";
				newList += list[i];
				newList += "</li>";
			}
			newList += "</ol>";
			recipe.steps = newList;
    	});
    });

});

app.controller('CreateController', function($scope) {
	$scope.title = "Create Recipe";
});

app.controller('ViewController', function($scope, $http, $routeParams) {
	$recipeId = $routeParams.recipeId;
	$scope.title = "Create Recipe";
	$http.get(dynamoUrl+"?TableName=recipes").then(function (response) {
    	response.data.Items.forEach(function (recipe){
    		// Capitalize first letter of each word in the name
    		if (recipe.id==$recipeId){
    			$scope.name = capitalizeFirstLetter(recipe.name);
    			$scope.imgurl = recipe.imgurl;
    			$scope.ingredients = JSON.parse(recipe.ingredients);
    			$scope.steps = JSON.parse(recipe.steps);
		    }
    	});
    });
});


function capitalizeFirstLetter(str) {
    //return string.charAt(0).toUpperCase() + string.slice(1);
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}