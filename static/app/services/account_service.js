(function () {

    function accountService ($resource) {

        this._server_host = "";

        this.updateInfo = function(){
            return $resource(this._server_host+"/user", null,  
                {
                    put:  {
                        method: 'PUT'
                    }
                }
            );
        };

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

    matchMunchiesApp.service("accountService", ['$resource', accountService]);
})();