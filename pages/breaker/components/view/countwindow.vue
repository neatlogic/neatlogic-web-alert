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
        <div v-if="stateData.collectError" class="text-error mt-xs">{{ $t('term.alert.collectexception', { target: stateData.collectError }) }}</div>
        <div v-if="stateData.flushError" class="text-error mt-xs">{{ $t('term.alert.aggregateexception', { target: stateData.flushError }) }}</div>
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
    openDurationText() {
      return `${this.displayValue(this.config.openDuration)}${this.getUnitText(this.config.openDurationUnit)}`;
    },
    collectLimitText() {
      return this.displayValue(this.config.collectLimit);
    },
    dimensionText() {
      const dimensionTextMap = {
        alertType: this.$t('term.alert.alerttype'),
        alertLevel: this.$t('term.alert.alertlevel'),
        event: this.$t('term.alert.event'),
        handler: this.$t('term.alert.plugintype'),
        handlerInstance: this.$t('term.alert.plugininstance'),
        source: this.$t('term.alert.alertsource'),
        worker: this.$t('term.alert.worker'),
        workerTeam: this.$t('term.alert.workerteam')
      };
      return (this.config.dimensionList || []).map(d => dimensionTextMap[d] || d).join(', ') || '-';
    },
    summaryText() {
      return this.$t('term.alert.countwindowsummary', {
        handler: this.handlerText,
        dimension: this.dimensionText,
        window: this.windowText,
        threshold: this.thresholdText,
        duration: this.openDurationText,
        aggregate: this.config.enableAggregate === 1 ? this.$t('term.alert.aggregateenabled') : this.$t('term.alert.aggregatenotenabled'),
        collectPart: this.config.enableAggregate === 1 ? this.$t('term.alert.countwindowcollectpart', { collectLimit: this.collectLimitText }) : ''
      });
    },
    stateSummaryText() {
      return this.$t('term.alert.countwindowstatesummary', {
        collectCount: this.displayValue(this.stateData.collectCount),
        dropCount: this.displayValue(this.stateData.collectDropCount),
        baselinePart: this.stateData.baselineAlertId ? this.$t('term.alert.countwindowbaselinepart', { baselineAlertId: this.stateData.baselineAlertId }) : '',
        collectLimitPart: this.config.enableAggregate === 1 ? this.$t('term.alert.countwindowcollectlimitpart', { collectLimit: this.collectLimitText }) : ''
      });
    }
  }
};
</script>
