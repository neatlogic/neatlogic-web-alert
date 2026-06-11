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
      <span class="text-bold ml-xs mr-xs">{{ dimensionText }}</span>
      <span>统计，</span>
      <span class="text-bold ml-xs mr-xs">{{ windowText }}</span>
      <span>内触发</span>
      <span class="text-bold ml-xs mr-xs">{{ thresholdText }}</span>
      <span>次后熔断</span>
      <span class="text-bold ml-xs mr-xs">{{ openDurationText }}</span>
      <span>，熔断期间</span>
      <span>{{ config.enableAggregate === 1 ? '启用' : '不启用' }}</span>
      <span>聚合触发</span>
      <template v-if="config.enableAggregate === 1">
        <span>，最多收集</span>
        <span class="text-bold ml-xs mr-xs">{{ collectLimitText }}</span>
        <span>条告警</span>
      </template>
      <span>。</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit' && hasStateData"
      label="熔断状态"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div>
        <span>已收集</span>
        <span class="text-bold ml-xs mr-xs">{{ displayValue(stateData.collectCount) }}</span>
        <span>条告警，超限未收集</span>
        <span class="text-bold ml-xs mr-xs">{{ displayValue(stateData.collectDropCount) }}</span>
        <span>条</span>
        <template v-if="stateData.baselineAlertId">
          <span>，基线告警ID为</span>
          <span class="text-bold ml-xs mr-xs">{{ stateData.baselineAlertId }}</span>
        </template>
        <template v-if="config.enableAggregate === 1">
          <span>，收集上限为</span>
          <span class="text-bold ml-xs mr-xs">{{ collectLimitText }}</span>
          <span>条</span>
        </template>
        <span>。</span>
        <div v-if="stateData.collectError" class="text-error mt-xs">采集异常：{{ stateData.collectError }}</div>
        <div v-if="stateData.flushError" class="text-error mt-xs">聚合异常：{{ stateData.flushError }}</div>
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
    openDurationText() {
      return `${this.displayValue(this.config.openDuration)}${this.getUnitText(this.config.openDurationUnit)}`;
    },
    collectLimitText() {
      return this.displayValue(this.config.collectLimit);
    },
    dimensionText() {
      const dimensionTextMap = {
        alertType: '告警类型',
        alertLevel: '告警级别',
        event: '事件',
        handler: '插件类型',
        handlerInstance: '插件实例',
        source: '告警来源',
        worker: '处理人',
        workerTeam: '处理组'
      };
      return (this.config.dimensionList || []).map(d => dimensionTextMap[d] || d).join('、') || '-';
    }
  }
};
</script>
