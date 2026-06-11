<template>
  <div>
    <TsFormItem label="集成" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.integrationUuid || '-' }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="config.paramMapping && config.paramMapping.length > 0"
      label="参数映射"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div>
        <div v-for="(item, index) in config.paramMapping" :key="index">
          <span class="text-grey">{{ item.name }}：</span>
          <span>{{ item.expression || '-' }}</span>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="actionError"
      label="执行异常"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <div class="text-error action-error">{{ actionError }}</div>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    action: { type: Object, default: () => ({}) },
    actionAudit: { type: Object, default: null }
  },
  computed: {
    config() {
      return this.action.config || {};
    },
    actionError() {
      return this.actionAudit && this.actionAudit.status === 'failed' ? this.actionAudit.error : '';
    }
  }
};
</script>
<style lang="less" scoped>
.action-error {
  white-space: normal;
  word-break: break-all;
}
</style>
