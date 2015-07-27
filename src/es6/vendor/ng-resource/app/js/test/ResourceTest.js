describe('resource', function () {
    var httpBackend;
    var resource_factory = null;
    var resource = null;
    var success_status = 200;
    var error_status = 500;

    beforeEach(inject(function ($httpBackend, $http) {
        httpBackend = $httpBackend;
        resource_factory = new ResourceFactory($http);
        resource = resource_factory('api/users');
    }));

    it('should be an instance of Resource', function () {
        expect(resource).toBeDefined();
        expect(resource).not.toBeNull();
    });

    it('should be able to get by id', function () {
        var response = {
            status: success_status,
            value: {id: 10}
        };

        httpBackend.expectGET('api/users/' + response.value.id)
            .respond(response.status, angular.toJson(response.value));

        var actual = resource.get(response.value.id);

        httpBackend.flush();

        expect(actual.id).toBe(response.value.id);
    });

    it('should be able to make an object', function () {
        var object = resource.make();

        expect(object.$remote).toBeDefined();
        expect(object.$save).toBeDefined();
        expect(object.$delete).toBeDefined();
        expect(object.$update).toBeDefined();
        expect(object.$reset).toBeDefined();
        expect(object.$inLocal()).toBeFalsy();
    });

    it('should be able to add an object', function () {
        var object = resource.make();

        var response = {
            status: success_status,
            value: {id: 10}
        };

        httpBackend.expectPOST('api/users')
            .respond(response.status, angular.toJson(response.value));

        object.$save();

        httpBackend.flush();

        expect(object.id).toBe(response.value.id);
        expect(object.$inLocal()).toBeTruthy();
    });

    it('should be able to update an object', function () {
        var object = resource.make();

        var response = {
            status: success_status,
            value: {id: 10}
        };

        object.$remote.id = response.value.id;

        httpBackend.expectPOST('api/users/' + response.value.id)
            .respond(response.status, angular.toJson(response.value));

        object.$save();

        httpBackend.flush();

        expect(object.id).toBe(response.value.id);
        expect(object.$inLocal()).toBeTruthy();
    });

    it('should be able to delete an object', function () {
        var object = resource.make();

        var response = {
            status: success_status,
            value: null
        };

        object.$remote.id = 10;

        httpBackend.expectDELETE('api/users/' + object.$remote.id)
            .respond(response.status, angular.toJson(response.value));

        object.$delete();

        httpBackend.flush();
    });

    it('should be able to reset an object', function () {
        var object = resource.make();

        object.$remote.id = 5;

        object.id = 6;

        object.$reset();

        expect(object.id).toBe(object.$remote.id);
    });
});
