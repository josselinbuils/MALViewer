(function () {
    'use strict';

    angular
        .module('malv')
        .controller('AlertModalCtrl', AlertModalCtrl);

    AlertModalCtrl.$inject = ['$log', '$modalInstance', '$scope', 'message', 'showCancelButton', 'title'];

    function AlertModalCtrl($log, $modalInstance, $scope, message, showCancelButton, title) {

        $scope.message = message;
        $scope.showCancelButton = showCancelButton;
        $scope.title = title;

        $scope.ok = function () {
            $log.debug('AlertModalCtrl->ok()');
            $modalInstance.close();
        };

        $scope.close = function () {
            $log.debug('AlertModalCtrl->close()');
            $modalInstance.dismiss();
        };
    }
})();