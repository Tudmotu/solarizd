import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery';
import $ from 'jquery';
import {module, inject} from '../mocks';

describe('solarizdApp directive', function () {
    let $compile;
    let $rootScope;

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
    }));

    beforeEach(() => {
        jasmine.clock().install();
    });
    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('automatically closes 3 seconds after <namespace>::notify triggered', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');

        expect(rootEl.find('.toast-notification')).toHaveClass('active');

        jasmine.clock().tick(3001);

        expect(rootEl.find('.toast-notification')).not.toHaveClass('active');
    });

    it('listens to <namespace>::close event then becomes :not(.active)', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');

        expect(rootEl.find('.toast-notification')).toHaveClass('active');

        $rootScope.$broadcast('test::close');

        expect(rootEl.find('.toast-notification')).not.toHaveClass('active');
    });

    it('adds a .thumb element if `thumb` prop exists in <namespace>::notify event data', () => {
        let html = '<div><toast-notification ' +
                            'namespace="test"' +
                        '></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify', {
            thumb: 'http://www.example.com'
        });

        expect(rootEl).toContainElement('.thumb');
        expect(rootEl.find('.thumb'))
            .toHaveAttr('src', 'http://www.example.com');
    });

    it('uses the `text` prop from <namespace>::notify event into .text', () => {
        let html = '<div><toast-notification ' +
                            'namespace="test"' +
                        '></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify', {
            text: 'bla bla test'
        });

        expect(rootEl.find('.text')).toHaveText('bla bla test');
    });

    it('listens to <namespace>::notify event then becomes .active', () => {
        let html = '<div><toast-notification ' +
                            'namespace="test"' +
                        '></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');

        expect(rootEl.find('.toast-notification')).toHaveClass('active');
    });

    it('contains a .close element', () => {
        let html = '<div><toast-notification></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.close');
    });

    it('contains a .text element', () => {
        let html = '<div><toast-notification></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.text');
    });

    it('contains a .toast-notification element', () => {
        let html = '<div><toast-notification></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.toast-notification');
    });
});
