import ComponentManager from '@/resources/import/component-manager.js';

import email_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-email.vue';
import save_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-save.vue';
import condition_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-condition.vue';
import delete_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-delete.vue';
import apply_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-apply.vue';
import interval_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-interval.vue';
import close_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-close.vue';
import open_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-open.vue';
import integration_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-integration.vue';
import updatestatus_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-updatestatus.vue';
import script_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-script.vue';
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
  open_eventhandler,
  integration_eventhandler,
  updatestatus_eventhandler,
  script_eventhandler,
  ...dynamicComponents // 把动态组件合并进来
};

export default allComponents;
