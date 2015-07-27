angular.module('ngResource', [])
    .config([ResourceConfiguration])
    .run([ResourceRun])
    .factory('$resource', ['$http', ResourceFactory]);
