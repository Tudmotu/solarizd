define([
    'angular'
], function () {
    var baseUrl =  'http://developer.echonest.com/api/v4/:type/:method';

    return ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
        var APIKEY = null;
        $rootScope.$on('echonest-apikey', function (e, key) { APIKEY = key; });

        this.fetch = function (type, method, args) {
            var url = baseUrl
                        .replace(':type', type)
                        .replace(':method', method);
            var rejectedPromise = $q.defer();
            if (!APIKEY) { rejectedPromise.reject(); return rejectedPromise.promise; }

            args.results = 25;
            args.api_key = APIKEY;
            return $http.get(url, { params: args });
        };

        this.fetchSongByCombined = function (combinedTitle) {
            return this.fetch('song', 'search', {
                combined: combinedTitle
            });
        };
    }];
});

