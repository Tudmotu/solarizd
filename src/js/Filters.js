import 'angular';
export default angular.module('filters', [])
    .filter('youtubeTime', ['$filter', function($filter) {
        return function(input) {
            let seconds = input.match(/(\d+)S/);
            let minutes = input.match(/(\d+)M/);
            let hours = input.match(/(\d+)H/);

            if (seconds) seconds = parseInt(seconds, 10);
            if (minutes) minutes = parseInt(minutes, 10);
            if (hours) hours = parseInt(hours, 10);

            let time = seconds + (minutes * 60) + (hours * 60 * 60);

            return $filter('formatTime')(time);
        };
    }])
    .filter('formatTime', function() {
        return function(input) {
            if (isNaN(input) || input === '') return '--:--';
            let time = Math.floor(input);
            let hours = Math.floor(time / 3600);
            let minutes = Math.floor((time % 3600) / 60);
            let seconds = Math.floor((time % 3600) % 60);
            let parts = [];

            if (hours) {
                if (hours < 10)
                    parts.push('0' + hours);
                else
                    parts.push(hours);
            }

            if (!minutes) parts.push('00');
            else if (minutes < 10)
                parts.push('0' + minutes);
            else parts.push(minutes);

            if (!seconds) parts.push('00');
            else if (seconds < 10) parts.push('0' + seconds);
            else parts.push(seconds);

            if (!hours && !minutes && !seconds)
                return '--:--';

            return parts.join(':');
        };
    })
    .filter('commaNum', function() {
        return function(input) {
            var str = [],
                i;
            for (i = input.length - 1; i >= 0; i--) {
                str.unshift(input.charAt(i));
                if ((i) % 3 === 0) {
                    str.unshift(',');
                }
            }

            return input.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        };
    })
    .filter('machineRead', function() {
        return function(input) {
            var str = input.toString(),
                lc = str.toLowerCase();
            let output = lc.replace(/\s+/g, '-');

            return output;
        };
    });
