import alertSubscribeConfig from '@/community-module/alert/pages/mq/subscribe/alert-subscribe-config.vue';
import ComponentManager from '@/resources/import/component-manager.js';
ComponentManager.registerMqSubscribeConfigComponent({ ALERT_SUBSCRIBE_config: alertSubscribeConfig });
//xxx_config中的xxx需要和后端ISubscribeHandler的getName一致

// 告警模块维护详情页的定位方式，供工单等页面复用。
ComponentManager.registerComponent('processTaskReportSourceRoute', {
  alert: ({ alertId }) => alertId ? HOME + '/alert.html#/alert-detail/' + encodeURIComponent(alertId) : ''
});
