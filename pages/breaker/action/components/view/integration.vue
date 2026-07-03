<template>
  <div>
    <TsFormItem :label="$t('page.integration')" labelPosition="left" style="margin:0px !important;">
      <span>{{ integrationName }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="config.paramMapping && config.paramMapping.length > 0"
      :label="$t('term.alert.parammapping')"
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
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    action: { type: Object, default: () => ({}) },
    actionAudit: { type: Object, default: null }
  },
  data() {
    return {
      integrationData: null
    };
  },
  created() {
    this.getIntegrationByUuid(this.config.integrationUuid);
  },
  methods: {
    getIntegrationByUuid(uuid) {
      this.integrationData = null;
      if (!uuid) {
        return;
      }
      this.$api.framework.integration.getIntegrationByUuid({ uuid: uuid }).then(res => {
        this.integrationData = res.Return || null;
      }).catch(() => {
        this.integrationData = null;
      });
    }
  },
  computed: {
    config() {
      return this.action.config || {};
    },
    integrationName() {
      return (this.integrationData && this.integrationData.name) || this.config.integrationUuid || '-';
    },
    actionError() {
      return this.actionAudit && this.actionAudit.status === 'failed' ? this.actionAudit.error : '';
    }
  },
  watch: {
    'config.integrationUuid'(uuid) {
      this.getIntegrationByUuid(uuid);
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
