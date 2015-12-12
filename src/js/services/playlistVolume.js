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

    this.toggleMute = function() {
        youtubePlayer.toggleMute();
        syncClients();
        sendActionToServer({
            type: 'toggleMute'
        });
    };

    this.get = function() {
        return currentVolume;
    };

    this.set = function(value) {
        if (value > 100) value = 100;
        else if (value < 0) value = 0;

        youtubePlayer.setVolume(value);
        sendActionToServer({
            type: 'setVolume',
            level: value
        });
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
        syncClients();
        sendActionToServer({
            type: 'setVolume',
            level: newVolume
        });
    };

    function syncClients () {
        $rootScope.$broadcast('peer::sync_clients');
    }

    function sendActionToServer (action) {
        $rootScope.$broadcast('peer::send_action_to_server', action);
    }

    $rootScope.$on('peer::got_action_from_client', (e, action) => {
        switch (action.type) {
            case 'setVolume':
                this.set(action.level);
                break;
            case 'toggleMute':
                this.toggleMute();
                break;
        }
    });

    $rootScope.$on('peer::got_data_from_server', (e, data) => {
        $rootScope.$apply(() => {
            currentVolume = data.volumeLevel;
            isMuted = data.isMuted ? true : false;
        });
    });
}];
