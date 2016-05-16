(function () {
    'use strict';

    angular
        .module('malv')
        .factory('editModal', editModal);

    editModal.$inject = ['$log', '$modal'];

    function editModal($log, $modal) {

        return {
            open: open
        };

        function open(anime) {
            $log.debug('editModal->open()');

            $modal.open({
                templateUrl: 'app/components/edit-modal/edit-modal.html',
                controller: 'EditModalCtrl',
                windowClass: 'edit-modal',
                resolve: {
                    anime: function () {
                        return anime;
                    }
                }
            });
        }
    }
})();