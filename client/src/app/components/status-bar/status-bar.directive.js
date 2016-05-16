(function () {
    'use strict';

    angular
        .module('malv')
        .directive('statusBar', statusBar);

    function statusBar() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/components/status-bar/status-bar.html',
            controller: 'StatusBarCtrl'
        };
    }
})();