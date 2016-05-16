(function () {
  'use strict';

  var malv = angular.module('malv', ['LocalStorageModule', 'ngAnimate', 'ngSanitize', 'ngTouch', 'ui.bootstrap', 'ui.router']);

  malv.config(function ($logProvider, $stateProvider, $urlRouterProvider, localStorageServiceProvider) {

    // Enables log
    $logProvider.debugEnabled(true);

    // Sets app prefix
    localStorageServiceProvider.setPrefix('malv');

    /* Sets router states */

    $stateProvider
      .state('login', {
        templateUrl: 'app/views/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('main', {
        templateUrl: 'app/views/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');

  }).run(function ($location, $log, $rootScope, $state, $timeout, $window, localStorageService) {

    // Detect OS
    $rootScope.os = $window.navigator.platform.substr(0, 3).toLowerCase();

    /* Detects browser */

    var userAgent = $window.navigator.userAgent;

    var browsers = {
      safari: /safari/i,
      chrome: /chrome/i,
      firefox: /firefox/i,
      ie: /internet explorer/i
    };

    for (var key in browsers) {
      if (browsers[key].test(userAgent)) {
        $rootScope.browser = key;
      }
    }

    /* Checks if user is logged */

    if (localStorageService.get('login') || $location.host() === 'localhost') {
      $state.go('main');
    } else {
      $state.go('login');
    }
  });
})();
