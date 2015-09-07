import 'angular';
import toastNotification from './toast/toast';

export default angular.module('notifications', [])
    .directive('toastNotification', toastNotification);
