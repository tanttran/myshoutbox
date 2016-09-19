var app = angular.module('myShoutBox', []);



app.controller('HomeController', function ($scope) {
  $scope.shout = [
  'One',
  'Two',
  'Three',
  'Four',
  'Test'
];
});