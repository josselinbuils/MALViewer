(function () {
    'use strict';

    angular
        .module('malv')
        .directive('rightClick', rightClick);

    function rightClick() {
        return {
            restrict: 'A',
            link: function ($scope, elem, attrs) {
                elem.bind('contextmenu', function () {
                    $scope.$eval(attrs.rightClick);
                });
            }
        };
    }
})();