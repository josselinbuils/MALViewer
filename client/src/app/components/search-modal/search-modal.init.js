(function () {
    'use strict';

    angular
        .module('malv')
        .run(initSearchModal);

    initSearchModal.$inject = ['$log', '$modal', '$rootScope'];

    function initSearchModal($log, $modal, $rootScope) {

        $rootScope.openSearchModal = function () {
            $log.debug('$rootScope->openSearchModal()');

            $modal.open({
                templateUrl: 'app/components/search-modal/search-modal.html',
                controller: 'SearchModalCtrl',
                windowClass: 'search-modal'
            });
        };
    }
})();