import JasmineMatchers from '../../vendor/jasmine-expect/dist/jasmine-matchers';
import JasmineJQuery from '../../vendor/jasmine-jquery/lib/jasmine-jquery';
import $ from 'jquery';
import {module, inject, createRootFactory, FirebaseMock} from '../mocks';

describe('userPlaylists directive', function () {
    let $compile;
    let $rootScope;
    let $httpBackend;
    let $q;
    let $location;
    let solBackend;
    let createRoot;

    beforeEach(module('karma.templates'));
    beforeEach(module('user-playlists'));
    beforeEach(inject((_$compile_, _$rootScope_,_$httpBackend_,_$location_,_solBackend_,_$q_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $location = _$location_;
        solBackend = _solBackend_;
        createRoot = createRootFactory($compile);

        $httpBackend.when('GET', 'apikeys.json').respond({});
    }));

    describe('selecting an item', () => {
        let root;
        let data;

        beforeEach(() => {
            data = FirebaseMock.mockArray([
                { playlist: [], id: '111' },
                { playlist: [], name: 'Bla bla' },
                { playlist: [] }
            ]);

            spyOn(solBackend, 'fetchUserPlaylists').and.returnValue(
                $q((resolve, reject) => resolve(data))
            );

            let html = '<div><user-playlists></user-playlists></div>';
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
        let data;
        beforeEach(() => {
            data = FirebaseMock.mockArray([
                { playlist: [] },
                { playlist: [], name: 'Bla bla' },
                { playlist: [] }
            ]);

            spyOn(solBackend, 'fetchUserPlaylists').and.returnValue(
                $q((resolve, reject) => resolve(data))
            );
        });

        it('should remove appropriate entry from list when .remove clicked', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            root.find('.playlist').eq(1).find('.remove').click();
            expect(data.$remove).toHaveBeenCalledWith(1);
        });

        it('should toggle "edit-mode" class when .edit element clicked', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).not.toHaveClass('edit-mode');

            let entry = root.find('.playlist').eq(0);
            entry.find('.edit').click();
            expect(entry).toHaveClass('edit-mode');
        });
    });

    describe('playlists list items', () => {
        beforeEach(() => {
            let data = [
                { playlist: [] },
                { playlist: [], name: 'Bla bla' },
                { playlist: [] }
            ];

            spyOn(solBackend, 'fetchUserPlaylists').and.returnValue(
                $q((resolve, reject) => resolve(data))
            );
        });

        it('should contain a .edit element', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toContainElement('.edit');
        });

        it('should contain a .remove element', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist')).toContainElement('.remove');
        });

        it('should have text as given in the "name" prop when present', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist').eq(1)).toHaveText('Bla bla');
        });

        it('should have "New Playlist" text if no "name" prop is present in data', () => {
            let html = '<div><user-playlists></user-playlists></div>';
            let root = createRoot(html, $rootScope);

            expect(root.find('.playlist').eq(0)).toHaveText('New Playlist');
        });

        it('should represent the data as returned from solBackend service', () => {
            let html = '<div><user-playlists></user-playlists></div>';
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
