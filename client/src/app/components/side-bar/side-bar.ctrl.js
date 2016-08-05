(function () {
    'use strict';

    angular
        .module('malv')
        .controller('SidebarCtrl', SidebarCtrl);

    SidebarCtrl.$inject = ['$log', '$rootScope', '$scope', 'alertModal', 'animeListService', 'animeService', 'localStorageService', 'statusService', 'utils'];

    function SidebarCtrl($log, $rootScope, $scope, alertModal, animeListService, animeService, localStorageService, statusService, utils) {

        $scope.guest = !localStorageService.get('secureKey');

        $scope.lists = animeService.getLists();

        $scope.listCaptions = animeService.getListCaptions();
        $scope.login = localStorageService.get('login');

        $scope.applySearch = function () {
            $log.debug('SidebarCtrl->applySearch()');

            statusService.setInfo(null);
            statusService.setLoadStatus('Searching...');
            statusService.setProgression(0);

            $rootScope.disableScrolling = false;

            if (!$rootScope.toggled) {
                $rootScope.toggled = true;
            }

            var timeCounter = new utils.TimeCounter();

            animeService.search($scope.search).then(function (animes) {
                $log.debug('SidebarCtrl->viewList: search done in ' + timeCounter.getTime() + 'ms');

                statusService.setProgression(100);

                if (animes.length > 0) {
                    animeListService.setAnimes(animes);
                    animeListService.setSortAttr(null);
                    statusService.setInfo(animes.length + (animes.length > 1 ? ' results' : ' result') + ' for "' + search + '"');
                } else {
                    statusService.setInfo('No result for "' + search + '" :(');
                }

                statusService.setInfo(animes.length + ' animes');

            }, function (error) {
                if (error.status !== -1) {
                    alertModal.show('Error', error.statusText).then(function () {
                        statusService.setLoadStatus(null);
                    });
                }
            });

            $scope.$applyAsync(function () {
                $scope.search = '';

                if (!$rootScope.toggled) {
                    $rootScope.toggled = true;
                }
            });
        };

        $scope.getLoadStatus = function () {
            return statusService.getLoadStatus();
        };

        $scope.logout = function () {
            animeService.logout();
        };

        $scope.viewList = function (list) {
            $log.debug('SidebarCtrl->viewList()');

            $scope.watchingList = list;

            animeListService.setWatchingList(list);

            statusService.setInfo(null);
            statusService.setLoadStatus('Anime list updating...');
            statusService.setProgression(0);

            $rootScope.disableScrolling = false;

            if (!$rootScope.toggled) {
                $rootScope.toggled = true;
            }

            var timeCounter = new utils.TimeCounter();

            animeService.updateAnimeList().then(function () {
                $log.debug('SidebarCtrl->viewList: anime list updated in ' + timeCounter.getTime() + 'ms');

                var animes = animeService.getFilteredAnimeList(list);

                animeListService.setAnimes(animes);
                timeCounter.reset();
                statusService.setLoadStatus('Animes details updating...');

                var ids = animes.map(function (anime) {
                    return anime.id;
                });

                animeService.updateDetails(ids).then(function () {
                    $log.debug('SidebarCtrl->viewList: details updated in ' + timeCounter.getTime() + 'ms');

                    animes.forEach(function (anime) {
                        animeService.merge(anime, animeService.getAnimeDetails(anime.id, true));
                    });

                    statusService.setProgression(100);
                    statusService.setInfo(animes.length + ' animes');

                }, function (error) {
                    if (error.status !== -1) {
                        alertModal.show('Error', error.statusText).then(function () {
                            statusService.setLoadStatus(null);
                        });
                    }
                }, function (progress) {
                    statusService.setProgression(progress);
                });
            });
        };

        $scope.viewTopList = function (list) {
            $log.debug('SidebarCtrl->viewTopList()');

            $scope.watchingList = list;

            animeListService.setWatchingList(list);
            animeListService.setAnimes([]);

            statusService.setInfo(null);
            statusService.setLoadStatus($scope.listCaptions[list] + ' list loading...');
            statusService.setProgression(0);

            $rootScope.disableScrolling = false;

            if (!$rootScope.toggled) {
                $rootScope.toggled = true;
            }

            var timeCounter = new utils.TimeCounter();

            animeService.getTopList(list).then(function (animes) {

                animeListService.setAnimes(animes);
                animeListService.setSortAttr(null);

                statusService.setProgression(100);

                $log.debug('SidebarCtrl->viewTopList: ' + $scope.listCaptions[list].toLowerCase() + ' displayed in ' + timeCounter.getTime() + 'ms');

            }, function (error) {
                if (error.status !== -1) {
                    alertModal.show('Error', error.statusText).then(function () {
                        statusService.setLoadStatus(null);
                    });
                }
            });
        };

        $scope.viewList($scope.lists.user[0]);
    }
})();
