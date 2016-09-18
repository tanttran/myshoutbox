var app = angular.module('myShoutBox', []);

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
      .when('/audittrail', {
        templateUrl: 'audittrail.html',
        controller: 'AuditTrailController',
      })
      .when('/404', {
        templateUrl: '404.html'
      })
      .otherwise({
        redirectTo: '/404'
      })

      $locationProvider.html5Mode(true);
    });