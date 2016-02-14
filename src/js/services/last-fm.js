export default ['$rootScope', '$http', 'ApiKey', function($rootScope, $http, apiKey) {
    let baseUrl = 'http://ws.audioscrobbler.com/2.0';

    Object.assign(this, {
        albumSearch (query) {
            if (!query) return Promise.resolve();

            return get('album.search', {
                album: query
            }).then(
                data => data.results.albummatches.album
            ).then(albums =>
                albums.filter(album => !!album.mbid).splice(0,5)
            ).then(albums =>
                Promise.all(
                    albums.map(album =>
                        this.albumInfo(album.mbid)
                    )
                )
            ).then(albums =>
                albums.map(o => o.album)
            ).then(albums =>
                albums//.filter(album => album.tracks.length > 0)
            );
        },

        albumInfo (mbid) {
            return get('album.getInfo',
               { mbid }
            );
        }
    });

    function get (method, extra) {
        return apiKey.fetch('lastfm').then(secrets => 
            `${baseUrl}/?method=${method}&api_key=${secrets.api_key}&format=json&${asParams(extra)}`
        ).then(url =>
            $http.get(url)
        ).then(response =>
            response.data
        );
    }

    function asParams (params) {
        return Object.keys(params).map(
            param => `${param}=${encodeURIComponent(params[param])}`
        ).join('&');
    }
}];

