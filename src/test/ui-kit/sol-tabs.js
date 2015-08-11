import UIKit from '../../modules/ui-kit/ui-kit.js';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery.js';
import {module, inject} from '../mocks';

describe('solTabs directive', function () {
    let $compile;
    let $rootScope;

    beforeEach(module('ui-kit'));
    beforeEach(inject((_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Should transclude its content and wrap it in .sol-tabs', () => {
        let html = '<div><sol-tabs>content content</sol-tabs></div>';
        let element = $compile(html)($rootScope);

        expect(element).not.toContainElement('sol-tabs');
        expect(element).toContainElement('.sol-tabs');
        expect(element.find('.sol-tabs')).toContainText('content content');
    });
});
