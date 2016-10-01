var app = angular.module('myShoutBox', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController',
  })
  .when('/signup', {
    templateUrl: 'signup.html',
    controller: 'SignupController',
  })
  .when('/sports', {
    templateUrl: 'sports.html',
    controller: 'HomeController',
  })
  .when('/music', {
    templateUrl: 'music.html',
    controller: 'HomeController',
  })
  .when('/reset', {
    templateUrl: 'reset.html',
    controller: 'ResetController',
  })
  .when('/404', {
    templateUrl: '404.html',
  })
  .otherwise({
    redirectTo: '/404'
  });

      $locationProvider.html5Mode(true);
    });


app.run(function($rootScope, $cookies) {
  if ($cookies.get('token') && $cookies.get('currentUser')) {
    $rootScope.token = $cookies.get('token');
    $rootScope.currentUser = $cookies.get('currentUser');

  }
});

app.controller('HomeController', function ($rootScope, $scope, $http, $cookies) {

  var socket = io.connect('http://tanttran-myshoutbox.herokuapp.com');
  socket.on('connect', function(socket){
    console.log('Connected');
  });

  socket.on('newFeatured', function(data) {
    getShout();
    console.log('there\'s a new featured shout');
  });

  socket.on('newSport', function(data) {
    getSportsShout();
    console.log('there\'s a new sports shout');
  });

  socket.on('newMusic', function(data) {
    getMusicShout();
    console.log('there\'s a new music shout');
  });

  $scope.myShoutLogin = function() {

    $http.put('/users/login', {username: $scope.username, password: $scope.password})
    .then(function(res) {
      console.log(res.data.token);
      $cookies.put('token', res.data.token);
      $cookies.put('currentUser', $scope.username);
      $rootScope.token = res.data.token
      $rootScope.currentUser = $scope.username;
    }, function(err) {
        // $scope.username = '';
        // $scope.password = '';
        alert('Wrong Username or Password');

      });
  };

  $scope.logout = function() {
    $cookies.remove('token');
    $cookies.remove('currentUser');
    $rootScope.token = null;
    $rootScope.currentUser = null;
    $scope.username = '';
    $scope.password = '';
  };

  $scope.submitNewShout = function() {
    if ($scope.newShout.length < 1) {
      return alert('shouts cannot be blank');

    }

    console.log($scope.newShout);
    $http.post('/featuredshouts', 
      {newShout:  $scope.newShout}, 
      {headers: {
        'authorization': $rootScope.token
      }}).then(function(){
      getShout();
      $scope.newShout = '';
    });

  };

  $scope.submitSportsShout = function() {
    if ($scope.sportsShout.length < 1) {
      return alert('shouts cannot be blank');

    }

    console.log($scope.sportsShout);
    $http.post('/sportsshouts', 
      {sportsShout:  $scope.sportsShout}, 
      {headers: {
        'authorization': $rootScope.token
      }}).then(function(){
      getSportsShout();
      $scope.sportsShout = '';
    });

  };

  $scope.submitMusicShout = function() {
    if ($scope.musicShout.length < 1) {
      return alert('shouts cannot be blank');

    }

    console.log($scope.musicShout);
    $http.post('/musicshouts', 
      {musicShout:  $scope.musicShout}, 
      {headers: {
        'authorization': $rootScope.token
      }}).then(function(){
      getMusicShout();
      $scope.musicShout = '';
    });

  };

  $scope.removeShout = function(deleteShout) {
    $http.put('/featuredshouts/remove', 
      {shout: deleteShout},
      {headers: {
        'authorization': $rootScope.token
      }}).then(function() {
      getShout();
    });
  };

  $scope.removeSportsShout = function(deleteShout) {
    $http.put('/sportsshouts/remove', 
      {shout: deleteShout},
      {headers: {
        'authorization': $rootScope.token
      }}).then(function() {
      getSportsShout();
    });
  };

  $scope.removeMusicShout = function(deleteShout) {
    $http.put('/musicshouts/remove', 
      {shout: deleteShout},
      {headers: {
        'authorization': $rootScope.token
      }}).then(function() {
      getMusicShout();
    });
  };

  function getShout(){
    $http.get('/featuredshouts').then(function(response) {
      $scope.shouts = response.data;

    });
  }

  getShout();

  function getSportsShout(){
  $http.get('/sportsshouts').then(function(response) {
      $scope.sports = response.data;

    });
  }

  getSportsShout();

  function getMusicShout(){
  $http.get('/musicshouts').then(function(response) {
      $scope.music = response.data;

    });
  }

  getMusicShout();


});


app.controller('SignupController', function ($scope, $http) {
  console.log('You\'re ready to signup');
  $scope.submitShoutSignup = function(){
    var newUser = {
      username: $scope.username,
      password: $scope.password,
      email: $scope.email
    };
    $http.post('/users', newUser).then(function() {
      alert('success');
    });

  };

});

app.controller('ResetController', function ($scope, $http) {
  
  $scope.resetPassword = function(){
    
    $http.put('/users/resetPassword', {email: $scope.resetEmail}).then(function(res) {
      alert('Reset Password Sent');

  }, function(err) {
    alert('There are no user with that Email');
  });
};
});



