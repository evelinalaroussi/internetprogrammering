(function(){
  var app = angular.module("chat", [
  'ngRoute',
  'chattControllers',
  'ui.bootstrap'
  ]);

  app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: 'list.html',
        controller: 'listController'
      }).
      when('/signup', {
        templateUrl: 'signup.html',
        controller: 'signupController'
      }).
      when('/follow', {
        templateUrl: 'following.html',
        controller: 'followController'
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: 'loginController'
      }).
      when('/logout', {
        templateUrl: 'login.html',
        controller: 'logoutController'
      }).
      when('/person/:person', {
        templateUrl: 'room.html',
        controller: 'roomController'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

  app.run(function($location, UserService){
        let loggedIn = UserService.getName();
        if  (!loggedIn){
            $location.url('/login');
        }
});

})();
