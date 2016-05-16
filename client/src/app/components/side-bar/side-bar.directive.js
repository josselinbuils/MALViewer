(function () {
    'use strict';

    angular
        .module('malv')
        .directive('sideBar', sideBar);

    function sideBar() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/components/side-bar/side-bar.html',
            controller: 'SidebarCtrl'
        };
    }
})();