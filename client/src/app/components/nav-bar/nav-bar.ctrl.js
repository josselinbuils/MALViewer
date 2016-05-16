(function () {
    'use strict';

    angular
        .module('malv')
        .controller('NavBarCtrl', NavBarCtrl);

    NavBarCtrl.$inject = ['$log', '$rootScope', '$scope', '$timeout'];

    function NavBarCtrl($log, $rootScope, $scope, $timeout) {

        $scope.showSidebar = function () {
            $log.debug('NavBarCtrl->showSidebar()');

            $timeout(function () {
                $rootScope.toggled = false;
                $rootScope.disableScrolling = true;
            });
        };

    }
})();