import 'angular';

export default angular.module('api-key', [])
.constant('ApiKeysConf', {
    services: ['youtube', 'soundcloud', 'echonest', 'firebase']
}).service('ApiKey', ['$rootScope', '$http', 'ApiKeysConf', function($rootScope, $http, Conf) {
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

    this.fetchKeys = function() {
        var that = this;
        return $http.get('apikeys.json').then(function(resp) {
            var data = resp.data;
            Object.keys(data).forEach(function(service) {
                var key = data[service];
                that.set(service, key);
                $rootScope.$emit(service + '-apikey', key);
            });
        });
    };
}]);
