import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery.js';
import $ from '../../vendor/jquery/dist/jquery.js';
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
