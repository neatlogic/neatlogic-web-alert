import {$t} from '@/resources/init.js';
export const config = {
  module: 'alert',
  menuType: {
    alert: $t('term.alert.alertmanage'),
    alerttopo: $t('term.alert.alerttopo'),
    alertnotify: $t('term.alert.alertnotify'),
    alertsuppression: $t('term.alert.alertban'),
    breakermanage: $t('term.alert.alertbreaker'),
    alertmanage: $t('term.alert.systemmanage')
  }
};
