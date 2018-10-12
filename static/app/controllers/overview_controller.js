matchMunchiesApp.controller("OverviewController", ["$scope", "$rootScope", "$location", "$window", "localStorageService", "overviewService", function($scope, $rootScope, $location, $window, localStorageService, overviewService){
	$rootScope.userInfo = localStorageService.get("userInfo");
    if( localStorageService.get("userInfo") == null){
    	$window.location.href = '/#/';//take back to home to login
    }
    else{
    	var User = localStorageService.get("userInfo");
      	User.phone = parseInt(User.phone);
      	User.available_amount = parseInt(User.available_amount);
      	User.name = User.first_name + ' ' + User.last_name;
      	$scope.user = User;
    }

    $scope.logOut = function () {
		$scope.logoutAction = overviewService.logOut().get({},
			function(message) {
				$scope.error = null;
				localStorageService.set("userInfo", null);
				$location.path('/');
			},function(err){
				$scope.error = err.data.err.message;
		});
	};
}]);