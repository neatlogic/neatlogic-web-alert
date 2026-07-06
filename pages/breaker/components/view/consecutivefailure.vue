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
      v-if="mode === 'audit'"
      :label="$t('term.alert.breakerstate')"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <span>{{ $t('term.alert.consecutivefailurestatesummary', { failureCount: displayValue(stateData.failureCount || 0) }) }}</span>
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
    handlerText() {
      return this.policy.policyHandlerLabel || this.policy.policyHandler || this.$t('term.alert.currentpolicy');
    },
    scopeText() {
      const scopeTextMap = {
        handlerInstance: this.$t('term.alert.plugininstance'),
        handler: this.$t('term.alert.plugintype')
      };
      return scopeTextMap[this.config.scope] || this.config.scope || '-';
    },
    failureThresholdText() {
      return this.displayValue(this.config.failureThreshold);
    },
    openDurationText() {
      return `${this.displayValue(this.config.openDuration)}${this.getUnitText(this.config.openDurationUnit)}`;
    },
    summaryText() {
      return this.$t('term.alert.consecutivefailuresummary', {
        handler: this.handlerText,
        scope: this.scopeText,
        failureThreshold: this.failureThresholdText,
        duration: this.openDurationText
      });
    }
  }
};
</script>
