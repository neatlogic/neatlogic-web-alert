<template>
  <div
    class="padding-md radius-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem
      label="熔断策略"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ handlerText }}按</span>
      <span class="text-bold ml-xs mr-xs">{{ scopeText }}</span>
      <span>统计，连续失败</span>
      <span class="text-bold ml-xs mr-xs">{{ failureThresholdText }}</span>
      <span>次后熔断</span>
      <span class="text-bold ml-xs mr-xs">{{ openDurationText }}</span>
      <span>。</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit'"
      label="熔断状态"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>当前连续失败</span>
      <span class="text-bold ml-xs mr-xs">{{ displayValue(stateData.failureCount || 0) }}</span>
      <span>次。</span>
    </TsFormItem>
    <BreakerActionView :config="config" :actionAuditList="policy.actionAuditList" :level="level + 1"></BreakerActionView>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    BreakerActionView: () => import('../../action/breaker-action-view.vue')
  },
  props: {
    policy: { type: Object, default: () => ({}) },
    mode: { type: String, default: 'edit' },
    level: { type: Number, default: 1 }
  },
  methods: {
    getUnitText(unit) {
      const unitTextMap = {
        second: '秒',
        minute: '分钟',
        hour: '小时'
      };
      return unitTextMap[unit] || unit || '';
    },
    displayValue(value) {
      if (value === null || value === undefined || value === '') {
        return '-';
      }
      return value;
    }
  },
  computed: {
    config() {
      return this.policy.policyConfig || this.policy.config || {};
    },
    stateData() {
      return this.policy.stateData || {};
    },
    handlerText() {
      return this.policy.policyHandlerLabel || this.policy.policyHandler || '当前策略';
    },
    scopeText() {
      const scopeTextMap = {
        handlerInstance: '插件实例',
        handler: '插件类型'
      };
      return scopeTextMap[this.config.scope] || this.config.scope || '-';
    },
    failureThresholdText() {
      return this.displayValue(this.config.failureThreshold);
    },
    openDurationText() {
      return `${this.displayValue(this.config.openDuration)}${this.getUnitText(this.config.openDurationUnit)}`;
    }
  }
};
</script>
