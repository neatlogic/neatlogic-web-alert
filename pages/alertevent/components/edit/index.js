import ComponentManager from '@/resources/import/component-manager.js';

import email_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-email.vue';
import save_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-save.vue';
import condition_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-condition.vue';
import delete_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-delete.vue';
import apply_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-apply.vue';
import interval_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-interval.vue';
import close_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-close.vue';
import integration_eventhandler from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-integration.vue';
// 获取动态组件
const dynamicComponents = ComponentManager.getAlertEventHandlerEditComponent() || {};

const allComponents = {
  email_eventhandler,
  save_eventhandler,
  condition_eventhandler,
  delete_eventhandler,
  apply_eventhandler,
  interval_eventhandler,
  close_eventhandler,
  integration_eventhandler,
  ...dynamicComponents // 把动态组件合并进来
};

export default allComponents;
