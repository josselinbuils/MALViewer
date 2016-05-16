(function () {
    'use strict';

    angular
        .module('malv')
        .controller('EditModalCtrl', EditModalCtrl);

    EditModalCtrl.$inject = ['$log', '$modalInstance', '$scope', 'alertModal', 'anime', 'animeListService', 'animeService', 'statusService'];

    function EditModalCtrl($log, $modalInstance, $scope, alertModal, anime, animeListService, animeService, statusService) {

        $scope.anime = anime; // Active anime info
        $scope.lists = animeService.getUserLists();
        $scope.listCaptions = animeService.getListCaptions();
        $scope.myScore = anime.myScore;
        $scope.myStatus = anime.myStatus;
        $scope.myWatchedEpisodes = anime.myWatchedEpisodes;

        $scope.close = function () {
            $log.debug('EditModalCtrl->close()');
            $modalInstance.dismiss();
        };

        $scope.editAnime = function () {
            $log.debug('EditModalCtrl->editAnime()');

            statusService.setLoadStatus('Anime updating...');
            statusService.setProgression(0);
            $scope.close();

            animeService.editAnime($scope.anime, $scope.myWatchedEpisodes, $scope.myScore, $scope.myStatus).then(function () {
                animeListService.updateWatchingList();
                statusService.setProgression(100);
            }, function (error) {
                if (error.status !== -1) {
                    alertModal.show('Error', error.statusText).then(function () {
                        statusService.setLoadStatus(null);
                    });
                }
            });
        };
    }
})();