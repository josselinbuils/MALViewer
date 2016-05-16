(function () {
    'use strict';

    angular
        .module('malv')
        .controller('AnimelistCtrl', AnimelistCtrl);

    AnimelistCtrl.$inject = ['$filter', '$log', '$scope', '$timeout', '$window', 'alertModal', 'animeDataService', 'animeListService', 'animeService', 'config', 'constants', 'detailsModal', 'editModal', 'statusService'];

    function AnimelistCtrl($filter, $log, $scope, $timeout, $window, alertModal, animeDataService, animeListService, animeService, config, constants, detailsModal, editModal, statusService) {

        var imagesWidth, imagesHeight;
        var resizeTimeout;

        $scope.deleteAnime = function (anime) {
            $log.debug('AnimelistCtrl->deleteAnime()');

            alertModal.show(constants.DELETE_ALERT_TITLE, constants.DELETE_ALERT_MESSAGE, true).then(function () {

                statusService.setLoadStatus('Anime deleting...');
                statusService.setProgression(0);

                animeService.deleteAnime(anime).then(function () {
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

        $scope.getAnimes = function () {
            return animeListService.getAnimes();
        };

        $scope.getImageStyle = function (anime) {
            return {
                width: imagesWidth + 'px',
                height: imagesHeight + 'px',
                'background-size': imagesWidth + 'px ' + imagesHeight + 'px',
                'background-image': 'url(' + anime.imageUrl + ')'
            };
        };

        $scope.getLBadge = function (anime) {
            var res;

            if ($scope.watchingList.substr(0, 3) === 'top') {
                $scope.watchingList = 'top';
            }

            switch ($scope.watchingList) {

                case 'watching':
                    res = $filter('format')(anime.myWatchedEpisodes) + ' / ' + $filter('format')(anime.episodes);
                    break;

                case 'onHold':
                    res = $filter('format')(anime.myWatchedEpisodes) + ' / ' + $filter('format')(anime.episodes);
                    break;

                case 'dropped':
                    res = $filter('format')(anime.myWatchedEpisodes) + ' / ' + $filter('format')(anime.episodes);
                    break;

                case 'top':
                    res = anime.topRank;
                    break;

                case 'search':
                    res = anime.type;
            }

            return res;
        };

        $scope.getOrder = function () {
            return animeListService.getOrder();
        };

        $scope.getPage = function () {
            return animeService.page;
        };

        $scope.getRBadge = function (anime) {
            var res;

            if ($scope.watchingList.substr(0, 3) === 'top') {
                res = $filter('format')(anime.membersScore);
            } else {
                switch (animeListService.getSortAttr()) {

                    case 'endDate':
                        res = $filter('date')(anime.endDate, 'MMM d, y');
                        break;

                    case 'membersScore':
                        res = $filter('format')(anime.membersScore);
                        break;

                    case 'popularity':
                        res = anime.popularity;
                        break;

                    case 'rank':
                        res = anime.rank;
                        break;

                    case 'startDate':
                        res = $filter('date')(anime.startDate, 'MMM d, y');
                        break;

                    case 'type':
                        res = anime.type;
                        break;

                    default:
                        res = ($scope.watchingList === 'planToWatch' || $scope.watchingList === 'search') ? $filter('format')(anime.membersScore) : $filter('format')(anime.myScore);
                        break;
                }
            }

            return res;
        };

        $scope.getSortAttr = function () {
            return animeListService.getSortAttr();
        };

        $scope.incWatchedEpisodes = function (anime) {
            $log.debug('AnimelistCtrl->incWatchedEpisodes()');

            $scope.$applyAsync(function () {
                statusService.setLoadStatus('Anime updating...');
                statusService.setProgression(0);
            });

            animeService.editAnime(anime, anime.myWatchedEpisodes + 1).then(function () {
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

        $scope.isAnimeAddable = function (anime) {
            return !animeService.guess && !anime.myStatus;
        };

        $scope.isAnimeEditable = function (anime) {
            return !animeService.guess && anime.myStatus;
        };

        $scope.openDetailsModal = function (anime) {
            $log.debug('AnimelistCtrl->openDetailsModal()');

            if (animeService.getUserLists().indexOf(animeListService.getWatchingList()) !== -1) {
                detailsModal.open(anime);

            } else {
                animeDataService.abortAll();

                statusService.setLoadStatus('Anime details loading...');
                statusService.setProgression(0);

                animeService.getAnimeDetails(anime.id).then(function (animeDetails) {

                    animeService.merge(animeDetails, anime);

                    detailsModal.open(animeDetails);
                    statusService.setProgression(100);
                });
            }
        };

        $scope.openEditModal = function (anime) {
            $log.debug('AnimelistCtrl->openEditModal()');
            editModal.open(anime);
        };

        $scope.setActiveAnime = function (anime) {
            $log.debug('AnimelistCtrl->setActiveAnime()');
            $scope.activeAnime = anime;
        };

        $scope.showCheckSign = function (anime) {
            return /top.*|search/.test($scope.watchingList) && /watching|completed|onHold|dropped|planToWatch/.test(anime.myStatus);
        };

        $scope.showIncludeEpisodes = function () {
            return $scope.watchingList === 'watching' && !animeService.guest;
        };

        $scope.showLBadge = function () {
            return !/completed|planToWatch/.test($scope.watchingList);
        };

        $scope.showPagination = function () {
            return /top.*/.test($scope.watchingList) && animeListService.getAnimes().length > 0;
        };

        $scope.viewNextPage = function () {
            $log.debug('AnimelistCtrl->viewNextPage()');
            animeService.viewList($scope.watchingList, animeService.page + 1);
        };

        $scope.viewPrevPage = function () {
            if (animeService.page > 1) {
                $log.debug('AnimelistCtrl->viewPrevPage()');
                animeService.viewList($scope.watchingList, animeService.page - 1);
            }
        };

        $scope.$watch(function () {
            return animeListService.getWatchingList();
        }, function (newWatchingList) {
            if (newWatchingList) {
                $scope.watchingList = newWatchingList;
            }
        });

        $($window).on('resize', function () {
            $log.debug('AnimelistCtrl: window resized');

            if (resizeTimeout) {
                $timeout.cancel(resizeTimeout);
            }

            resizeTimeout = $timeout(function () {
                calculateImageSize();
            }, 100);
        });

        function calculateImageSize() {
            $log.debug('AnimelistCtrl->calculateImageSize()');

            var areaWith = $('anime-list').parent().width() - ($window.navigator.platform.substr(0, 3) === 'Win' && $window.navigator.userAgent.indexOf('Firefox') !== -1 ? 10 : 0);
            var dWidths = [];

            for (var i = config.minNbAnimesByRow; i <= config.maxNbAnimesByRow; i++) {
                var width = Math.floor((areaWith - i * 8 - (i + 1) * ($($window).width() >= 768 ? 20 : 10)) / i);

                dWidths[i] = Math.abs(width - config.preferredImageWidth);

                if (i === config.minNbAnimesByRow || (i > config.minNbAnimesByRow && width > 0 && dWidths[i] < dWidths[i - 1])) {
                    imagesWidth = width;
                }
            }

            imagesHeight = Math.round(imagesWidth * config.imageRatio);
        }

        // Initialization
        calculateImageSize();
    }
})();
