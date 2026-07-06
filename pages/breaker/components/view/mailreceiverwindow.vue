<template>
  <div
    class="padding-md radius-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem
      :label="$t('term.alert.breakerpolicy')"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ summaryText }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="mode === 'audit' && hasStateData"
      :label="$t('term.alert.breakerstate')"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div>
        <span>{{ stateSummaryText }}</span>
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
        second: this.$t('term.alert.second'),
        minute: this.$t('term.alert.minute'),
        hour: this.$t('term.alert.hour')
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
      return this.policy.policyHandlerLabel || this.policy.policyHandler || this.$t('term.alert.currentpolicy');
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
    },
    summaryText() {
      return this.$t('term.alert.mailreceiverwindowsummary', {
        handler: this.handlerText,
        window: this.windowText,
        threshold: this.thresholdText,
        collectLimit: this.collectLimitText
      });
    },
    stateSummaryText() {
      return this.$t('term.alert.mailreceiverwindowstatesummary', {
        groupName: this.displayValue(this.stateData.groupName),
        alertCount: this.displayValue(this.alertCount),
        dropCount: this.displayValue(this.stateData.collectDropCount || 0)
      });
    }
  }
};
</script>
