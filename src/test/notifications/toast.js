import $ from 'jquery';
import {module, inject} from '../mocks';

describe('toas-notification directive', function () {
    let $compile;
    let $rootScope;
    let $timeout;

    function createRoot (html, scope) {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    }

    beforeEach(module('karma.templates'));
    beforeEach(module('Application'));

    beforeEach(inject((_$compile_, _$rootScope_, _$timeout_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    it('does not automatically disappear if `persist` option was `true`', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify', {
            persist: true
        });

        $timeout.flush(1);
        $timeout.flush(3000);

        expect(rootEl.find('.toast-notification')).toHaveClass('active');
    });

    it('removes .active class when .close is clicked', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');
        $timeout.flush(1);

        expect(rootEl.find('.toast-notification')).toHaveClass('active');

        rootEl.find('.close').click();

        expect(rootEl.find('.toast-notification')).not.toHaveClass('active');
    });

    it('removes .active class even while in $digest cycle', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');
        $timeout.flush(1);

        expect(rootEl.find('.toast-notification')).toHaveClass('active');

        $rootScope.$apply(() => {
            $rootScope.$broadcast('test::close');
        });
        $timeout.flush(1);

        expect(rootEl.find('.toast-notification')).not.toHaveClass('active');
    });

    it('applies .active class even while in $digest cycle', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$apply(() => {
            $rootScope.$broadcast('test::notify');
        });

        $timeout.flush(1);

        expect(rootEl.find('.toast-notification')).toHaveClass('active');
    });

    it('automatically closes 3 seconds after <namespace>::notify triggered', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');
        $timeout.flush(1);

        expect(rootEl.find('.toast-notification')).toHaveClass('active');

        $timeout.flush(3001);

        expect(rootEl.find('.toast-notification')).not.toHaveClass('active');
    });

    it('listens to <namespace>::close event then becomes :not(.active)', () => {
        let html = '<div><toast-notification namespace="test"></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');
        $timeout.flush(1);

        expect(rootEl.find('.toast-notification')).toHaveClass('active');

        $rootScope.$broadcast('test::close');
        $timeout.flush(1);

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
        $timeout.flush(1);

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
        $timeout.flush(1);

        expect(rootEl.find('.text')).toHaveText('bla bla test');
    });

    it('listens to <namespace>::notify event then becomes .active', () => {
        let html = '<div><toast-notification ' +
                            'namespace="test"' +
                        '></toast-notification></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::notify');
        $timeout.flush(1);

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
