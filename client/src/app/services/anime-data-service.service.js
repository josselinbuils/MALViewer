(function () {
    'use strict';

    angular
        .module('malv')
        .factory('animeDataService', animeDataService);

    animeDataService.$inject = ['$http', '$log', '$q', 'alertModal', 'config'];

    function animeDataService($http, $log, $q, alertModal, config) {

        var xhrCancelers = [];

        return {
            abortAll: abortAll,
            addAnime: addAnime,
            deleteAnime: deleteAnime,
            getAnimeDetails: getAnimeDetails,
            getAnimeList: getAnimeList,
            getTopList: getTopList,
            updateAnime: updateAnime
        };

        function abortAll() {
            $log.debug('animeDataService->abortAll()');

            xhrCancelers.forEach(function (canceler) {
                canceler.resolve();
            });

            xhrCancelers = [];
        }

        function addAnime(user, id, secureKey, animeInfo) {
            $log.debug('animeDataService->addAnime()');
            return apiRequest('PUT', config.apiUrl + '/addanime/' + user + '/' + id + '/' + secureKey, animeInfo);
        }

        function apiRequest(method, url, data) {
            var canceler = $q.defer();

            xhrCancelers.push(canceler);

            var reqConfig = {
                method: method,
                url: url,
                timeout: canceler.promise
            };

            if (method === 'PATCH' || method === 'PUT') {
                reqConfig.data = data;
                reqConfig.headers = {
                    'Content-Type': 'application/json'
                };
            }

            return $http(reqConfig).then(function (res) {
                var index = xhrCancelers.indexOf(canceler);

                if (index !== -1) {
                    xhrCancelers.splice(index, 1);
                }

                return res.data;

            }, function (error) {

                if (error.status !== -1) { // Aborted
                    var status = 'Error ' + error.status,
                        statusText = error.statusText;

                    if (status === 0) {
                        status = 'Error';
                        statusText = 'The server may be unavailable, please try again later.';
                    } else if (error.data) {
                        statusText = error.data.error;
                    }

                    alertModal.show(status, statusText, false);
                }

                return $q.reject(error);
            });
        }

        function deleteAnime(user, id, secureKey) {
            $log.debug('animeDataService->deleteAnime()');
            return apiRequest('DELETE', config.apiUrl + '/deleteanime/' + user + '/' + id + '/' + secureKey);
        }

        function getAnimeDetails(id) {
            $log.debug('animeDataService->getAnimeDetails()');
            return apiRequest('GET', config.apiUrl + '/anime/' + id);
        }

        function getAnimeList(user) {
            $log.debug('animeDataService->getAnimeList()');
            return apiRequest('GET', config.apiUrl + '/animelist/' + user);
        }

        function getTopList(list, page) {
            $log.debug('animeDataService->getTopList()');

            switch (list) {

                case 'topPopularity':
                    list = 'bypopularity';
                    break;

                case 'topAiring':
                    list = 'airing';
                    break;

                case 'topAll':
                    list = 'all';
                    break;

                case 'topMovie':
                    list = 'movie';
                    break;

                case 'topOVA':
                    list = 'ova';
                    break;

                case 'topSpecial':
                    list = 'special';
                    break;

                case 'topTV':
                    list = 'tv';
                    break;

                case 'topUpcoming':
                    list = 'upcoming';
                    break;
            }

            return apiRequest('GET', config.apiUrl + '/toplist/' + list + '/' + page);
        }

        function updateAnime(user, id, secureKey, animeInfo) {
            $log.debug('animeDataService->updateAnime()');
            return apiRequest('PATCH', config.apiUrl + '/updateanime/' + user + '/' + id + '/' + secureKey, animeInfo);
        }
    }
})();