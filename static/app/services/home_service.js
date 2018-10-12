(function () {

    function homeService ($resource) {

        this._server_host = "";

        this.logIn = function(){
            return $resource(this._server_host+"/", null,  
                {
                    post:  {
                        method: 'POST'
                    }
                }
            );
        };
    }

    matchMunchiesApp.service("homeService", ['$resource', homeService]);
})();