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
      v-if="mode === 'audit' && hasStateData"
      label="熔断状态"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ stateDataText }}</span>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
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
    stateDataText() {
      return JSON.stringify(this.stateData);
    },
    dimensionText() {
      const dimensionTextMap = {
        alertType: '告警类型',
        alertLevel: '告警级别',
        event: '事件',
        handler: '插件类型',
        handlerInstance: '插件实例',
        source: '告警来源'
      };
      return (this.config.dimensionList || []).map(d => dimensionTextMap[d] || d).join('、') || '-';
    }
  }
};
</script>
