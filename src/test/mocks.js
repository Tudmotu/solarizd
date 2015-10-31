import Angular from '../vendor/angular/angular';
import AngularMocks from '../vendor/angular-mocks/angular-mocks';

export let module = angular.mock.module;
export let inject = angular.mock.inject;

export function createRootFactory ($compile) {
    return (html, scope) => {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    };
}

const NOOP = () => {};
function mockMethods (data, methods) {
    methods.forEach((method) => {
        data[method] = NOOP;
        spyOn(data, method);
    });

    return data;
}
export let FirebaseMock = {
    mockArray (data) {
        return mockMethods(data, [
            '$remove'
        ]);
    }
};
