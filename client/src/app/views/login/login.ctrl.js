(function () {
    'use strict';

    angular
        .module('malv')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$http', '$log', '$scope', '$state', 'config', 'localStorageService'];

    function LoginCtrl($http, $log, $scope, $state, config, localStorageService) {

        $scope.guest = false;

        $scope.checkLogin = function () {
            $log.debug('LoginCtrl->checkLogin()');

            if (!$scope.login) {
                $scope.$applyAsync(function() {
                    $scope.loginStatus = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>  No login !';
                });

            } else {
                if ($scope.guest) {

                    $scope.$applyAsync(function () {
                        $scope.loginStatus = 'Checking...';
                    });

                    $http.get(config.apiUrl + '/animelist/' + $scope.login).then(function (data) {

                        if (data.error === 'Invalid username') {
                            $scope.$applyAsync(function () {
                                $scope.loginStatus = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> Invalid login !';
                            });

                        } else {
                            localStorageService.set('login', $scope.login);
                            $state.go('main');
                        }
                    }, function (error) {
                        $scope.$applyAsync(function () {
                            $scope.loginStatus = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> An error occurred :(';
                        });
                        $log.error('LoginCtrl->checkLogin(): error ' + error.status + '.');
                    });

                } else {
                    if (!$scope.password) {
                        $scope.$applyAsync(function () {
                            $scope.loginStatus = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> No password !';
                        });
                    } else {
                        $scope.$applyAsync(function () {
                            $scope.loginStatus = 'Checking...';
                        });

                        $http.get(config.apiUrl + '/verifycredentials/' + $scope.login + '/' + $scope.password).then(function (res) {

                            if (!res.data.authenticated) {
                                $scope.$applyAsync(function () {
                                    $scope.loginStatus = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> Invalid credentials !';
                                });
                            } else {
                                localStorageService.set('login', $scope.login);
                                localStorageService.set('secureKey', res.data.secureKey);
                                $state.go('main');
                            }
                        }, function (error) {
                            $scope.$applyAsync(function () {
                                $scope.loginStatus = '<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> An error occurred :(';
                            });
                            $log.error('LoginCtrl->checkLogin(): error ' + error.status + '.');
                        });
                    }
                }
            }
        };
    }
})();