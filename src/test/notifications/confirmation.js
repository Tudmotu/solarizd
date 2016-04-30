import $ from 'jquery';
import {module, inject} from '../mocks';

describe('confirmation-dialog directive', function () {
    let $compile;
    let $rootScope;
    let $timeout;

    function createRoot (html, scope) {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    }

    beforeEach(module('karma.templates'));
    beforeEach(module('notifications'));

    beforeEach(inject((_$compile_, _$rootScope_, _$timeout_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    it('listens to <namespace>::confirm event then becomes .active', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::confirm');
        $rootScope.$digest();

        expect(rootEl.find('.confirmation-dialog')).toHaveClass('active');
    });

    it('removes .active class when .dialog-cancel is clicked', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::confirm');
        $rootScope.$digest();

        rootEl.find('.dialog-cancel').click();
        $rootScope.$digest();

        expect(rootEl.find('.confirmation-dialog')).not.toHaveClass('active');
    });

    it('removes .active class when .dialog-confirm is clicked', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::confirm');
        $rootScope.$digest();

        rootEl.find('.dialog-confirm').click();
        $rootScope.$digest();

        expect(rootEl.find('.confirmation-dialog')).not.toHaveClass('active');
    });

    it('invokes the .onCancel method passed to event when .dialog-cancel clicked', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);
        let spy = jasmine.createSpy('cancel');

        $rootScope.$broadcast('test::confirm', {
            text: 'testing text',
            onCancel: spy
        });
        $rootScope.$digest();

        rootEl.find('.dialog-cancel').click();
        $rootScope.$digest();

        expect(spy).toHaveBeenCalled();
    });

    it('invokes the .onConfirm method passed to event when .dialog-confirm clicked', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);
        let spy = jasmine.createSpy('confirm');

        $rootScope.$broadcast('test::confirm', {
            text: 'testing text',
            onConfirm: spy
        });
        $rootScope.$digest();

        rootEl.find('.dialog-confirm').click();
        $rootScope.$digest();

        expect(spy).toHaveBeenCalled();
    });

    it('contains title as passed to event', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::confirm', {
            title: 'testing title'
        });
        $rootScope.$digest();

        expect(rootEl).toContainElement('.dialog-title');
        expect(rootEl.find('.dialog-title')).toHaveText('testing title');
    });

    it('contains text as passed to event', () => {
        let html = '<div><confirmation-dialog ' +
                            'namespace="test"' +
                        '></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.$broadcast('test::confirm', {
            text: 'testing text'
        });
        $rootScope.$digest();

        expect(rootEl).toContainElement('.dialog-text');
        expect(rootEl.find('.dialog-text')).toHaveText('testing text');
    });

    it('contains a .dialog-cancel element', () => {
        let html = '<div><confirmation-dialog></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.dialog-cancel');
    });

    it('contains a .dialog-confirm element', () => {
        let html = '<div><confirmation-dialog></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.dialog-confirm');
    });

    it('contains a .confirmation-dialog element', () => {
        let html = '<div><confirmation-dialog></confirmation-dialog></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.confirmation-dialog');
    });
});
