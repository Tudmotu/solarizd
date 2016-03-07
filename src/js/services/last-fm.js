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
                        this.albumInfo(album)
                    )
                )
            ).then(albums =>
                albums.filter(album => album.tracks.track.length > 0)
            );
        },

        albumInfo (album) {
            let { mbid, artist, name } = album;

            return get('album.getInfo',
               //{ artist, album: name }
               { mbid }
            ).then(o =>
                o.album
            ).then(album => {
                let durations = album.tracks.track.map(
                    o => parseInt(o.duration, 10));

                album.duration = durations.reduce(
                        (prev, cur) => prev + cur, 0);

                return album;
            });
        },

        getTrackImage (track) {
            return get('track.search',
               { track }
            ).then(resp => {
                let { artist } = resp.results.trackmatches.track.filter(
                    item => item.artist !== '[unknown]')[0];

                return get('artist.getInfo', { artist });
            }).then(resp => {
                let img = resp.artist.image[4]['#text'];
                return img;
            });
        }
    });

    function get (method, extra) {
        return apiKey.fetch('lastfm').then(secrets =>
            $http.get(baseUrl, {
                params: Object.assign({
                    method,
                    api_key: secrets.api_key,
                    format: 'json'
                }, extra)
            })
        ).then(response =>
            response.data
        );
    }
}];

