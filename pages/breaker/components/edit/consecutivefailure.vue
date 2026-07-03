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
        scope: 'handlerInstance',
        failureThreshold: 3,
        openDuration: 10,
        openDurationUnit: 'minute',
        ...(this.value || {})
      },
      formConfig: {
        scope: {
          type: 'radio',
          label: this.$t('term.alert.statisticsscope'),
          validateList: ['required'],
          dataList: [
            { value: 'handlerInstance', text: this.$t('term.alert.plugininstance') },
            { value: 'handler', text: this.$t('term.alert.plugintype') }
          ],
          desc: this.$t('term.alert.scopedesc')
        },
        failureThreshold: {
          type: 'number',
          label: this.$t('term.alert.failurethreshold'),
          min: 1,
          validateList: ['required'],
          desc: this.$t('term.alert.failurethresholddesc')
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
<style lang="less"></style>
