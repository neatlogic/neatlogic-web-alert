<template>
  <div>
    <TsFormItem label="熔断插件" labelPosition="left" style="margin:0px !important;">
      <span>{{ policy.policyHandlerLabel || policy.policyHandler || '-' }}</span>
    </TsFormItem>
    <TsFormItem label="统计窗口" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.windowSize || '-' }}{{ getUnitText(config.windowUnit) }}</span>
    </TsFormItem>
    <TsFormItem label="触发阈值" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.threshold || '-' }}</span>
    </TsFormItem>
    <TsFormItem label="收集上限" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.collectLimit || '-' }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit' && hasStateData"
      label="聚合状态"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div>
        <span>处理组：{{ stateData.groupName || '-' }}</span>
        <span class="ml-md">告警数：{{ alertCount }}</span>
        <span class="ml-md">超限未收集：{{ stateData.collectDropCount || 0 }}</span>
      </div>
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
    hasStateData() {
      return Object.keys(this.stateData).length > 0;
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
