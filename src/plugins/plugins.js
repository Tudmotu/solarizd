import 'angular';

// This is an example "plugins" module
let module = angular.module('plugins', ['services']);

//module.run(['$rootScope', 'playList', ($rootScope, playList) => {
    //console.debug('registered plugin');

    //$rootScope.$watch(playList.getNowPlaying, (newVal) => {
        //console.debug('now playing', newVal);
    //});
//}]);

export default module;
