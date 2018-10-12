matchMunchiesApp.controller("FriendsController", ["$scope", "$rootScope", "$location", "$window", "localStorageService", "friendService", function($scope, $rootScope, $location, $window, localStorageService, friendService){
    $rootScope.userInfo = localStorageService.get("userInfo");
    if( localStorageService.get("userInfo") == null){
    	$window.location.href = '/#/';//take back to home to login
    }

    $scope.logOut = function () {
		$scope.logoutAction = friendService.logOut().get({},
			function(message) {
				$scope.error = null;
				console.log(message);
				localStorageService.set("userInfo", null);
				$location.path('/');
			},function(err){
				console.log(err);
				$scope.error = err.data.err.message;
		});
	};
}]);