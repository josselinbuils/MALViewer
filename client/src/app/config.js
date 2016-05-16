(function () {
    'use strict';

    angular
        .module('malv')
        .constant('config', {
            apiUrl: 'https://www.malviewer.net/api',
            imageRatio: 1.41, // imageHeight = imageRatio * imageWidth
            minNbAnimesByRow: 2,
            maxNbAnimesByRow: 20,
            preferredImageWidth: 185 // px
        });
})();