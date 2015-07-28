var basePath = 'https://www.googleapis.com/youtube/v3',
    maxResults = 50;

export default ['$rootScope', '$http', '$q', function($rootScope, $http, $q) {
    var APIKEY = null;
    $rootScope.$on('youtube-apikey', function(e, key) {
        APIKEY = key;
    });

    this.search = function(opts) {
        var that = this;
        var query;
        var path = basePath + '/search';
        var rejectedPromise = $q.defer();
        if (!APIKEY) {
            rejectedPromise.reject();
            return rejectedPromise.promise;
        }

        if (typeof opts === 'string') {
            query = opts;
            opts = {};
            opts.q = query;
        }

        opts.maxResults = maxResults;
        opts.key = APIKEY;
        opts.part = 'snippet';
        opts.type = 'video';
        opts.videoCategoryId = 10;

        return $http.get(path, {
            params: opts
        }).then(function(list) {
            var videoIds = list.data.items.map(function(item) {
                return item.id.videoId;
            });

            // Fetch durations and stuff
            return that.getVideo(videoIds);
        }).then(function(resp) {
            resp.data.items.forEach(function(item, i) {
                item.duration = item.contentDetails.duration;
            });

            return resp.data.items;
        });
    };

    this.getVideo = function(videoId) {
        var path = basePath + '/videos',
            opts = {};
        var rejectedPromise = $q.defer();
        if (!APIKEY) {
            rejectedPromise.reject();
            return rejectedPromise.promise;
        }


        opts.maxResults = maxResults;
        opts.part = 'snippet,statistics,contentDetails';
        opts.fields = 'items(id,snippet,contentDetails/duration,statistics/viewCount)';
        opts.key = APIKEY;
        opts.id = Array.isArray(videoId) ? videoId.join(',') : videoId;

        return $http.get(path, {
            params: opts
        });
    };

    this.getRelated = function(videoId) {
        var opts = {};
        opts.relatedToVideoId = videoId;
        opts.part = 'snippet';
        opts.type = 'video';
        opts.videoCategoryId = 10;

        return this.search(opts);
    };
}];

