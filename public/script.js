var app = angular.module('myShoutBox', ['ngRoute']);

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
      // .when('/404', {
      //   templateUrl: '404.html'
      // })
      // .otherwise({
      //   redirectTo: '/404'
      // });

      // $locationProvider.html5Mode(true);
    });

app.controller('HomeController', function ($scope, $http) {

  $scope.shoutSignin = function() {

    $http.put('/users/login', {username: $scope.username, password: $scope.password})
      .then(function() {
        alert('You\'re log in');
      }, function(err) {
        // $scope.username = '';
        // $scope.password = '';
        alert('Wrong Username or Password');
      
      });
  }

  $scope.submitNewShout = function() {
    console.log($scope.newShout);
    $http.post('/featuredshouts', {newShout:  $scope.newShout}).then(function(){
      getShout();
      $scope.newShout = '';
    });

  };

  $scope.removeShout = function(deleteShout) {
    $http.put('/featuredshouts/remove', {shout: deleteShout}).then(function(){
      getShout();
    });
  };

  function getShout(){
    $http.get('/featuredshouts').then(function(response) {
      $scope.shouts = response.data;

    });
  }

  getShout();

  
});

app.controller('SignupController', function ($scope, $http) {
  console.log('You\'re ready to signup');
  $scope.submitShoutSignup = function(){
    var newUser = {
      username: $scope.username,
      password: $scope.password
    };
    $http.post('/users', newUser).then(function() {
      alert('success');
    });

  };

});



