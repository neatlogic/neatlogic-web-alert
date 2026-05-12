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
          label: '统计窗口',
          min: 1,
          validateList: ['required']
        },
        windowUnit: {
          type: 'radio',
          label: '窗口单位',
          validateList: ['required'],
          dataList: [
            { value: 'second', text: '秒' },
            { value: 'minute', text: '分钟' },
            { value: 'hour', text: '小时' }
          ]
        },
        threshold: {
          type: 'number',
          label: '触发阈值',
          min: 1,
          validateList: ['required'],
          desc: '同一邮件插件实例、相同实际收件人列表在统计窗口内超过该次数后进入聚合熔断。'
        },
        collectLimit: {
          type: 'number',
          label: '收集上限',
          min: 1,
          validateList: ['required'],
          desc: '熔断收集期间最多收集的告警数量，超过上限后不再收集新的告警，只记录丢弃数量。'
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
