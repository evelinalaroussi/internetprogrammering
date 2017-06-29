var chattControllers = angular.module('chattControllers', []);


chattControllers.controller('listController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    var user = user.getName();
    //console.log(user);
    $scope.user=user;
    $scope.usersrc="map.html?somedata="+$scope.user+"&more=bacon";
}
]);


chattControllers.controller('roomController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    
    var user = user.getName();
    var socket = io().connect();

    $scope.user=user;
    $scope.usersrc="mapother.html?somedata=";

    var user2 = document.URL.split("/:")[1]; //this is the person that you have clicked on, taken from the url.
    $scope.user2=user2;
    $scope.entries = [];
    $scope.usersrc="mapother.html?somedata="+$scope.user2+"&more=bacon";

//get whole name of the user you are visiting
    http.post('getRealUser', {username: user2}, function(response) {
      //console.log(response);
      $scope.firstname=response.names.firstname;
      $scope.lastname=response.names.lastname;
     });

//get name of the map of the person you are visiting 
    http.post('getMapName', {username: user2}, function(response) {
      //console.log(response);
      $scope.mapname=response.name;
     });

  //this function checks if you are following a person or not, decides weather if it should be a unfollow or follow button. 
  $scope.check = function() {
      //console.log("CHECK");
      http.post('checkIfFollow', {user1: user, user2: user2}, function(response) {
        //console.log(response.status);
          if(response.status==1){
            $scope.f = "unfollow";
          }
          else {
            $scope.f = "follow";
          }
      });

    };

    $scope.check();

    socket.on('join', function (data) {
      $scope.$apply(function(){
       // console.log("join");
        //console.log(data);
        $scope.entries.push("You started following: " + data.follower);
        //console.log("hej du followar");
        $scope.f ="unfollow";

      });
    });

  //runs whenclickon on either follow or unfollow button. 
  $scope.follow = function() {
  if ($scope.f == "follow"){

    http.post('follow', {user1: user, user2: user2}, function(response) {
        //console.log(response);
        });

    socket.emit("join", {name:user, follower:user2});
  }

  else if ($scope.f =="unfollow"){
    http.post('unfollow', {user1: user, user2: user2}, function(response) { 
       //console.log(response);
      });

    socket.emit("unfollow", {name:user, follower:user2});
  }

};

socket.on('unfollow', function (data) {
      $scope.$apply(function(){
        //console.log("join");
        //console.log(data);
        $scope.entries.push("You unfollowed " + data.follower);
        $scope.f ="follow";
      });
    });
    
}
]);

chattControllers.controller('followController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    var user = user.getName();

    //get all of you followers
    http.post('getFollowers', {user1: user}, function(response) {
      $scope.followerList = [];
        for (i in response.followers){
          $scope.followerList.push({name:response.followers[i]})
       } 

        });
    //get the people that are following you
    http.post('followingYou', {user1: user}, function(response) {
      $scope.followingYouList = [];
        for (i in response.followers){
          $scope.followingYouList.push({name:response.followers[i].name, date:response.followers[i].date})
       } 
     });

    $scope.goto = function(name){
      var url = "person/:"+name;
      $scope.redirect(url);
    }

      $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      //console.log("location = " + $scope.location);
   
    };
  }
]);


chattControllers.controller('loginController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.name = "";
    $scope.done = function() {
      //console.log("Reached done()");
      http.post('getUser', {realname: $scope.name, password: $scope.password}, function(response) {
        //console.log("HEJ");
        //console.log(response);
        if (response.status=="approved"){
          user.setName($scope.name);
          $location.path('list');
        }

      });
    };

  }
]);

chattControllers.controller('logoutController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
   // console.log("HEJLOGOUT");
    user.clearData();
    //console.log(user.getName());
     $location.path('login');
  }
]);

chattControllers.controller('signupController', ['$scope', 'HttpService', '$location', 'UserService',
  function($scope, http, $location, user) {
    $scope.name = "";
    $scope.done = function() {

        http.post('setUser', {realname: $scope.name, password: $scope.password, firstname: $scope.firstname, lastname: $scope.lastname}, function(response) {

          if (response.check=="added") {
            alert("Thank you for joining our website. Please login to make a map");
            $location.path('login');
          }
          else if (response.check=="not added") {
            alert("That username is already taken, please choose another one");

          }
          });


  };
}
]);

chattControllers.controller('navigationController', ['$scope',  'HttpService','$location', 'UserService',
  function($scope, http, $location, user) {

  $scope.class = "empty";


  $scope.goto = function(name){
    var url = "person/:"+name;
    $scope.redirect(url);
  }

    $scope.isUserLoggedout = true;

    $scope.location = $location.path();

    // // This function should direct the user to the wanted page
    $scope.redirect = function(address) {
      $location.hash("");
      $location.path('/' + address);
      $scope.location = $location.path();
      //console.log("location = " + $scope.location);
    };

    $scope.search = function() {
      http.post('search', {searchedUser: $scope.results}, function(response) {
        if (response.searchResult.length>0){
          $scope.class = 'full';
        }
        else {
          $scope.class = "empty";
        }
        $scope.searchArray = response.searchResult;
        //console.log(response.searchResult.length);
        //$location.path('');
        $scope.actions = [];
        for (i in response.searchResult){
          //console.log(response.searchResult[i]);
          $scope.actions.push({name:response.searchResult[i]})
       } 

      });
    };

  }

]);
