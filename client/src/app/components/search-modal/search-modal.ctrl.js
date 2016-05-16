(function () {
    'use strict';

    angular
        .module('malv')
        .controller('SearchModalCtrl', SearchModalCtrl);

    SearchModalCtrl.$inject = ['$filter', '$log', '$modalInstance', '$scope', 'animeService'];

    function SearchModalCtrl($filter, $log, $modalInstance, $scope, animeService) {

        $scope.months = [{
            label: '-',
            value: 0
        }, {
            label: '01',
            value: 1
        }, {
            label: '02',
            value: 2
        }, {
            label: '03',
            value: 3
        }, {
            label: '04',
            value: 4
        }, {
            label: '05',
            value: 5
        }, {
            label: '06',
            value: 6
        }, {
            label: '07',
            value: 7
        }, {
            label: '08',
            value: 8
        }, {
            label: '09',
            value: 9
        }, {
            label: '10',
            value: 10
        }, {
            label: '11',
            value: 11
        }, {
            label: '12',
            value: 12
        }];

        $scope.ratings = [{
            label: 'Select rating',
            value: 0
        }, {
            label: 'G - All Ages',
            value: 1
        }, {
            label: 'PG - Children',
            value: 2
        }, {
            label: 'PG-13 - Teens 13 or older',
            value: 3
        }, {
            label: 'R - 17+ (violence & profanity)',
            value: 4
        }, {
            label: 'R+ - Mild Nudity',
            value: 5
        }, {
            label: 'Rx - Hentai',
            value: 6
        }];

        $scope.scores = [{
            label: 'Select score',
            value: 0
        }, {
            label: '(10) Masterpiece',
            value: 10
        }, {
            label: '(9) Great',
            value: 9
        }, {
            label: '(8) Very Good',
            value: 8
        }, {
            label: '(7) Good',
            value: 7
        }, {
            label: '(6) Fine',
            value: 6
        }, {
            label: '(5) Average',
            value: 5
        }, {
            label: '(4) Bad',
            value: 4
        }, {
            label: '(3) Very Bad',
            value: 3
        }, {
            label: '(2) Horrible',
            value: 2
        }, {
            label: '(1) Appalling',
            value: 1
        }];

        $scope.status = [{
            label: 'Select status',
            value: 0
        }, {
            label: 'Finished Airing',
            value: 2
        }, {
            label: 'Currently Airing',
            value: 1
        }, {
            label: 'Not yet aired',
            value: 3
        }];

        $scope.types = [{
            label: 'Select type',
            value: 0
        }, {
            label: 'TV',
            value: 1
        }, {
            label: 'OVA',
            value: 2
        }, {
            label: 'Movie',
            value: 3
        }, {
            label: 'Special',
            value: 4
        }, {
            label: 'ONA',
            value: 5
        }, {
            label: 'Music',
            value: 6
        }];

        $scope.years = [{
            label: '-',
            value: 0
        }];

        $scope.search = '';
        $scope.search_type = angular.copy($scope.types[0]);
        $scope.search_score = angular.copy($scope.scores[0]);
        $scope.search_status = angular.copy($scope.status[0]);
        $scope.search_rated = angular.copy($scope.ratings[0]);
        $scope.search_startMonth = angular.copy($scope.months[0]);
        $scope.search_startYear = angular.copy($scope.years[0]);
        $scope.search_endMonth = angular.copy($scope.months[0]);
        $scope.search_endYear = angular.copy($scope.years[0]);

        $scope.applySearch = function () {
            $log.debug('SearchModalCtrl->applySearch()');
            animeService.applySearch($scope.search, $scope.search_type.value, $scope.search_score.value, $scope.search_status.value, $scope.search_rated.value, $scope.search_startMonth.value, $scope.search_startYear.value, $scope.search_endMonth.value, $scope.search_endYear.value);
            $scope.close();
        };

        $scope.close = function () {
            $log.debug('SearchModalCtrl->close()');
            $modalInstance.dismiss();
        };

        $scope.$applyAsync(function () {
            var i, year = $filter('date')(new Date(), 'yyyy');

            for (i = year; i >= 1970; i--) {
                $scope.years.push({
                    label: i,
                    value: i
                });
            }
        });

    }
})();