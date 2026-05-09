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
        aggregateTitleTemplate: '[告警中心][聚合通知]触发告警通知次数限流条件：${windowSize}${windowUnitText}告警数量大于${threshold}次',
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
        },
        aggregateTitleTemplate: {
          type: 'textarea',
          label: '聚合邮件标题',
          maxlength: 500,
          desc: '支持变量：${groupName}处理组，${windowSize}统计窗口，${windowUnitText}窗口单位，${threshold}触发阈值，${collectCount}收集告警数，${collectDropCount}超限未收集数。'
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
