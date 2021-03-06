import {module, inject} from '../mocks';

describe('solInput directive', function () {
    let $compile;
    let $rootScope;

    function createRoot (html, scope) {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    }

    beforeEach(module('karma.templates'));
    beforeEach(module('ui-kit'));
    beforeEach(inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should set the input placeholder text according to [placeholder] attr', () => {
        let html = '<div><sol-input placeholder="holding"></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl.find('input')[0].placeholder).toBe('holding');
    });

    it('should invoke the callback supplied in ng-blur attr', () => {
        let html = '<div><sol-input on-blur="onBlur()"></sol-input></div>';
        $rootScope.onBlur = jasmine.createSpy('onBlur');
        let rootEl = createRoot(html, $rootScope);

        rootEl.find('input').triggerHandler('blur');
        $rootScope.$digest();

        expect($rootScope.onBlur).toHaveBeenCalled();
    });

    it('should invoke the callback supplied in ng-focus attr', () => {
        let html = '<div><sol-input on-focus="onFocus()"></sol-input></div>';
        $rootScope.onFocus = jasmine.createSpy('onFocus');
        let rootEl = createRoot(html, $rootScope);

        rootEl.find('input').triggerHandler('focus');
        $rootScope.$digest();

        expect($rootScope.onFocus).toHaveBeenCalled();
    });

    it('should call .focus() on the .input when .icon is clicked while it has value', () => {
        let html = '<div><sol-input value="search" icon="search"></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        spyOn(rootEl.find('.input')[0], 'focus').and.callThrough();
        $rootScope.search = "test";
        $rootScope.$digest();

        rootEl.find('.icon').click();
        $rootScope.$digest();

        expect(rootEl.find('.input')[0].focus).toHaveBeenCalled();
    });

    it('should call .focus() on the .input when .icon is clicked', () => {
        let html = '<div><sol-input value="search" icon="search"></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        spyOn(rootEl.find('.input')[0], 'focus').and.callThrough();
        rootEl.find('.icon').click();
        $rootScope.$digest();

        expect(rootEl.find('.input')[0].focus).toHaveBeenCalled();
    });

    it('clicking the .icon element clears the input', () => {
        let html = '<div><sol-input value="search" icon="search"></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.search = 'query';
        $rootScope.$digest();

        expect(rootEl.find('input')).toHaveValue('query');

        rootEl.find('.icon').click();
        $rootScope.$digest();

        expect(rootEl.find('input')).toHaveValue('');
    });

    it('changes icon to "fa-remove" when input has value', () => {
        let html = '<div><sol-input value="search" icon="search"></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        $rootScope.search = 'query';
        $rootScope.$digest();

        expect(rootEl.find('.icon')).not.toHaveClass('fa-search');
        expect(rootEl.find('.icon')).toHaveClass('fa-remove');
    });

    it('binds the [value] attr to the value of the input element', () => {
        let html = '<div><sol-input value="search"></sol-input></div>';
        $rootScope.search = 'query';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl.find('.sol-input').isolateScope().value).toBe('query');
        expect(rootEl.find('input')).toHaveValue('query');

        rootEl.find('input').val('yo yo yo').trigger('input');
        $rootScope.$digest();

        expect($rootScope.search).toBe('yo yo yo');
    });

    it('contains a .icon element with .fa-{{icon}} class', () => {
        let html = '<div><sol-input icon="search"></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.icon');
        expect(rootEl.find('.icon')).toHaveClass('fa');
        expect(rootEl.find('.icon')).toHaveClass('fa-search');
    });

    it('contains a single .sol-input element with .input inside it', () => {
        let html = '<div><sol-input></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.sol-input');
        expect(rootEl.find('.sol-input')).toContainElement('input');
    });

    it('contains an input.input element', () => {
        let html = '<div><sol-input></sol-input></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('input');
        expect(rootEl.find('input')).toHaveClass('input');
    });
});
