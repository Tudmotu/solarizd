import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery';
import $ from 'jquery';
import {module, inject} from '../mocks';

describe('userPlaylists directive', function () {
    let $compile;
    let $rootScope;
    let $httpBackend;
    let $location;

    function createRoot (html, scope) {
        let el = $compile(html)(scope);
        scope.$digest();
        return el;
    }

    beforeEach(module('karma.templates'));
    beforeEach(module('user-playlists'));
    beforeEach(inject((_$compile_, _$rootScope_,_$httpBackend_,_$location_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;

        //$httpBackend.when('GET', 'apikeys.json').respond({});
    }));

    describe('selecting an item', () => {
        let root;
        beforeEach(() => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [], name: '1', id: '111' },
                { playlist: [], name: '2', id: '222' }
            ];
            root = createRoot(html, $rootScope);
        });

        it('should set an appropriate search param using $location.search()', () => {
            let entry1 = root.find('.playlist').eq(0);

            spyOn($location, 'search');
            entry1.find('.text').click();

            expect($location.search).toHaveBeenCalledWith('playlist', '111');
        });

        it('should remove the "selected" class from previous selection', () => {
            let entry1 = root.find('.playlist').eq(0);
            let entry2 = root.find('.playlist').eq(1);
            entry1.find('.text').click();
            entry2.find('.text').click();

            expect(entry1).not.toHaveClass('selected');
        });

        it('should add a "selected" class when selected', () => {
            let entry = root.find('.playlist').eq(0);
            entry.find('.text').click();
            expect(entry).toHaveClass('selected');
        });
    });

    describe('playlist entry actions', () => {
        it('should remove appropriate entry from list when .remove clicked', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [], name: '1' },
                { playlist: [], name: '2' }
            ];
            let root = createRoot(html, $rootScope);

            root.find('.playlist').eq(1).find('.remove').click();
            expect($rootScope).toHaveArrayOfSize('playlists', 1);
            expect($rootScope.playlists[0].name).toBe('1');
        });

        it('should toggle "edit-mode" class when .edit element clicked', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [] }
            ];
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).not.toHaveClass('edit-mode');

            root.find('.playlist .edit').click();
            expect(root.find('.playlist')).toHaveClass('edit-mode');
        });
    });

    describe('playlists list items', () => {
        it('should contain a .edit element', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [] }
            ];
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toContainElement('.edit');
        });

        it('should contain a .remove element', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [] }
            ];
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toContainElement('.remove');
        });

        it('should have text as given in the "name" prop when present', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [], name: 'Bla bla' }
            ];
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toHaveText('Bla bla');
        });

        it('should have "New Playlist" text if no "name" prop is present in data', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [] }
            ];
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toHaveText('New Playlist');
        });

        it('should represent the data passed via [playlists] attr', () => {
            let html = '<div><user-playlists ' +
                            'playlists="playlists"' +
                            '></user-playlists></div>';
            $rootScope.playlists = [
                { playlist: [] },
                { playlist: [] },
                { playlist: [] }
            ];
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toHaveLength(3);
        });
    });

    describe('general markup', () => {
        it('contains a .playlists element', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root).toContainElement('.playlists');
        });

        it('contains a .header > .title element with text in it', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root).toContainElement('.header > .title');
            expect(root.find('.header > .title')).toHaveText('Playlists');
        });

        it('contains a .header element', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root).toContainElement('.header');
        });

        it('contains a .user-playlists element', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root).toContainElement('.user-playlists');
        });
    });
});
