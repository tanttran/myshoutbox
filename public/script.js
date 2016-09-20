var app = angular.module('myShoutBox', []);

app.controller('HomeController', function ($scope, $http) {

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