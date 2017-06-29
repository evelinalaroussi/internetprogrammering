/* jslint node: true */
"use strict";
/**
 * A module that contains the main system object!
 * @module roomSystem
 */
 var Firebase = require('firebase');
 Firebase.initializeApp({
  apiKey: "AIzaSyDhntvPeLVBQ-nwppwAi2Gsqh7rBvT7Vl4",
    authDomain: "intnet-project.firebaseapp.com",
    databaseURL: "https://intnet-project.firebaseio.com",
    storageBucket: "intnet-project.appspot.com",
    messagingSenderId: "675053245114"
});

var db = Firebase.database();
var ref = db.ref("/users");  //Set the current directory you are working in
var ref2 = db.ref("/maps");
var ref3 = db.ref("/mapstyles")
var ref4 = db.ref("/following")


/*/**
* USER FUNCTIONS
*/

 function User (id, name, password, firstname, lastname) {
  this.id = id;
  this.name=name;
  this.password=password;
  this.firstname=firstname;
  this.lastname=lastname;
 
 }

//check if the user that tries to log in is a user or not
 exports.checkUser=function(username, password, callback){
  var status="dissmissed";
  ref.once("value", function(snapshot) {
  var data = snapshot.val();   //Data is in JSON format.
  for (var i in data){

      if (username == data[i].name){
        status = "approved"
        callback(status, data[i].password);
        
      }
    
  }
  });
 }

//set user if signing up
exports.setUser=function(name, password, firstname, lastname,callback){

var check;
var q = ref.orderByChild('name').equalTo(name);
q.once('value', function(snapshot) {
      if (snapshot.val() === null) {
        // username does not yet exist, go ahead and add new user
          var id = Math.random().toString(36).substr(2, 9);
          var user = new User(id,name, password, firstname, lastname);
          ref.child(id).set(user);
          var map = new Map(name);
          var mapid=name;
          ref2.child(mapid).set(map);
          check = "added";
      } else {
        // username already exists, ask user for a different name
          check="not added";
      }
      callback(check);
    });
 }

//get first and last name
 exports.getRealName = function(username,callback) {
  var firstName;
  var lastName;
    ref.once("value", function(snapshot) {
    var data = snapshot.val();   //Data is in JSON format.
    for (var i in data){
        if (username == data[i].name){
          firstName = data[i].firstname;
          lastName = data[i].lastname;
        }
    }
      callback({firstname:firstName,lastname:lastName});
    });
 }

//check for user when searching in the search box
exports.searchUser=function(username,callback) {
  var searchList = [];
  ref.once("value", function(snapshot) {

    var data = snapshot.val();   //Data is in JSON format.

    for (var i in data){
        if (data[i].name.includes(username) && username.length>0) {
          searchList.push(data[i].name);
        }
    }
    callback(searchList)
  });
return searchList;
}

// FOLLOWING FUNCTIONS. 

//object with yourself and a person that follows you and the date that person started following you. 
function Follow (user1,user2) {
  this.youself = user1;
  this.user = user2;
  this.date = Date().slice(3,15);

 }

//get the users that you are following
exports.usersFollowed=function(user,callback){
    var followerList = [];
    ref4.child(user).once("value", function(snapshot) {
    var data = snapshot.val();   //Data is in JSON format.

    for (var i in data){
       followerList.push(data[i].user);
    }
    
    callback(followerList);

  });
    return followerList;
 }

//get the users that follows you
 exports.followedBy=function(user,callback){
    var followerList = [];
        ref4.once("value", function(snapshot) {
        var data = snapshot.val();   //Data is in JSON format.
        for (var i in data){
          for (var k in data[i]) {
            //console.log(data[i][k].user);
          }
            if (user == data[i][k].user){
              followerList.push({name:data[i][k].youself,date:data[i][k].date});              
            }
          
        }
            callback(followerList);

        });
    
 }


//start following a user
exports.followUser=function(user1,user2, callback){
    var url = "/following/"+user1;
    var ref5 = db.ref(url)
    var usertofollow = new Follow(user1,user2);
    //console.log("PUSHIPUSH");
    var id = Math.random().toString(36).substr(2, 9);
    ref5.child(id).set(usertofollow);
    callback();
 }

//unfollowing a person
exports.unfollow = function(user1,user2) {
  var url = "/following/" + user1;
  var ref = db.ref(url); 

  ref.once('value', function (snapshot) {

      snapshot.forEach (function (data) {
        var item = {
          key: data.key, //this is to get the ID, if needed
          name1: data.val ().user,
        }

        if (data.val ().user == user2) {
          //console.log(data.key + "unfolling person key");
          ref.child(data.key).remove();
        }

      });
    
  });
  return
};

//checks if you are following the person that you are visiting
exports.checkIfFollow = function(user1,user2, callback) {
    var list = [];
    ref4.child(user1).once("value", function(snapshot) {
      var data = snapshot.val();
      for (var i in data){
        //console.log(data[i].user, user2);
        if (data[i].user == user2) 
          list.push("follow")
      }
      callback(list.length);
    });
 }

 //MAP FUNCTIONS

function Map (user) {
  this.user = user;
  this.styling = "default";
  this.mapName = user + "'s map";
 }

// gets the name of a specific users map
exports.getMapName = function(user, callback) {
  ref2.child(user).once("value",function(snapshot) {
    var data = snapshot.val();
    //console.log(data.mapName);
      callback(data.mapName);
    });
}

