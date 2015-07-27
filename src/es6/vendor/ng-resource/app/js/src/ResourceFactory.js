function ResourceFactory($http) {
    return function (path) {
        return new Resource($http, path);
    };
}
