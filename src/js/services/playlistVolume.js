export default ['$rootScope', 'youtubePlayer', function($rootScope, youtubePlayer) {
    var isMuted = false;
    var currentVolume = 100;

    $rootScope.$on('youtubePlayer:infoDelivery', function(e, data) {
        if (data.info.hasOwnProperty('muted')) {
            isMuted = data.info.muted;
        }

        if (data.info.hasOwnProperty('volume')) {
            currentVolume = data.info.volume;
        }
    });

    this.isMuted = function() {
        return isMuted;
    };

    this.toggleMute = function(value) {
        youtubePlayer.toggleMute();
    };

    this.get = function() {
        return currentVolume;
    };

    this.set = function(value) {
        if (value > 100) value = 100;
        else if (value < 0) value = 0;

        youtubePlayer.setVolume(value);
    };

    this.setRelative = function(delta) {
        var newVolume = currentVolume + delta;

        if (newVolume > 100) {
            newVolume = 100;
        }

        if (newVolume < 0) {
            newVolume = 0;
        }

        youtubePlayer.setVolume(newVolume);
    };
}];
