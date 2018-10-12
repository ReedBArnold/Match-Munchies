(function () {

    function overviewService ($resource) {

        this._server_host = "";

        this.logOut = function(){
            return $resource(this._server_host+"/user/logout", null,  
                {
                    get:  {
                        method: 'GET'
                    }
                }
            );
        };
    }

    matchMunchiesApp.service("overviewService", ['$resource', overviewService]);
})();