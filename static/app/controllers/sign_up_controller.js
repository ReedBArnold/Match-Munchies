matchMunchiesApp.controller("SignUpController", ["$scope", "$location", "$window", "signUpService", function($scope, $location, $window, signUpService){

	$scope.register = function (user_data) {
		$scope.message = null;
		$scope.error = null;
		var dataValidation = validateInput(user_data);

		if(user_data != null && Object.keys(user_data).length == 7){//6 fields total
			if(dataValidation){//check that the data is formatted correctly
				$scope.registerAction = signUpService.registerUser().save(
			    	{
						username: user_data.username,//email
						qu_id: user_data.qu_id,
						first_name: user_data.first,
						last_name: user_data.last,
						phone: user_data.phone,
						user_kind: 'Seller',//default as asked by client
						password: user_data.password
					},
					function(message) {
						$scope.finished_loading = true;
						$scope.registerAction = message;
						$scope.message = message.status;
						setTimeout(function(){ $window.location.href = '/#/'; }, 3000);
					},function(err){
						$scope.message = null;
						$scope.error = err.data.err.message;
						console.log(err);
				});
			}
		}
    };

    function validateInput(user_data){
    	if(user_data != null && Object.keys(user_data).length == 7){
    		if(user_data.phone.toString().length != 10){
	    		$scope.message = null;
	    		$scope.error = 'Phone number must be exactly 10 digits!';
	    		return false;
	    	}
	    	if(user_data.qu_id.toString().length != 7){
	    		$scope.message = null;
	    		$scope.error = 'QU ID must be exactly 7 digits!';
	    		return false;
	    	}
	    	var email = user_data.username;
	    	var index = email.indexOf("@quinnipiac.edu");
	    	var index1 = email.indexOf("@qu.edu");
	    	if(index == -1 && index1 == -1){//email has @ in it
	    		$scope.message = null;
	    		$scope.error = 'Please provide a valid QU email address!';
	    		return false;
	    	}
	    	if(user_data.password != user_data.password_confirm){
	    		$scope.message = null;
	    		$scope.error = 'The two passwords do not match!';
	    		return false;
	    	}
	    	return true;//otherwise return true
    	}
    	return false;
    }
}]);