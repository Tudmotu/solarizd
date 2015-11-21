import $ from 'jquery';
import {module, inject} from '../mocks';

describe('solarizdApp directive', function () {
    let $compile;
    let $rootScope;
    let $httpBackend;
    let playList;

    function createRoot (html, scope) {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    }

    beforeEach(module('karma.templates'));
    beforeEach(module('Application'));
    beforeEach(inject((_$compile_, _$rootScope_,_$httpBackend_, _playList_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        playList = _playList_;

        $httpBackend.when('GET', 'apikeys.json').respond({});
    }));

    xit('selects tab "1" when playlist contains items', () => {
        playList.playlist.push({});
        let html = '<div><solarizd-app></solarizd-app></div>';
        let root = createRoot(html, $rootScope);
        let scope = root.find('.sol-tabs').isolateScope();

        expect(scope.selected.toString()).toBe('1');
    });

    it('selects tab "0" by default', () => {
        let html = '<div><solarizd-app></solarizd-app></div>';
        let root = createRoot(html, $rootScope);
        let scope = root.find('.sol-tabs').isolateScope();

        expect(scope.selected.toString()).toBe('0');
    });

    it('contains a #main-view.sol-tabs element', () => {
        let html = '<div><solarizd-app></solarizd-app></div>';
        let root = createRoot(html, $rootScope);

        expect(root).toContainElement('#main-view.sol-tabs');
    });

    it('contains a <main id="main-app"/> element', () => {
        let html = '<div><solarizd-app></solarizd-app></div>';
        let root = createRoot(html, $rootScope);

        expect(root).toContainElement('main#main-app');
    });
});
