(function() {

  angular.module('chat')
  .factory('UserService', function($http) {

    var username = "";
    var stat;
    var follower;


    return {
      // getUsername: getUsername,
      setStatus: function(stat) {
        status = stat;
      },
      getStatus: function() {
        return status;
      },
      getName: function() {
        return username;
      },

      setName: function(name) {
        username = name;
      },

      clearData: function() {
         username = "";
         status = "";

      }

    };
  })

  .factory('HttpService', function($http) {
    return {
      post: function(path, data, callback){
        $http.post('/API/' + path, data, {withCredentials: true}).success(callback);
      },
      get: function(path, callback){
        $http.get('/API/' + path).success(callback);
      }
    };
  });

})();
