(function () {
    'use strict';

    angular
        .module('malv')
        .directive('animeList', animeList);

    function animeList() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'app/components/anime-list/anime-list.html',
            controller: 'AnimelistCtrl'
        };
    }
})();