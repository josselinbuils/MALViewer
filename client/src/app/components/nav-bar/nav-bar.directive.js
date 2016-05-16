(function () {
    'use strict';

    angular
        .module('malv')
        .directive('navBar', navBar);

    function navBar() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/components/nav-bar/nav-bar.html',
            controller: 'NavBarCtrl'
        };
    }
})();