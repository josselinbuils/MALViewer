(function () {
    'use strict';

    angular
        .module('malv')
        .factory('statusService', statusService);

    statusService.$inject = ['$log', '$timeout'];

    function statusService($log, $timeout) {

        var info, loadStatus, progression;

        return {
            getInfo: getInfo,
            getLoadStatus: getLoadStatus,
            getProgression: getProgression,
            setInfo: setInfo,
            setLoadStatus: setLoadStatus,
            setProgression: setProgression
        };

        function getInfo() {
            return info;
        }

        function getLoadStatus() {
            return loadStatus;
        }

        function getProgression() {
            return progression;
        }

        function setInfo(newInfo) {
            $log.debug('statusService->setInfo()');
            info = newInfo;
        }

        function setLoadStatus(newStatus) {
            $log.debug('statusService->setLoadStatus()');
            loadStatus = newStatus;
        }

        function setProgression(val, max) {
            $log.debug('statusService->setProgression()');

            // Max is 100 by default
            if (!max) {
                progression = val;
            } else {
                progression = Math.floor(val / max * 100);
            }

            if ((!max && val === 100) || (max && val === max)) {
                $timeout(function () {
                    setLoadStatus(null);
                }, 100);
            }
        }
    }
})();