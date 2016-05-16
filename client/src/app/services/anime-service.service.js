(function () {
    'use strict';

    angular
        .module('malv')
        .factory('animeService', animeService);

    animeService.$inject = ['$log', '$q', '$state', 'animeDataService', 'localStorageService'];

    function animeService($log, $q, $state, animeDataService, localStorageService) {

        var lists = {
            user: ['watching', 'completed', 'onHold', 'dropped', 'planToWatch'],
            top: ['topAll', 'topAiring', 'topUpcoming', 'topTV', 'topMovie', 'topOVA', 'topSpecial', 'topPopularity']
        };

        var listCaptions = {
            watching: 'Watching',
            completed: 'Completed',
            onHold: 'On-hold',
            dropped: 'Dropped',
            planToWatch: 'Plan to watch',
            topAll: 'Top anime',
            topAiring: 'Top airing',
            topUpcoming: 'Top upcoming',
            topTV: 'Top TV',
            topMovie: 'Top movies',
            topOVA: 'Top OVA',
            topSpecial: 'Top specials',
            topPopularity: 'Most popular'
        };

        var sites = [{
            name: 'Adala News',
            url: 'http://adala-news.fr/?s=[title]'
        }, {
            name: 'Anime-Kun',
            url: 'http://www.anime-kun.net/animes/animedb-.html?moteur=1&search=[title]'
        }, {
            name: 'Google',
            url: 'https://www.google.com/search?safe=off&q=[title]'
        }, {
            name: 'Google Videos',
            url: 'https://www.google.com/search?safe=off&tbm=vid&q=[title] [nextEpisode] vostfr'
        }, {
            name: 'MyAnimeList',
            url: 'http://www.myanimelist.net/anime/[id]'
        }, {
            name: 'T411',
            url: 'http://www.t411.ch/torrents/search/?search=[title]'
        }, {
            name: 'Youtube',
            url: 'https://www.youtube.com/results?q=[title]'
        }, {
            name: 'Wikipedia',
            url: 'http://fr.wikipedia.org/w/index.php?search=[title]'
        }];

        var login = localStorageService.get('login');
        var secureKey = localStorageService.get('secureKey');
        var guess = !secureKey;
        var animeList = !guess && localStorageService.get(login + ':animeList') ? localStorageService.get(login + ':animeList') : [];
        var details = localStorageService.get('details') || {};

        return {
            addAnime: addAnime,
            applySearch: applySearch,
            deleteAnime: deleteAnime,
            editAnime: editAnime,
            getAnimeDetails: getAnimeDetails,
            getFilteredAnimeList: getFilteredAnimeList,
            getListCaptions: getListCaptions,
            getLists: getLists,
            getTopList: getTopList,
            getUserLists: getUserLists,
            logout: logout,
            merge: merge,
            sites: sites,
            updateAnimeList: updateAnimeList,
            updateDetails: updateDetails,
            updateWatchedData: updateWatchedData
        };

        function addAnime(anime, myStatus) {
            $log.debug('animeService->addAnime()');

            animeDataService.abortAll();

            return animeDataService.addAnime(login, anime.id, secureKey, {
                myStatus: myStatus
            }).then(function () {

                anime.myStatus = myStatus;
                animeList.push(anime);
                localStorageService.set(login + ':animeList', animeList);

            }, function (error) {
                return $q.reject(error);
            });
        }

        function applySearch(search, search_type, search_score, search_status, search_rated, search_startMonth, search_startYear, search_endMonth, search_endYear) {
            $log.debug('animeService->applySearch()');

            // if (search.length >= 2) {
            //
            //     animeDataService.abortAll();
            //
            //     $rootScope.$applyAsync(function () {
            //         //setLoadStatus('Searching...');
            //         //setLoadProgression(0);
            //     });
            //
            //     $.ajax({
            //         url: 'api.php?type=search&q=' + encodeURIComponent(search) + '&stype=' + search_type + '&score=' + search_score + '&status=' + search_status + '&r=' + search_rated + '&sm=' + search_startMonth + '&sy=' + search_startYear + '&em=' + search_endMonth + '&ey=' + search_endYear + '&login=' + login + '&secureKey=' + secureKey,
            //         dataType: 'json'
            //
            //     }).done(function (data) {
            //
            //         if (jQuery.isEmptyObject(data)) {
            //             //setListInfo('No result for "' + search + '" :(');
            //             //sortBy(null);
            //             //setLoadProgression(100);
            //         } else {
            //             var nbAnimesToLoad = 0,
            //                 animes;
            //
            //             if (data.anime[1]) { // Avoid error when there is only one anime on the list
            //                 animes = data.anime;
            //             } else {
            //                 animes = data;
            //             }
            //
            //             // TODO update that to the new version
            //             updateWatchedData(animes).then(function () {
            //                 self.search = [];
            //
            //                 animes.forEach(function (anime) {
            //                     nbAnimesToLoad++;
            //                     self.search.push(anime);
            //                 });
            //
            //                 //self.animes = _.clone(self.search);
            //                 //setListInfo(self.animes.length + (self.animes.length > 1 ? ' results' : ' result') + ' for "' + search + '"');
            //                 //sortBy('title');
            //                 updateDetails('search', animes, nbAnimesToLoad);
            //             });
            //         }
            //     });
            // }
        }

        function deleteAnime(anime) {
            $log.debug('animeService->deleteAnime()');

            animeDataService.abortAll();

            return animeDataService.deleteAnime(login, anime.id, secureKey).then(function () {

                animeList.splice(indexOfAnime(animeList, anime.id), 1);
                localStorageService.set(login + ':animeList', animeList);

            }, function (error) {
                return $q.reject(error.statusText);
            });
        }

        function editAnime(anime, myWatchedEpisodes, myScore, myStatus) {
            $log.debug('animeService->editAnime()');

            if (myWatchedEpisodes < 0) {
                return $q.reject(new Error('The number of watched episodes must be positive!'));
            }

            if (anime.episodes > 0 && myWatchedEpisodes > anime.episodes) {
                return $q.reject(new Error('There ' + ((anime.episodes > 1) ? 'are' : 'is') + ' only ' + anime.episodes + ' episode' + ((anime.episodes > 1) ? 's' : '') + '!'));
            }

            if (!myWatchedEpisodes) {
                myWatchedEpisodes = 0;
            }

            if (!myStatus) {
                myStatus = anime.myStatus;
            }

            var myStartDate, myFinishDate;

            if (myStatus === 'watching') {
                if (myWatchedEpisodes === 1) {
                    myStartDate = new Date().getTime();
                }
                if (myWatchedEpisodes === anime.episodes) {
                    myStatus = 'completed';
                    myFinishDate = new Date().getTime();
                }
            }

            animeDataService.abortAll();

            return animeDataService.updateAnime(login, anime.id, secureKey, {
                myFinishDate: myFinishDate,
                myScore: myScore,
                myStartDate: myStartDate,
                myStatus: myStatus,
                myWatchedEpisodes: myWatchedEpisodes
            }).then(function () {

                anime.myStatus = myStatus;
                anime.myWatchedEpisodes = myWatchedEpisodes;

                if (myScore !== undefined) {
                    anime.myScore = myScore;
                }

                animeList[indexOfAnime(animeList, anime.id)] = anime;
                localStorageService.set(login + ':animeList', animeList);

            }, function (error) {
                return $q.reject(error);
            });
        }

        function getAnimeDetails(id, disableUpdate) {
            if (!disableUpdate) {
                return updateDetails([id]).then(function () {
                    return angular.copy(details[id]);
                }, function (error) {
                    return $q.reject(error);
                });
            } else {
                return angular.copy(details[id]);
            }
        }

        function getFilteredAnimeList(myStatus) {

            if (!animeList || !myStatus) {
                return null;
            }

            return animeList.filter(function (anime) {
                return anime.myStatus === myStatus;
            });
        }

        function getListCaptions() {
            return angular.copy(listCaptions);
        }

        function getLists() {
            return angular.copy(lists);
        }

        function getTopList(list, page) {
            $log.debug('animeService->getTopList()');

            animeDataService.abortAll();

            if (!page) {
                page = 1;
            }

            var promises = [animeDataService.getTopList(list, page), updateAnimeList()];

            return $q.all(promises).then(function (data) {
                var topList = data[0];
                updateWatchedData(topList);
                return topList;

            }, function (error) {
                return $q.reject(error);
            });
        }

        function getUserLists() {
            return angular.copy(lists.user);
        }

        function indexOfAnime(list, id) {
            $log.debug('animeService->indexOfAnime()');
            return _.findIndex(list, {
                id: id
            });
        }

        function logout() {
            $log.debug('animeService->logout()');

            login = null;
            secureKey = null;

            localStorageService.remove('login');
            localStorageService.remove('secureKey');

            $state.go('login');
        }

        function merge(data1, data2) {
            $log.debug('animeService->merge()');

            for (var key in data2) {
                if (data2.hasOwnProperty(key) && !data1.hasOwnProperty(key)) {
                    data1[key] = data2[key];
                }
            }
        }

        function updateAnimeList() {
            $log.debug('animeService->updateAnimeList()');

            return animeDataService.getAnimeList(login).then(function (animes) {
                animeList = animes;
                localStorageService.set(login + ':animeList', animes);
            }, function (error) {
                return $q.reject(error);
            });
        }

        function updateDetails(animeIdList) {
            $log.debug('animeService->updateDetails()');

            var deferred = $q.defer();

            if (Array.isArray(animeIdList) && animeIdList.length > 0) {
                var promises = [];

                var loadCount = 0;

                // Check if the details have to be updated
                animeIdList.forEach(function (id) {
                    var loadDetails = false;

                    if (!details[id]) {
                        loadDetails = true;
                    } else {
                        var time = new Date().getTime();
                        var daysSinceLastUpdate = (time - details[id].lastUpdate) / 1000 / 60 / 60 / 24;

                        if (details[id].status === 'Currently Airing') {
                            var daysSinceStart = (time - details[id].startDate) / 1000 / 60 / 60 / 24;

                            if (daysSinceStart < 30) {
                                loadDetails = daysSinceLastUpdate >= 3;
                            } else if (daysSinceStart < 60) {
                                loadDetails = daysSinceLastUpdate >= 7;
                            } else {
                                loadDetails = daysSinceLastUpdate >= 30;
                            }

                        } else if (details[id].status === 'Finished Airing') {
                            loadDetails = daysSinceLastUpdate >= 90;
                        }
                    }

                    if (loadDetails) {
                        promises.push(animeDataService.getAnimeDetails(id).then(function (animeDetails) {

                            loadCount++;
                            deferred.notify(Math.floor(loadCount / promises.length * 100));

                            animeDetails.lastUpdate = new Date().getTime();
                            details[id] = animeDetails;
                            localStorageService.set('details', details);

                        }, function (error) {
                            return $q.reject(error);
                        }));
                    }
                });

                if (promises.length === 0) {
                    return $q.resolve();
                }

                $q.all(promises).then(function () {
                    deferred.resolve();
                });

            } else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        function updateWatchedData(animesToUpdate) {
            $log.debug('animeService->updateWatchedData()');

            if (animeList.length === 0) {
                return;
            }

            animesToUpdate.forEach(function (animeToUpdate) {
                var anime = animeList.filter(function (anime) {
                    return anime.id === animeToUpdate.id;
                });

                if (anime.length > 0) {
                    animeToUpdate.myScore = anime[0].myScore;
                    animeToUpdate.myWatchedEpisodes = anime[0].myWatchedEpisodes;
                    animeToUpdate.myStatus = anime[0].myStatus;
                } else if (animeToUpdate.myStatus) {
                    animeToUpdate.myScore = null;
                    animeToUpdate.myWatchedEpisodes = null;
                    animeToUpdate.myStatus = null;
                }
            });
        }
    }
})();
