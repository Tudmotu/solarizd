import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery.js';
import $ from '../../vendor/jquery/dist/jquery.js';
import {module, inject} from '../mocks';

describe('solTabs directive', function () {
    let $compile;
    let $rootScope;
    let $httpBackend;

    function getElement (html, scope) {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    }

    angular.module('test-module', [])
        .directive('testDir', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'test.html'
            };
        });
    beforeEach(module('test-module'));

    beforeEach(module('karma.templates'));
    beforeEach(module('ui-kit'));
    beforeEach(inject((_$compile_, _$httpBackend_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $httpBackend.when('GET', 'test.html')
            .respond('<div class="test-dir"></div>');
    }));

    it('auto-selects correct tab when nesting directives with templateUrl and replace:true', (done) => {
        let html = '<div><sol-tabs selected="1">' +
                        '<test-dir tab-id="one"></test-dir>' +
                        '<test-dir tab-id="two"></test-dir>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        let mutationCount = 0;

        let observer = new MutationObserver(function () {
            expect(element.find('[tab-id="two"]')).toHaveAttr('selected');
            done();
        });

        observer.observe(element.find('[ng-transclude]')[0], {
            childList: true
        });

        $httpBackend.flush();

        expect(element.find('test-dir')).toHaveLength(0);
        expect(element.find('[tab-ref="two"]')).toHaveAttr('active');
    });

    it('handles transcluded directives with templateUrl and replace:true', () => {
        let html = '<div><sol-tabs selected="1">' +
                        '<test-dir tab-id="one"></test-dir>' +
                        '<test-dir tab-id="two"></test-dir>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);

        expect(element.find('[tab-ref="two"]')).toHaveAttr('active');
        expect(element.find('[tab-id="two"]')).toHaveAttr('selected');

        $httpBackend.flush();

        expect(element.find('test-dir')).toHaveLength(0);

        element.find('[tab-ref="one"]').click();
        expect(element.find('[tab-ref="one"]')).toHaveAttr('active');
        expect(element.find('[tab-id="one"]')).toHaveAttr('selected');
    });

    it('adds appropriate font-awesome classes when [tab-icon] present', () => {
        let html = '<div><sol-tabs selected="1">' +
                        '<div tab-id="one" tab-icon="search"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);

        expect(element.find('[tab-ref="one"]')).toHaveClass('fa');
        expect(element.find('[tab-ref="two"]')).not.toHaveClass('fa');
        expect(element.find('[tab-ref="one"]')).toHaveClass('fa-search');
    });

    it('has [active] attr on entry and [selected] attr on tab in sync', () => {
        let html = '<div><sol-tabs selected="1">' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);

        expect(element.find('[tab-ref="two"]')).toHaveAttr('active');
        expect(element.find('[tab-id="two"]')).toHaveAttr('selected');

        element.find('[tab-ref="one"]').click();

        expect(element.find('[tab-ref="one"]')).toHaveAttr('active');
        expect(element.find('[tab-id="one"]')).toHaveAttr('selected');
    });

    it('changes "active" attribute according to clicked tab-entry', () => {
        let html = '<div><sol-tabs selected="0">' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);
        expect(element.find('[tab-ref="one"]')).toHaveAttr('active');

        element.find('[tab-ref="two"]').click();
        expect(element.find('[tab-ref="one"]')).not.toHaveAttr('active');
        expect(element.find('[tab-ref="two"]')).toHaveAttr('active');
    });

    it('adds "active" attribute to currently selected tab-entry', () => {
        let html = '<div><sol-tabs selected="0">' +
                        '<div tab-id="one"></div>' +
                        '<div tab-id="two"></div>' +
                    '</sol-tabs></div>';
        let element = getElement(html, $rootScope);

        expect(element.find('[tab-ref="one"]')).toHaveAttr('active');
        expect(element.find('[tab-ref="two"]')).not.toHaveAttr('active');
    });

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
