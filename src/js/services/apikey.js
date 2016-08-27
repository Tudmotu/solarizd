import 'angular';

export default angular.module('api-key', [])
.constant('ApiKeysConf', {
    services: [
        'youtube',
        'soundcloud',
        'echonest',
        'firebase',
        'peerjs',
        'lastfm'
    ]
}).service('ApiKey', ['$rootScope', '$q', '$http', 'ApiKeysConf', function($rootScope, $q, $http, Conf) {
    var KEYS = {};

    this.set = function(service, key) {
        if (Conf.services.indexOf(service) >= 0) {
            KEYS[service] = key;
        }
    };

    this.get = function(service) {
        if (Conf.services.indexOf(service) >= 0) {
            return KEYS[service];
        }
    };

    this.fetch = service => {
        if (KEYS.hasOwnProperty(service))
            return $q(resolve => resolve(KEYS[service]));
        else
            return $q((resolve, reject) => {
                this.request.then(function (data) {
                    var key = data[service];
                    if (key) resolve(key);
                    else throw new ReferenceError(
                        `No API key for a service named ${service}`);
                });
            });
    };

    this.fetchKeys = function() {
        var that = this;
        this.request = $http.get('apikeys.json').then(function(resp) {
            var data = resp.data;
            Object.keys(data).forEach(function(service) {
                var key = data[service];
                that.set(service, key);
                $rootScope.$emit(service + '-apikey', key);
            });

            return data;
        });

        return this.request;
    };
}]);
