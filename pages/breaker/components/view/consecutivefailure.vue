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
      label="统计范围"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ scopeText }}</span>
    </TsFormItem>
    <TsFormItem
      label="连续失败阈值"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.failureThreshold || '-' }}</span>
    </TsFormItem>
    <TsFormItem
      label="熔断时长"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ config.openDuration || '-' }}{{ getUnitText(config.openDurationUnit) }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit'"
      label="连续失败次数"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ stateData.failureCount || 0 }}</span>
    </TsFormItem>
    <BreakerActionView :config="config"></BreakerActionView>
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
    }
  },
  computed: {
    config() {
      return this.policy.policyConfig || this.policy.config || {};
    },
    stateData() {
      return this.policy.stateData || {};
    },
    scopeText() {
      const scopeTextMap = {
        handlerInstance: '插件实例',
        handler: '插件类型'
      };
      return scopeTextMap[this.config.scope] || this.config.scope || '-';
    }
  }
};
</script>
