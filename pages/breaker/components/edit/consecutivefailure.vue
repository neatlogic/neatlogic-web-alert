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
          label: '统计范围',
          validateList: ['required'],
          dataList: [
            { value: 'handlerInstance', text: '插件实例' },
            { value: 'handler', text: '插件类型' }
          ],
          desc: '选择“插件实例”时按每个事件插件配置独立统计；选择“插件类型”时同类插件共用连续失败计数。'
        },
        failureThreshold: {
          type: 'number',
          label: '连续失败阈值',
          min: 1,
          validateList: ['required'],
          desc: '最近连续失败次数达到该值后进入熔断。由于熔断判断发生在插件执行前，因此达到阈值后的下一次触发会被熔断。'
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
