<template>
  <div>
    <TsFormItem label="收件人" labelPosition="left" style="margin:0px !important;">
      <UserSelect v-model="config.toUserList" readonly multiple></UserSelect>
    </TsFormItem>
    <TsFormItem
      v-if="config.ccUserList && config.ccUserList.length > 0"
      label="抄送人"
      labelPosition="left"
      style="margin:0px !important;"
    >
      <UserSelect v-model="config.ccUserList" readonly multiple></UserSelect>
    </TsFormItem>
    <TsFormItem label="邮件标题" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.title || '-' }}</span>
    </TsFormItem>
    <TsFormItem label="邮件内容" labelPosition="left" style="margin:0px !important;">
      <span>{{ config.content || '默认告警列表' }}</span>
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
    action: { type: Object, default: () => ({}) }
  },
  computed: {
    config() {
      return this.action.config || {};
    }
  }
};
</script>
