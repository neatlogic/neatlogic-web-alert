<template>
  <div>
    <TsFormItem label="熔断动作" labelPosition="left" style="margin: 0px !important">
      <div>
        <div v-for="trigger in visibleTriggerList" :key="trigger.key" class="mb-sm">
          <div class="text-grey">{{ trigger.text }}</div>
          <div
            v-for="(action, index) in config[trigger.key]"
            :key="action.uuid || index"
            class="padding-sm radius-sm mb-sm"
            :class="{
              'bg-grey': level % 2 !== 0,
              'bg-op': level % 2 === 0
            }"
          >
            <div style="position: relative">
              <span class="text-grey">{{ index + 1 }}.</span>
              <span class="ml-xs">{{ action.name || action.handlerLabel || action.handler }}</span>
              <span class="ml-xs" :class="action.isActive === 0 ? 'text-grey' : 'text-success'">{{ action.isActive === 0 ? '已禁用' : '' }}</span>
              <div style="position: absolute; top: 0px; right: 0px">
                <Tag class="ml-xs">{{ action.handlerLabel || action.handler }}</Tag>
              </div>
            </div>
            <component
              :is="actionComponentMap[action.handler && action.handler.toLowerCase()]"
              v-if="action.handler && actionComponentMap[action.handler.toLowerCase()]"
              :action="action"
              :actionAudit="getActionAudit(action, trigger.value)"
            ></component>
          </div>
        </div>
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import actionComponentMap from './components/view/index.js';
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    config: { type: Object, default: () => ({}) },
    actionAuditList: { type: Array, default: () => [] },
    level: { type: Number, default: 1 }
  },
  data() {
    return {
      actionComponentMap,
      triggerList: [
        { key: 'openActionList', value: 'OPEN', text: '熔断时触发' },
        { key: 'aggregateActionList', value: 'AGGREGATE', text: '聚合时触发' },
        { key: 'recoverActionList', value: 'RECOVER', text: '熔断恢复时触发' }
      ]
    };
  },
  methods: {
    getActionAudit(action, trigger) {
      if (!action || !action.uuid || !trigger || !this.actionAuditList || this.actionAuditList.length === 0) {
        return null;
      }
      return this.actionAuditList.find(audit => audit && audit.actionUuid === action.uuid && audit.trigger === trigger) || null;
    }
  },
  computed: {
    visibleTriggerList() {
      return this.triggerList.filter(trigger => this.config[trigger.key] && this.config[trigger.key].length > 0);
    }
  }
};
</script>
