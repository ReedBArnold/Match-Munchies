var matchMunchiesApp = angular.module("matchMunchiesApp", ["ngRoute","ngResource", "LocalStorageModule"]);


matchMunchiesApp.config(["$routeProvider", function($routeProvider){
    $routeProvider
        .when("/", {
            templateUrl: "app/partials/home.html",
            controller: "HomeController"
        })
        .when('/signup', {
            controller: 'SignUpController',
            templateUrl: 'app/partials/sign_up.html'
        })
        .when('/resetpassword', {
            controller: 'ResetPassController',
            templateUrl: 'app/partials/reset_pass.html'
        })
        .when('/user/overview', {
            controller: 'OverviewController',
            templateUrl: 'app/partials/overview.html',
            
        })
        .when('/user/friends', {
            controller: 'FriendsController',
            templateUrl: 'app/partials/friends.html'
        })
        .when('/user/account', {
            controller: 'AccountController',
            templateUrl: 'app/partials/account.html'
        })
        .when('/user/searchResults', {
            controller: 'SearchResultsController',
            templateUrl: 'app/partials/search_results.html'
        })
        .otherwise({
            templateUrl: "app/partials/home.html",
            controller: "HomeController"
        });
}]);