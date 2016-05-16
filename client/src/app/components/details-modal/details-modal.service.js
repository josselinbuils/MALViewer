(function () {
    'use strict';

    angular
        .module('malv')
        .factory('detailsModal', detailsModal);

    detailsModal.$inject = ['$log', '$modal'];

    function detailsModal($log, $modal) {

        return {
            open: open
        };

        function open(anime) {
            $log.debug('detailsModal->open()');

            $modal.open({
                templateUrl: 'app/components/details-modal/details-modal.html',
                controller: 'DetailsModalCtrl',
                windowClass: 'details-modal',
                resolve: {
                    anime: function () {
                        return anime;
                    }
                }
            });
        }
    }
})();