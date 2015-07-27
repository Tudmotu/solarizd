function Resource($http, path) {
    var me = this;
    var collection = {};

    this.make = function (values) {
        values = values || {};

        angular.extend(values, {
            $remote: {},
            $update: function () {
                return me.update(this);
            },
            $save: function () {
                return me.save(this);
            },
            $delete: function () {
                return me.remove(this.$remote.id);
            },
            $reset: function () {
                return me.reset(this);
            },
            $inLocal: function () {
                return this.id in collection;
            },
            $inRemote: function () {
                return me.get(this.$remote.id);
            }
        });

        return values;
    };

    this.items = function () {
        return collection;
    };

    /**
     * Fetches an object by id.
     *
     * @param id
     * @returns {*}
     */
    this.get = function (id) {
        if (!(id in collection)) {
            collection[id] = this.make();
            collection[id].$resolved = false;

            $http.get(path + '/' + id).success(function (item) {
                angular.extend(collection[id], item);
                collection[id].$remote = item;

                collection[id].$resolved = true;
            });
        }

        return collection[id];
    };

    /**
     * Fetches an object by specifying key:value pairs.
     *
     * @param values
     * @returns {*}
     */
    this.find = function (values) {
        return this.query(values).shift();
    };

    /**
     * Fetches multiple objects by specifying key:value pairs.
     *
     * @param values
     * @returns {*}[]
     */
    this.query = function (values) {
        var array = [];

        array.$resolved = false;

        $http.get(path, {params: values})
            .success(function (items) {
                items.map(function (item) {
                    if (!(item.id in collection)) {
                        collection[item.id] = me.make();
                    }

                    angular.extend(collection[item.id], item);
                    collection[item.id].$remote = item;

                    array.push(collection[item.id]);
                });

                array.$resolved = true;
            });

        return array;
    };

    /**
     * Sends a delete to the server. If the delete returns successful, then the object will be removed from the
     * collection.
     *
     * @param id
     * @returns {*}
     */
    this.remove = function (id) {
        return $http.delete(path + '/' + id)
            .success(function () {
                if (id in collection) {
                    delete collection[id];
                }
            });
    };

    /**
     * Saves an object. If the object's remote has a positive id, then it will be updated, otherwise created.
     *
     * @param object
     * @returns {*}
     */
    this.save = function (object) {
        if (object.$remote.id > 0) {
            return object.$update();
        } else {
            return this.add(object);
        }
    };

    this.add = function (values) {
        $http.post(path, {
            data: values
        }).success(function (item) {
            angular.extend(values, item);
            values.$remote = item;
            collection[item.id] = values;
        });

        return values;
    };

    this.update = function (object) {
        return $http.post(path + '/' + object.$remote.id, {
            data: object
        }).success(function (item) {
            angular.extend(object, item);
            object.$remote = item;
        });
    };

    this.reset = function (object) {
        angular.forEach(this, function (object, key) {
            if (key[0] !== '$') {
                delete object[key];
            }
        });

        angular.extend(object, object.$remote);
    };
}