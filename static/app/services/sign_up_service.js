(function () {

    function signUpService ($resource) {

        this._server_host = "";

        this.registerUser = function () {
           return $resource(this._server_host+"/signup", null,  
                {
                    save:  {
                        method: 'POST'
                    }
                }
            );
        }; 
    }

    matchMunchiesApp.service("signUpService", ['$resource', signUpService]);
})();