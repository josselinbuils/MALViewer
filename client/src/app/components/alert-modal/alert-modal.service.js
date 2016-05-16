(function () {
    'use strict';

    angular
        .module('malv')
        .factory('alertModal', alertModal);

    alertModal.$inject = ['$log', '$modal'];

    function alertModal($log, $modal) {

        return {
            show: show
        };

        function show(title, message, showCancelButton) {
            $log.debug('alertModal->show()');

            return $modal.open({
                templateUrl: 'app/components/alert-modal/alert-modal.html',
                controller: 'AlertModalCtrl',
                windowClass: 'alert-modal',
                backdrop: 'static',
                resolve: {
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    },
                    showCancelButton: function () {
                        return showCancelButton;
                    }
                }
            }).result;
        }
    }
})();