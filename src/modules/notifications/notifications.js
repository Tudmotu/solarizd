import 'angular';
import toastNotification from './toast/toast';
import confirmationDialog from './confirmation/confirmation';

export default angular.module('notifications', [])
    .directive('confirmationDialog', confirmationDialog)
    .directive('toastNotification', toastNotification);
