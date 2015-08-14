import UIKit from '../../modules/ui-kit/ui-kit.js';
import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery.js';
import $ from '../../vendor/jquery/dist/jquery.js';
import {module, inject} from '../mocks';

describe('solTabs directive', function () {
    let $compile;
    let $rootScope;

    function getElement (html, scope) {
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

    it('changes selected tab when appropriate entry is clicked', () => {
        let html = '<div><sol-tabs selected="0">' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();
        expect(element.find('[tab-id="one"]')).toHaveAttr('selected');

        element.find('[tab-ref="two"]').click();
        expect(element.find('[tab-id="two"]')).toHaveAttr('selected');
    });

    it('contains tab entries with fallback text as appears in tab-id attr', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();
        let tabs = element.find('.tabs > .tab');

        expect(tabs.filter('[tab-ref="one"]')).toHaveText('one');
        expect(tabs.filter('[tab-ref="two"]')).toHaveText('two');
    });

    it('contains tab entries with text as appears in tab-title attr', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one" tab-title="Music"></div>' +
                        '<div tab-id="two" tab-title="Video"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();
        let tabs = element.find('.tabs > .tab');

        expect(tabs.filter('[tab-ref="one"]')).toHaveText('Music');
        expect(tabs.filter('[tab-ref="two"]')).toHaveText('Video');
    });

    it('wraps tranclusion in .wrapper, adds .tabs with entries', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(element).toContainElement('.wrapper');
        expect(element).toContainElement('.tabs');
        expect(element.find('.tabs > .tab')).toHaveLength(2);
    });

    it('changes selected tab when "selected" attribute changes', () => {
        let html = '<div><sol-tabs selected="{{selected}}">' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                        '<div tab-id="three"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        $rootScope.selected = 1;
        $rootScope.$digest();

        expect(element.find('[tab-id="two"]')).toHaveAttr('selected');
        expect(element.find('[tab-id="one"]')).not.toHaveAttr('selected');
    });

    it('selects the first tab by default', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                        '<div tab-id="three"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(element.find('[tab-id="one"]')).toHaveAttr('selected');
    });

    it('should contain three tabs', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                        '<div tab-id="three"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(scope.tabs).toBeArrayOfSize(3);
    });

    it('should contain two tabs', () => {
        let html = '<div><sol-tabs>' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let scope = element.find('.sol-tabs').isolateScope();

        expect(scope.tabs).toBeArrayOfSize(2);
    });

    it('should transclude its content and wrap it in .sol-tabs', () => {
        let html = '<div><sol-tabs>content content</sol-tabs></div>';
        let element = getElement(html, $rootScope);

        expect(element).not.toContainElement('sol-tabs');
        expect(element).toContainElement('.sol-tabs');
        expect(element.find('.sol-tabs')).toContainText('content content');
    });
});
