(function () {
    'use strict';

    angular
        .module('malv')
        .factory('animeListService', animeListService);

    animeListService.$inject = ['$log', 'animeService'];

    function animeListService($log, animeService) {

        var animes, order, sortAttr, watchingList;

        var userLists = animeService.getUserLists();

        var orders = {
            endDate: 'desc',
            membersScore: 'desc',
            myScore: 'desc',
            none: null,
            popularity: 'asc',
            rank: 'asc',
            startDate: 'desc',
            title: 'asc',
            type: 'asc'
        };

        return {
            getAnimes: getAnimes,
            getOrder: getOrder,
            getSortAttr: getSortAttr,
            getWatchingList: getWatchingList,
            setAnimes: setAnimes,
            setOrder: setOrder,
            setSortAttr: setSortAttr,
            setWatchingList: setWatchingList,
            updateWatchingList: updateWatchingList
        };

        function getAnimes() {
            return animes;
        }

        function getOrder() {
            return order;
        }

        function getSortAttr() {
            return sortAttr;
        }

        function getWatchingList() {
            return watchingList;
        }

        function setAnimes(newAnimes) {
            $log.debug('animeListService->setAnimes()');
            animes = newAnimes;
        }

        function setOrder(newOrder) {
            $log.debug('animeListService->setOrder()');
            order = newOrder;
        }

        function setSortAttr(newSortAttr) {
            $log.debug('animeListService->setSortAttr()');

            sortAttr = newSortAttr;

            if (sortAttr) {
                setOrder(orders[sortAttr]);
            }
        }

        function setWatchingList(newWatchingList) {
            $log.debug('animeListService->setWatchingList()');

            watchingList = newWatchingList;

            if (userLists.indexOf(newWatchingList) !== -1) {
                animes = animeService.getFilteredAnimeList(watchingList);
                setSortAttr('title');
            } else {
                setSortAttr(null);
            }
        }

        function updateWatchingList() {
            $log.debug('animeListService->updateWatchingList()');

            if (userLists.indexOf(watchingList) !== -1) {
                animes = animeService.getFilteredAnimeList(watchingList);
            } else {
                animeService.updateWatchedData(animes);
            }
        }
    }
})();