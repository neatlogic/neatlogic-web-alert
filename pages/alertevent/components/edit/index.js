import ComponentManager from '@/resources/import/component-manager.js';

import email_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-email.vue';
import save_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-save.vue';
import condition_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-condition.vue';
import delete_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-delete.vue';
import apply_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-apply.vue';
import interval_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-interval.vue';
import cancel_interval_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-cancel_interval.vue';
import close_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-close.vue';
import open_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-open.vue';
import integration_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-integration.vue';
import updatestatus_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-updatestatus.vue';
import mark_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-mark.vue';
import unmark_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-unmark.vue';
import action_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-action.vue';
import unaction_eventhandler from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-unaction.vue';

// 获取动态组件
const dynamicComponents = ComponentManager.getAlertEventHandlerEditComponent() || {};

const allComponents = {
  email_eventhandler,
  save_eventhandler,
  condition_eventhandler,
  delete_eventhandler,
  apply_eventhandler,
  interval_eventhandler,
  cancel_interval_eventhandler,
  close_eventhandler,
  open_eventhandler,
  integration_eventhandler,
  updatestatus_eventhandler,
  mark_eventhandler,
  unmark_eventhandler,
  action_eventhandler,
  unaction_eventhandler,
  ...dynamicComponents // 把动态组件合并进来
};

export default allComponents;
