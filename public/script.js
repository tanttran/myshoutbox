var app = angular.module('myShoutBox', []);

app.controller('HomeController', function ($scope, $http) {

  $scope.submitNewShout = function() {
    console.log($scope.newShout);
    $http.post('/featuredshouts', {newShout:  $scope.newShout}).then(function(){
      alert('success!');
    });

  };

  $http.get('/featuredshouts').then(function(response) {
    $scope.shouts = response.data;
    

  });
});