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
    }));

    let root;
    let metadataList;
    let onAuthHandlers = [];
    let triggerOnAuth = (data) => onAuthHandlers.forEach(fn => fn(data));
    let setupUserAuth = () => {
        triggerOnAuth({ uid: 'test-uid' });
        $rootScope.$digest();
    };

    beforeEach(() => {
        $location.url($location.path());
        $httpBackend.when('GET', 'apikeys.json').respond({});

        metadataList = FirebaseMock.mockArray([
            { playlist: '--KjSAu12jD-1' },
            { playlist: '--KjSAu12jD-2', name: 'Bla bla' },
            { playlist: '--KjSAu12jD-3', name: 'Awesome Playlist' }
        ]);

        spyOn(solBackend, 'fetchUserPlaylists').and.callFake(uid => {
            if (uid === 'test-uid')
                return $q((resolve, reject) => resolve(metadataList));
            else
                return $q((resolve, reject) => reject());
        });

        spyOn(solBackend, 'onAuth').and.callFake(
            handler => onAuthHandlers.push(handler));

        let html = '<div><user-playlists></user-playlists></div>';
        root = createRoot(html, $rootScope);
    });

    describe('auth events', () => {
        it('should empty the list when auth becomes null', () => {
            setupUserAuth();
            expect(root.find('.playlist')).toHaveLength(3);
            triggerOnAuth();
            $rootScope.$digest();
            expect(root.find('.playlist')).toHaveLength(0);
        });

        it('should fetch playlists for uid=null if non supplied', () => {
            triggerOnAuth();
            expect(solBackend.fetchUserPlaylists).toHaveBeenCalledWith(null);
        });

        it('should fetch playlists with the supplied uid from onAuth event', () => {
            triggerOnAuth({
                uid: 'aaa'
            });
            expect(solBackend.fetchUserPlaylists).toHaveBeenCalledWith('aaa');
        });

        it('should fetch playlists only once auth is available', () => {
            expect(solBackend.fetchUserPlaylists).not.toHaveBeenCalled();
            triggerOnAuth();
            expect(solBackend.fetchUserPlaylists).toHaveBeenCalled();
        });
    });

    describe('selecting an item', () => {
        beforeEach(setupUserAuth);

        it('should be performed automatically when rendered, according to $location', () => {
            $location.search('playlist', '--KjSAu12jD-2');
            $rootScope.$digest();

            let html = '<div><user-playlists></user-playlists></div>';
            let newRoot = createRoot(html, $rootScope);
            setupUserAuth();
            let entry = newRoot.find('.playlist').eq(1);

            expect(newRoot.find('.playlist')).toHaveLength(3);
            expect(entry).toHaveClass('selected');
        });

        it('should be performed automatically when $location.search() changes', () => {
            let entry1 = root.find('.playlist').eq(0);
            let entry2 = root.find('.playlist').eq(1);

            entry1.find('.text').click();

            $location.search('playlist', '--KjSAu12jD-2');
            $rootScope.$digest();

            expect(entry2).toHaveClass('selected');
        });

        it('should set an appropriate search param using $location.search()', () => {
            let entry1 = root.find('.playlist').eq(0);

            spyOn($location, 'search');
            entry1.find('.text').click();

            expect($location.search).toHaveBeenCalledWith(
                'playlist', '--KjSAu12jD-1');
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
        beforeEach(setupUserAuth);

        it('should remove appropriate entry from list when .remove clicked', () => {
            root.find('.playlist').eq(1).find('.remove').click();
            expect(metadataList.$remove).toHaveBeenCalledWith(1);
        });

        it('should call .$save() on metadataList with appropriate playlist on-change', () => {
            let entry = root.find('.playlist').eq(0);
            entry.find('.editor').val('cba').change();
            $rootScope.$digest();
            expect(metadataList.$save).toHaveBeenCalledWith(metadataList[0]);
        });

        it('should be two-way bound to the metadataList variable', () => {
            let entry = root.find('.playlist').eq(0);
            metadataList[0].name = 'abc';
            $rootScope.$digest();
            expect(entry.find('.editor')).toHaveValue('abc');

            entry.find('.editor').val('cba').change();
            $rootScope.$digest();
            expect(metadataList[0].name).toBe('cba');
        });

        it('should show the input element only when in edit-mode', () => {
            let entry = root.find('.playlist').eq(0);
            expect(entry.find('.editor')).toHaveClass('ng-hide');
            entry.find('.edit').click();
            expect(entry.find('.editor')).not.toHaveClass('ng-hide');
        });

        it('should hide .text element when in edit-mode', () => {
            let entry = root.find('.playlist').eq(0);
            entry.find('.edit').click();
            expect(entry.find('.text')).toHaveClass('ng-hide');
        });

        it('should toggle "edit-mode" class when .edit element clicked', () => {
            expect(root.find('.playlist')).not.toHaveClass('edit-mode');

            let entry = root.find('.playlist').eq(0);
            entry.find('.edit').click();
            expect(entry).toHaveClass('edit-mode');
        });
    });

    describe('list items markup', () => {
        beforeEach(setupUserAuth);

        it('should contain a .edit.action element', () => {
            expect(root.find('.playlist')).toContainElement('.edit.action');
        });

        it('should contain a .remove.action element', () => {
            expect(root.find('.playlist')).toContainElement('.remove.action');
        });

        it('should contain an input.editor element with placeholder', () => {
            expect(root.find('.playlist')).toContainElement('input.editor');
            expect(root.find('.playlist .editor')).toHaveAttr('placeholder', 'New Playlist');
        });

        it('should have text as given in the "name" prop when present', () => {
            expect(root.find('.playlist').eq(1)).toHaveText('Bla bla');
        });

        it('should have "New Playlist" text if no "name" prop is present in data', () => {
            expect(root.find('.playlist').eq(0)).toHaveText('New Playlist');
        });

        it('should represent the data as returned from solBackend service', () => {
            expect(root.find('.playlist')).toHaveLength(3);
        });
    });

    describe('general markup', () => {
        it('contains a .playlists element', () => {
            expect(root).toContainElement('.playlists');
        });

        it('contains a .header > .title element with text in it', () => {
            expect(root).toContainElement('.header > .title');
            expect(root.find('.header > .title')).toHaveText('Playlists');
        });

        it('contains a .header element', () => {
            expect(root).toContainElement('.header');
        });

        it('contains a .user-playlists element', () => {
            expect(root).toContainElement('.user-playlists');
        });
    });
});
