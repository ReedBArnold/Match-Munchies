matchMunchiesApp.controller("AccountController", ["$scope", "$rootScope", "$location", "$window", "localStorageService", "accountService", function($scope, $rootScope, $location, $window, localStorageService, accountService){
    $rootScope.userInfo = localStorageService.get("userInfo");
    $scope.message = null;
	$scope.error = null;
    if( localStorageService.get("userInfo") == null){
    	$window.location.href = '/#/';//take back to home to login
    }
    else{
      	var User = localStorageService.get("userInfo");
      	User.phone = parseInt(User.phone);
      	User.available_amount = parseInt(User.available_amount);
      	$scope.new_data = User;
    }

    $scope.updateInfo = function(new_data){
    	if(validatePhone(new_data)){
    		$scope.error = null;
    		if(validateUserType(new_data)){
    			$scope.error = null;
    			var reward = localStorageService.get("userInfo").rewards;
    			var p = new_data.pass;
    			if(p == null){
    				p = '';
    			}
	    		$scope.updateAction = accountService.updateInfo().put(
	    			{
	    				first_name: new_data.first_name,
			            last_name: new_data.last_name,
			            phone: new_data.phone,
			            user_kind: new_data.user_kind,
			            available_amount: new_data.available_amount,
			            rewards: reward,
	    				newPass: p
	    			},
					function(user) {
						$scope.error = null;
						$scope.message = 'Account Updated!';
						localStorageService.set("userInfo", user);
						var User = localStorageService.get("userInfo");
				      	User.phone = parseInt(User.phone);
				      	User.available_amount = parseInt(User.available_amount);
				      	$scope.new_data = User;
					},function(err){
						$scope.message = null;
						$scope.error = err;
				});
    		}
  			else{
  				$scope.message = null;
  				$scope.error = "Make sure your User Type is 'Seller' or 'Buyer'";
  			}
    	}
    	else{//handle error
    		$scope.message = null;
    		$scope.error = "Make sure your phone number has exactly 10 digits!";
    	}
    };

    $scope.logOut = function () {
		$scope.logoutAction = accountService.logOut().get({},
			function(message) {
				$scope.error = null;
				localStorageService.set("userInfo", null);
				$location.path('/');
			},function(err){
				$scope.error = err.data.err.message;
		});
	};

	function validatePhone(data){
		if(data.phone.toString().length == 10){
			return true;
		}
		return false;
	}
	function validateUserType(data){
		if(data.user_kind == 'Seller' || data.user_kind == 'Buyer'){
			return true;
		}
		return false;
	}
}]);