import ComponentManager from '@/resources/import/component-manager.js';

import email_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-email.vue';
import save_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-save.vue';
import condition_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-condition.vue';
import delete_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-delete.vue';
import apply_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-apply.vue';
import interval_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-interval.vue';
import cancel_interval_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-cancel_interval.vue';
import close_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-close.vue';
import open_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-open.vue';
import integration_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-integration.vue';
import updatestatus_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-updatestatus.vue';
import mark_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-mark.vue';
import unmark_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-unmark.vue';
import action_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-action.vue';
import unaction_eventhandler from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-unaction.vue';
// 获取动态组件
const dynamicComponents = ComponentManager.getAlertEventHandlerViewComponent() || {};

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
