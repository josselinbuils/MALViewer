(function () {
    'use strict';

    angular.module('malv')
        .directive('focus', focus);

    focus.$inject = ['$timeout'];

    function focus($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, elem) {
                $timeout(function () {
                    elem[0].focus();
                }, 300);
            }
        };
    }
})();