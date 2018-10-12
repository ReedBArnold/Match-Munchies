matchMunchiesApp.controller("SearchResultsController", ["$scope", "$rootScope", "$location", "$window", "localStorageService", "friendsProvider", "searchResultsService", function($scope, $rootScope, $location, $window, localStorageService, friendsProvider, searchResultsService){
    $rootScope.userInfo = localStorageService.get("userInfo");
    if( localStorageService.get("userInfo") == null){
    	$window.location.href = '/#/';//take back to home to login
    }

    $scope.logOut = function () {
		$scope.logoutAction = searchResultsService.logOut().get({},
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