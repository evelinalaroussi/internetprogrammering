/* jslint node: true */
"use strict";

var express = require('express');
var router = express.Router();
var model = require("./model.js");
var passwordHash = require('password-hash');

router.post('/getUser', function (req, res) {
	req.session.name = req.body.realname;
	var username = req.body.realname;
	var password = req.body.password;
	var callback = function(status, pw){
		if (status == "approved") {
			var stat = passwordHash.verify(password, pw);
			if(stat == true) {
				res.json({status:status});
			}
		}
	};

	model.checkUser(username,password,callback);
	//console.log(req.session);
});

router.post('/setUser', function (req, res) {
	var username = req.body.realname;
	var password = req.body.password;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var hashedPassword = passwordHash.generate(password);
	var callback = function (response) {
		res.json({check:response});
	}
	model.setUser(username,hashedPassword, firstname, lastname,callback);
});

router.post('/search', function (req, res) {
	var searchedUser = req.body.searchedUser;
	var callback = function(status){
		res.json({searchResult:status});

	};
	model.searchUser(searchedUser,callback);

});

router.post('/getRealUser', function (req, res) {
	var username = req.body.username;
	var callback = function(response){
		//console.log(response);
		res.json({names:response});
	}
	model.getRealName(username,callback);

});

router.post('/getMapName', function (req, res) {
	var username = req.body.username;
	var callback = function(response){
		res.json({name:response});
	}
	model.getMapName(username,callback);

});


router.post('/logout', function (req, res) {
	req.session.destroy();
	res.json({logout: "ok"});

});

router.post('/getFollowers', function (req, res) {
	var user = req.body.user1;

	var callback = function(status){
		res.json({followers:status});

	};

	model.usersFollowed(user,callback);

});

router.post('/followingYou', function (req, res) {
	var user = req.body.user1;
	//console.log("tjenamors" + user);
	var callback = function(status){
		//console.log(status);
		res.json({followers:status});
	};

	model.followedBy(user,callback);

});

router.post('/follow', function (req, res) {
	var user1 = req.body.user1;
	var user2 = req.body.user2;
	var callback = function(status){
		res.json({status:"followed"});
	};
	
	model.followUser(user1,user2,callback);

});

router.post('/unfollow', function (req, res) {
	var user1 = req.body.user1;
	var user2 = req.body.user2;
	model.unfollow(user1,user2);
	res.json({status:"unfollowed"});

});


router.post('/checkIfFollow', function (req, res) {
	var user1 = req.body.user1;
	var user2 = req.body.user2;
	var callback = function(status){
		res.json({status:status});
	};
	model.checkIfFollow(user1, user2, callback);

});

module.exports = router;
