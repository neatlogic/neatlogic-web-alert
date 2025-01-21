import alertSubscribeConfig from '@/commercial-module/alert/pages/mq/subscribe/alert-subscribe-config.vue';
import ComponentManager from '@/resources/import/component-manager.js';
ComponentManager.registerMqSubscribeConfigComponent({ ALERT_SUBSCRIBE_config: alertSubscribeConfig });
//xxx_config中的xxx需要和后端ISubscribeHandler的getName一致
