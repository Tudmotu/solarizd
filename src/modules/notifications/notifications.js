import 'angular';
import toastNotification from './toast/toast';
import confirmationDialog from './confirmation/confirmation';

export default angular.module('notifications', ['ngSanitize'])
    .directive('confirmationDialog', confirmationDialog)
    .directive('toastNotification', toastNotification);
