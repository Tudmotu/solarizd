import $ from '../../vendor/jquery/dist/jquery.js';
import {module, inject, createRootFactory} from '../mocks';

describe('solPopmenu directive', function () {
    let $compile;
    let $rootScope;
    let createRoot;
    let rootEl;

    beforeEach(module('karma.templates'));
    beforeEach(module('ui-kit'));
    beforeEach(inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        createRoot = createRootFactory($compile);

        let html = '<div><sol-popmenu icon="list">tranclusion</sol-popmenu></div>';
        rootEl = createRoot(html, $rootScope);
    }));

    it('should replace the element', () => {
        let menu = rootEl.find('.popmenu-popup .popmenu-content');
        
        expect(rootEl).not.toContainElement('sol-popmenu');
    });

    it('should transclude content inside a ".popmenu-popup .popmenu-content" element', () => {
        let menu = rootEl.find('.popmenu-popup .popmenu-content');
        
        expect(menu).toHaveText('tranclusion');
    });

    it('should add "fa fa-<icon>" class on toggler according to icon attribute', () => {
        let toggler = rootEl.find('.popmenu-toggler');
        
        expect(toggler).toHaveClass('fa fa-list');
    });

    it('should toggle the "closed" class on .popmenu once the .popmenu-toggler clicked', () => {
        let menu = rootEl.find('.popmenu');
        let toggler = rootEl.find('.popmenu-toggler');
        
        expect(menu).not.toHaveClass('closed');
        toggler.click();
        toggler.click();
        $rootScope.$digest();
        expect(menu).toHaveClass('closed');
    });

    it('contains a .popmenu-toggler element', () => {
        let html = '<div><sol-popmenu></sol-popmenu></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.popmenu-toggler');
    });

    it('contains a .popmenu element', () => {
        let html = '<div><sol-popmenu></sol-popmenu></div>';
        let rootEl = createRoot(html, $rootScope);

        expect(rootEl).toContainElement('.popmenu');
    });
});
