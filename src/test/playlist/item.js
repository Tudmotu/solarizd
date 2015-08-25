import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery';
import $ from 'jquery';
import {module, inject} from '../mocks';

describe('playlistItem directive', function () {
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
    beforeEach(inject((
            _$compile_, _$rootScope_,_$httpBackend_, _playList_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        playList = _playList_;

        $httpBackend.when('GET', 'apikeys.json').respond({});
    }));

    describe('markup', () => {
        it('contains item duration in formatted form', () => {
            let html = '<div><playlist-item ' +
                       'title="test bla"' +
                       'duration="PT3M21S"' +
                       '></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.time > .duration')).toHaveText('3:21');
        });

        it('contains item title inside the .title element', () => {
            let html = '<div><playlist-item title="test bla"></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.title')).toHaveText("test bla");
        });

        it('contains a single .title element', () => {
            let html = '<div><playlist-item></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root).toContainElement('.title');
            expect(root.find('.title')).toHaveLength(1);
        });

        it('contains a .playlist-item element', () => {
            let html = '<div><playlist-item></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root).toContainElement('.playlist-item');
        });
    });
});
