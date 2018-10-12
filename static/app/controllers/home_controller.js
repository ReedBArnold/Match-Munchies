matchMunchiesApp.controller("HomeController", ["$scope", "$rootScope", "$location", "$window", "localStorageService", "homeService", function($scope, $rootScope, $location, $window, localStorageService, homeService){
    $scope.loggedIn = null; //null means no
    $scope.message = null;
	$scope.error = null;
	if(localStorageService.get("userInfo") != null){
		$location.path('/user/overview');
	}

	$scope.logIn = function (credentials) {
		var dataValidation = validateInput(credentials);
		if(credentials != null && Object.keys(credentials).length == 2){
			if(dataValidation){
				$scope.loginAction = homeService.logIn().post(
					{
						username: credentials.username,//email
						password: credentials.password,
					},
					function(user) {
						$scope.error = null;
						localStorageService.set("userInfo", user);
						//setTimeout(function(){ $window.location.href = '/#/'; }, 3000);
						$location.path('/user/overview');
					},function(err){
						//$scope.message = null;
						$scope.error = err.data.err.message;
				});
			}
		}
	};

	function validateInput(credentials){
    	if(credentials != null && Object.keys(credentials).length == 2){
	    	var email = credentials.username;
	    	var index = email.indexOf("@quinnipiac.edu");
	    	var index1 = email.indexOf("@qu.edu");
	    	if(index == -1 && index1 == -1){//email has @ in it
	    		$scope.message = null;
	    		$scope.error = 'Please provide a valid QU email address!';
	    		return false;
	    	}
	    	return true;//otherwise return true
    	}
    	return false;
    }
}]);