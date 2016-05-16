(function () {
    'use strict';

    angular
        .module('malv')
        .controller('StatusBarCtrl', StatusBarCtrl);

    StatusBarCtrl.$inject = ['$scope', 'animeListService', 'statusService'];

    function StatusBarCtrl($scope, animeListService, statusService) {

        $scope.orderCaptions = {
            asc: 'Asc',
            desc: 'Desc'
        };

        $scope.sortCaptions = {
            endDate: 'End date',
            membersScore: 'Members score',
            myScore: 'My score',
            popularity: 'Popularity',
            rank: 'Rank',
            startDate: 'Start date',
            title: 'Title',
            type: 'Type'
        };

        $scope.getLoadProgression = function () {
            return statusService.getProgression();
        };

        $scope.getLoadStatus = function () {
            return statusService.getLoadStatus();
        };

        $scope.getOrderCaption = function () {
            return $scope.orderCaptions[animeListService.getOrder()];
        };

        $scope.getSortAttr = function () {
            return animeListService.getSortAttr();
        };

        $scope.getSortCaption = function () {
            return $scope.sortCaptions[animeListService.getSortAttr()];
        };

        $scope.getInfo = function () {
            return statusService.getInfo();
        };

        $scope.setOrder = function (order) {
            animeListService.setOrder(order);
        };

        $scope.sortBy = function (sort) {
            animeListService.setSortAttr(sort);
        };
    }
})();