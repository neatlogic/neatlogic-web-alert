<template>
  <div>
    <TsFormItem
      label="熔断插件"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ policy.policyHandlerLabel || policy.policyHandler || '-' }}</span>
    </TsFormItem>
    <TsFormItem
      label="统计维度"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ dimensionText }}</span>
    </TsFormItem>
    <TsFormItem
      label="统计窗口"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.windowSize || '-' }}{{ getUnitText(config.windowUnit) }}</span>
    </TsFormItem>
    <TsFormItem
      label="触发阈值"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.threshold || '-' }}</span>
    </TsFormItem>
    <TsFormItem
      label="熔断时长"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.openDuration || '-' }}{{ getUnitText(config.openDurationUnit) }}</span>
    </TsFormItem>
    <TsFormItem
      label="启用聚合触发"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.enableAggregate === 1 ? '是' : '否' }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="config.enableAggregate === 1"
      label="收集上限"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.collectLimit || '-' }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit' && hasStateData"
      label="熔断状态"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div>
        <span>已收集告警数：{{ displayValue(stateData.collectCount) }}</span>
        <span class="ml-md">超限未收集：{{ displayValue(stateData.collectDropCount) }}</span>
        <span class="ml-md">基线告警ID：{{ displayValue(stateData.baselineAlertId) }}</span>
        <span v-if="config.enableAggregate === 1" class="ml-md">收集上限：{{ displayValue(config.collectLimit) }}</span>
        <div v-if="stateData.collectError" class="text-error mt-xs">采集异常：{{ stateData.collectError }}</div>
        <div v-if="stateData.flushError" class="text-error mt-xs">聚合异常：{{ stateData.flushError }}</div>
      </div>
    </TsFormItem>
    <BreakerActionView :config="config" :actionAuditList="policy.actionAuditList"></BreakerActionView>
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
    mode: { type: String, default: 'edit' }
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
