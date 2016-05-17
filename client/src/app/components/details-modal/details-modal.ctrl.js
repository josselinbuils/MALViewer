(function () {
    'use strict';

    angular
        .module('malv')
        .controller('DetailsModalCtrl', DetailsModalCtrl);

    DetailsModalCtrl.$inject = ['$location', '$log', '$modalInstance', '$scope', '$window', 'alertModal', 'anime', 'animeListService', 'animeService', 'constants', 'editModal', 'statusService'];

    function DetailsModalCtrl($location, $log, $modalInstance, $scope, $window, alertModal, anime, animeListService, animeService, constants, editModal, statusService) {

        $scope.anime = anime; // Active anime info
        $scope.lists = animeService.getUserLists();
        $scope.listCaptions = animeService.getListCaptions();
        $scope.sites = [];

        $scope.addAnime = function (list) {
            $log.debug('DetailsModalCtrl->addAnime()');

            statusService.setLoadStatus('Anime adding...');
            statusService.setProgression(0);

            animeService.addAnime($scope.anime, list).then(function () {
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

        $scope.close = function () {
            $log.debug('DetailsModalCtrl->close()');
            $modalInstance.dismiss();
        };

        $scope.deleteAnime = function () {
            $log.debug('DetailsModalCtrl->deleteAnime()');

            alertModal.show(constants.DELETE_ALERT_TITLE, constants.DELETE_ALERT_MESSAGE, true).then(function () {

                statusService.setLoadStatus('Anime deleting...');
                statusService.setProgression(0);
                $scope.close();

                animeService.deleteAnime($scope.anime).then(function () {
                    animeListService.updateWatchingList();
                    statusService.setProgression(100);
                }, function (error) {
                    if (error.status !== -1) {
                        alertModal.show('Error', error.statusText).then(function () {
                            statusService.setLoadStatus(null);
                        });
                    }
                });
            });
        };

        $scope.editAnime = function () {
            $log.debug('DetailsModalCtrl->editAnime()');
            $scope.close();
            editModal.open($scope.anime);
        };

        $scope.getImageUrl = function (anime) {
            return 'https://' + $location.host() + '/get/' + encodeURIComponent(anime.imageUrl);
        };

        $scope.isAnimeAddable = function () {
            return !animeService.guess && !$scope.anime.myStatus;
        };

        $scope.isAnimeEditable = function () {
            return !animeService.guess && $scope.anime.myStatus;
        };

        // Initialization
        $scope.$applyAsync(function () {
            animeService.sites.forEach(function (site) {
                $scope.sites.push({
                    name: site.name,
                    url: parseUrlWithAnimeInfo(site.url, anime)
                });
            });
        });

        function parseUrlWithAnimeInfo(url, anime) {
            $log.debug('DetailsModalCtrl->parseUrlWithAnimeInfo()');

            var parsedUrl;

            if (anime) {
                url = url.replace(/\[id\]/g, anime.id);
                url = url.replace(/\[nextEpisode\]/g, (anime.myWatchedEpisodes < 10 ? '0' : '') + (anime.myWatchedEpisodes + 1));
                url = url.replace(/\[title\]/g, anime.title);
                parsedUrl = $window.encodeURI(url);
            }

            return parsedUrl;
        }

    }
})();