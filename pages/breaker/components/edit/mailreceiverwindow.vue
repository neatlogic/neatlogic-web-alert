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
        windowSize: 1,
        windowUnit: 'minute',
        threshold: 10,
        collectLimit: 1000,
        ...(this.value || {})
      },
      formConfig: {
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
          desc: this.$t('term.alert.mailreceiverthresholddesc')
        },
        collectLimit: {
          type: 'number',
          label: this.$t('term.alert.collectlimit'),
          min: 1,
          validateList: ['required'],
          desc: this.$t('term.alert.collectlimitdesc')
        }
      }
    };
  },
  methods: {
    valid() {
      return this.$refs.form && this.$refs.form.valid();
    },
    getConfig() {
      return this.currentConfig;
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
