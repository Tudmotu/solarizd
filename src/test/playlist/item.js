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
    }));

    describe('elapsed time', () => {
        it('"progress" part of .time updates when scope changes', () => {
            let html = '<div><playlist-item ' +
                           'title="test bla"' +
                           'duration="PT3M21S"' +
                           'progress="{{progress}}"' +
                       '></playlist-item></div>';
            $rootScope.progress = 0;
            let root = createRoot(html, $rootScope);

            expect(root.find('.time')).toHaveText(/^\s*3:21\s*$/);

            $rootScope.progress = 60;
            $rootScope.$apply();

            expect(root.find('.time')).toHaveText(/^\s*1:00\s*\/\s*3:21\s*$/);
            expect(root.find('.playlist-item').isolateScope().progress).toBe('60');
            expect(root.find('.playlist-item').isolateScope().getNowPlaying()).toBe(true);
        });

        it('does not display "progress" part of .time when progress is 0', () => {
            let html = '<div><playlist-item ' +
                           'title="test bla"' +
                           'duration="PT3M21S"' +
                           'progress="0"' +
                       '></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.time')).toHaveText(/^\s*3:21$/);
        });

        it('does not display "progress" part of .time when no progress is given', () => {
            let html = '<div><playlist-item ' +
                           'title="test bla"' +
                           'duration="PT3M21S"' +
                       '></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.time')).toHaveText(/^\s*3:21$/);
        });

        it('contains current song progress', () => {
            let html = '<div><playlist-item ' +
                           'title="test bla"' +
                           'duration="PT3M21S"' +
                           'progress="28"' +
                       '></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.time > .elapsed')).toHaveText('00:28');
            expect(root.find('.time')).toHaveText(/^00:28\s*\/\s*3:21$/);
            expect(root.find('.time')).toContainElement('.separator');
        });

        it('contains item duration in formatted form', () => {
            let html = '<div><playlist-item ' +
                           'title="test bla"' +
                           'duration="PT3M21S"' +
                       '></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.time > .duration')).toHaveText('3:21');
        });
    });

    describe('general markup', () => {
        it('contains .bar element as a direct child of .playlist-item', () => {
            let html = '<div><playlist-item title="test bla"></playlist-item></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist-item > .bar')).toHaveLength(1);
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
