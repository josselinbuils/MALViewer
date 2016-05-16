(function () {
    'use strict';

    angular
        .module('malv')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$log', '$rootScope', '$scope', '$window'];

    function MainCtrl($log, $rootScope, $scope, $window) {

        $rootScope.toggled = true;
        $rootScope.mobile = $window.innerWidth < 768;

        $scope.hideSidebar = function () {
            if ($rootScope.mobile && !$rootScope.toggled) {
                $log.debug('MainCtrl->hideSidebar()');

                $rootScope.$applyAsync(function () {
                    $rootScope.toggled = true;
                    $rootScope.disableScrolling = false;
                });
            }
        };

        $scope.showSidebar = function () {
            if ($rootScope.mobile && $rootScope.toggled) {
                $log.debug('MainCtrl->showSidebar()');

                $rootScope.$applyAsync(function () {
                    $rootScope.toggled = false;
                    $rootScope.disableScrolling = true;
                });
            }
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.$watch(function () {
                return $window.innerWidth;
            }, function (width) {
                $rootScope.mobile = width < 768;
            });
        });

    }
})();