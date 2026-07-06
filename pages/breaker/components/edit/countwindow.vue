<template>
  <div>
    <TsForm ref="form" v-model="currentConfig" :item-list="formConfig"></TsForm>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm')
  },
  props: {
    value: { type: Object }
  },
  data() {
    return {
      currentConfig: {
        dimensionList: ['handlerInstance'],
        windowSize: 1,
        windowUnit: 'minute',
        threshold: 100,
        openDuration: 10,
        openDurationUnit: 'minute',
        enableAggregate: 0,
        collectLimit: 1000,
        ...(this.value || {})
      }
    };
  },
  methods: {
    valid() {
      return this.$refs.form && this.$refs.form.valid();
    },
    getConfig() {
      const config = { ...this.currentConfig };
      if (config.enableAggregate !== 1) {
        delete config.collectLimit;
      }
      return config;
    }
  },
  computed: {
    formConfig() {
      return {
        dimensionList: {
          type: 'select',
          label: this.$t('term.alert.statisticsdimension'),
          multiple: true,
          transfer: true,
          validateList: ['required'],
          dataList: [
            { value: 'alertType', text: this.$t('term.alert.alerttype') },
            { value: 'alertLevel', text: this.$t('term.alert.alertlevel') },
            { value: 'event', text: this.$t('term.alert.event') },
            { value: 'handler', text: this.$t('term.alert.plugintype') },
            { value: 'handlerInstance', text: this.$t('term.alert.plugininstance') },
            { value: 'source', text: this.$t('term.alert.alertsource') },
            { value: 'worker', text: this.$t('term.alert.worker') },
            { value: 'workerTeam', text: this.$t('term.alert.workerteam') }
          ],
          desc: this.$t('term.alert.dimensiondesc')
        },
        windowSize: {
          type: 'number',
          label: this.$t('term.alert.statisticswindow'),
          min: 1,
          validateList: ['required']
        },
        windowUnit: {
          type: 'radio',
          label: this.$t('term.alert.windowunit'),
          validateList: ['required'],
          dataList: [
            { value: 'second', text: this.$t('term.alert.second') },
            { value: 'minute', text: this.$t('term.alert.minute') },
            { value: 'hour', text: this.$t('term.alert.hour') }
          ]
        },
        threshold: {
          type: 'number',
          label: this.$t('term.alert.triggerthreshold'),
          min: 1,
          validateList: ['required'],
          desc: this.$t('term.alert.thresholdcountwindowdesc')
        },
        openDuration: {
          type: 'number',
          label: this.$t('term.alert.breakerduration'),
          min: 1,
          validateList: ['required']
        },
        openDurationUnit: {
          type: 'radio',
          label: this.$t('term.alert.durationunit'),
          validateList: ['required'],
          dataList: [
            { value: 'second', text: this.$t('term.alert.second') },
            { value: 'minute', text: this.$t('term.alert.minute') },
            { value: 'hour', text: this.$t('term.alert.hour') }
          ]
        },
        enableAggregate: {
          type: 'radio',
          label: this.$t('term.alert.enableaggregate'),
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ],
          desc: this.$t('term.alert.aggregateenabledesc')
        },
        collectLimit: {
          type: 'number',
          label: this.$t('term.alert.collectlimit'),
          min: 1,
          validateList: ['required'],
          isHidden: this.currentConfig.enableAggregate !== 1,
          desc: this.$t('term.alert.collectlimitdesc')
        }
      };
    }
  },
  watch: {
    currentConfig: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true
    }
  }
};
</script>
<style lang="less"></style>
