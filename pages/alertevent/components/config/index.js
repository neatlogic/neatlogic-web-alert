import ComponentManager from '@/resources/import/component-manager.js';

import email_eventhandler from '@/commercial-module/alert/pages/alertevent/components/config/alertevent-config-email.vue';

// 获取动态组件
const dynamicComponents = ComponentManager.getAlertEventHandlerConfigComponent() || {};

const allComponents = {
  email_eventhandler,
  ...dynamicComponents // 把动态组件合并进来
};

export default allComponents;
