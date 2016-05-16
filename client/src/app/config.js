(function () {
    'use strict';

    angular
        .module('malv')
        .constant('config', {
            apiUrl: 'http://vps269412.ovh.net:8080',
            imageRatio: 1.41, // imageHeight = imageRatio * imageWidth
            minNbAnimesByRow: 2,
            maxNbAnimesByRow: 20,
            preferredImageWidth: 185 // px
        });
})();