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
        ...(this.value || {})
      },
      formConfig: {
        dimensionList: {
          type: 'select',
          label: '统计维度',
          multiple: true,
          transfer: true,
          validateList: ['required'],
          dataList: [
            { value: 'alertType', text: '告警类型' },
            { value: 'alertLevel', text: '告警级别' },
            { value: 'event', text: '事件' },
            { value: 'handler', text: '插件类型' },
            { value: 'handlerInstance', text: '插件实例' },
            { value: 'source', text: '告警来源' }
          ],
          desc: '熔断插件会根据所选维度生成熔断标记，并以此标记进行熔断判断。例如：选择“插件实例”维度时，熔断插件会根据每个插件实例的触发次数来判断是否进入熔断状态。'
        },
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
          desc: '统计窗口内触发次数超过该值后进入熔断'
        },
        openDuration: {
          type: 'number',
          label: '熔断时长',
          min: 1,
          validateList: ['required']
        },
        openDurationUnit: {
          type: 'radio',
          label: '时长单位',
          validateList: ['required'],
          dataList: [
            { value: 'second', text: '秒' },
            { value: 'minute', text: '分钟' },
            { value: 'hour', text: '小时' }
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
