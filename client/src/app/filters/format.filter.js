(function () {
    'use strict';

    angular
        .module('malv')
        .filter('format', format);

    function format() {
        return function (val) {
            return val ? val : '-';
        };
    }
})();