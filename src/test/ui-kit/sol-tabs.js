import UIKit from '../../modules/ui-kit/ui-kit.js';
import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery.js';
import $ from '../../vendor/jquery/dist/jquery.js';
import {module, inject} from '../mocks';

describe('solTabs directive', function () {
    let $compile;
    let $rootScope;

    beforeEach(module('ui-kit'));
    beforeEach(inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('changes selected tab when "selected" attribute changes', () => {
        let html = '<div><sol-tabs selected="{{selected}}">' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                        '<div tab-id="three"></div>' +
                    '</sol-tabs></div>';
        let element = $compile(html)($rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        $rootScope.selected = 1;
        $rootScope.$apply();

        expect(scope.tabs[1]).toHaveAttr('selected');
        expect(scope.tabs[0]).not.toHaveAttr('selected');
        //expect(scope.tabs[2]).not.toHaveAttr('selected');
    });

    it('selects the first tab by default', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                        '<div tab-id="three"></div>' +
                    '</sol-tabs></div>';
        let element = $compile(html)($rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(scope.tabs[0]).toHaveAttr('selected');
    });

    it('should contain three tabs', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                        '<div tab-id="three"></div>' +
                    '</sol-tabs></div>';
        let element = $compile(html)($rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(scope.tabs).toBeArrayOfSize(3);
    });

    it('should contain two tabs', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = $compile(html)($rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(scope.tabs).toBeArrayOfSize(2);
    });

    it('should transclude its content and wrap it in .sol-tabs', () => {
        let html = '<div><sol-tabs>content content</sol-tabs></div>';
        let element = $compile(html)($rootScope);

        expect(element).not.toContainElement('sol-tabs');
        expect(element).toContainElement('.sol-tabs');
        expect(element.find('.sol-tabs')).toContainText('content content');
    });
});
