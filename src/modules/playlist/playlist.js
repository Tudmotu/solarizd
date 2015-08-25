import 'angular';
import playlistItem from './item/item.js';

export default angular.module('playlist', [])
    .directive('playlistItem', playlistItem);
