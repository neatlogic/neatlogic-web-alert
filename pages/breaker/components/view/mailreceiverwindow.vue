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
      <span>{{ handlerText }}按收件人统计，</span>
      <span class="text-bold ml-xs mr-xs">{{ windowText }}</span>
      <span>内同一处理组触发</span>
      <span class="text-bold ml-xs mr-xs">{{ thresholdText }}</span>
      <span>次后熔断并聚合，最多收集</span>
      <span class="text-bold ml-xs mr-xs">{{ collectLimitText }}</span>
      <span>条告警。</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit' && hasStateData"
      label="熔断状态"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div>
        <span>处理组</span>
        <span class="text-bold ml-xs mr-xs">{{ displayValue(stateData.groupName) }}</span>
        <span>已收集</span>
        <span class="text-bold ml-xs mr-xs">{{ displayValue(alertCount) }}</span>
        <span>条告警，超限未收集</span>
        <span class="text-bold ml-xs mr-xs">{{ displayValue(stateData.collectDropCount || 0) }}</span>
        <span>条。</span>
      </div>
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
    hasStateData() {
      return Object.keys(this.stateData).length > 0;
    },
    handlerText() {
      return this.policy.policyHandlerLabel || this.policy.policyHandler || '当前策略';
    },
    windowText() {
      return `${this.displayValue(this.config.windowSize)}${this.getUnitText(this.config.windowUnit)}`;
    },
    thresholdText() {
      return this.displayValue(this.config.threshold);
    },
    collectLimitText() {
      return this.displayValue(this.config.collectLimit);
    },
    alertCount() {
      if (this.stateData.collectCount != null) {
        return this.stateData.collectCount;
      }
      return this.stateData.alertIdList ? this.stateData.alertIdList.length : 0;
    }
  }
};
</script>
