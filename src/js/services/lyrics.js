define([
], function () {
    return ['$rootScope', '$http', '$q', 'echoNestAPI', function ($rootScope, $http, $q, echoNest) {
        this.fetch = function (title, artist) {
            var dfrd = $q.defer();

            $http.get('/lyrics/', { params: {
                artist: artist,
                song: title
            } }).then(function (resp) {
                dfrd.resolve({
                    artist: artist,
                    songName: title,
                    lyrics: resp.data.lyrics,
                    url: resp.data.url
                });
            }, function () {
                dfrd.reject({
                    artist: artist,
                    songName: title
                });
            });

            return dfrd.promise;
        };

        this.fetchByTitle = function (title) {
            var dfrd = $q.defer(),
                that = this;

            echoNest.fetchSongByCombined(title).then(function (resp) {
                var data = resp.data.response;

                if (data.status.code === 0) {
                    var song = data.songs.reduce(function (prev, song, i, arr) {
                        if (!prev) {
                            if (title.match(song.artist_name)) return song;
                            if (title.match(song.title)) return song;
                        }
                        else if (song.title !== song.artist_name &&
                                title.indexOf(song.title) >= 0 &&
                                title.indexOf(song.artist_name) >= 0) {
                                return song;
                        }
                        return prev;
                    }, null);

                    if (!song) dfrd.reject();
                    else that.fetch(song.title, song.artist_name)
                        .then(dfrd.resolve, dfrd.reject);
                }
                else {
                    dfrd.reject(data.status);
                }
            }, function (err) {
                dfrd.reject(err);
            });

            return dfrd.promise;
        };

    }];
});

