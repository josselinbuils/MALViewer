(function () {
    'use strict';

    angular
        .module('malv')
        .factory('utils', utils);

    function utils() {

        function TimeCounter() {
            this.time = new Date().getTime();
        }

        TimeCounter.prototype.getTime = function () {
            return (new Date().getTime() - this.time);
        };

        TimeCounter.prototype.reset = function () {
            this.time = new Date().getTime();
        };

        return {
            TimeCounter: TimeCounter
        };
    }
})();