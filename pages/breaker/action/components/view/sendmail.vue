<template>
  <div>
    <TsFormItem :label="$t('page.recipient')" labelPosition="left" style="margin:0px !important;">
      <UserSelect v-model="config.toUserList" readonly multiple></UserSelect>
    </TsFormItem>
    <TsFormItem
      v-if="config.ccUserList && config.ccUserList.length > 0"
      :label="$t('page.cc')"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <UserSelect v-model="config.ccUserList" readonly multiple></UserSelect>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.mailtitle')" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.title || '-' }}</span>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.mailcontent')" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.content || $t('term.alert.defaultalarmlist') }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="actionError"
      :label="$t('term.alert.actionexecutionexception')"
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
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
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
