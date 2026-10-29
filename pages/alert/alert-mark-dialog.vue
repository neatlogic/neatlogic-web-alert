<template>
  <TsDialog v-bind="dialogConfig" :showCloseIcon="!isSaving" @on-close="close()">
    <template v-slot>
      <div class="mb-md">{{ $t(scope === 'match' ? 'term.alert.markmatchscope' : 'term.alert.markselectscope', { count: matchCount }) }}</div>
      <TsFormItem :label="$t('term.alert.markupdatemode')" labelPosition="left">
        <TsFormRadio v-model="mode" :dataList="modeList" :disabled="isSaving"></TsFormRadio>
      </TsFormItem>
      <TsFormItem :label="$t('page.tag')" labelPosition="left">
        <TsFormSelect
          ref="markSelect"
          v-model="markNameList"
          dynamicUrl="/api/rest/alert/mark/search"
          transfer
          :multiple="true"
          :allowCreate="true"
          :disabled="isSaving"
          :validateList="mode === 'append' ? ['required'] : []"
          valueName="name"
          textName="name"
          border="border"
        ></TsFormSelect>
        <div v-if="mode === 'replace' && markNameList.length === 0" class="text-danger mt-sm">{{ $t('term.alert.cleartargetalertmarks') }}</div>
      </TsFormItem>
    </template>
    <template v-slot:footer>
      <Button :disabled="isSaving" @click="close()">{{ $t('page.cancel') }}</Button>
      <Button
        type="primary"
        :loading="isSaving"
        :disabled="isSaving"
        @click="confirm()"
      >{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: 'AlertMarkDialog',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  props: {
    scope: { type: String, default: 'select' },
    idList: { type: Array, default: () => [] },
    searchParam: { type: Object, default: null },
    matchCount: { type: Number, default: 0 }
  },
  data() {
    return {
      dialogConfig: {
        title: this.$t('term.alert.batchupdatealertmark'),
        isShow: true,
        maskClose: false,
        width: 'small'
      },
      mode: 'append',
      markNameList: [],
      modeList: [
        { value: 'append', text: this.$t('page.append') },
        { value: 'replace', text: this.$t('page.replace') }
      ],
      isSaving: false
    };
  },
  methods: {
    // 保存期间保持弹窗和输入，成功时由父页面统一关闭并刷新。
    close(needRefresh) {
      if (this.isSaving && !needRefresh) {
        return;
      }
      this.$emit('close', needRefresh);
    },
    // 仅提交标签字段和固定目标，避免影响告警的状态及其他处理属性。
    async confirm() {
      if (this.isSaving) {
        return;
      }
      if (this.mode === 'append' && !this.$refs.markSelect.valid()) {
        return;
      }
      const params = { mode: this.mode, markNameList: this.markNameList.slice() };
      if (this.scope === 'match') {
        params.searchParam = this.searchParam;
      } else {
        params.idList = this.idList;
      }
      this.isSaving = true;
      try {
        const res = await this.$api.alert.alert.updateAlertMarkBatch(params);
        if (this.scope === 'match') {
          this.$Message.success(this.$t('term.alert.submittedbackendmarkupdate'));
        } else {
          const result = res.Return || {};
          const message = this.$t('term.alert.batchmarkupdateresult', {
            updated: result.updatedCount || 0,
            unchanged: result.unchangedCount || 0,
            skipped: result.skippedCount || 0,
            failed: result.failedCount || 0
          });
          if (result.failedCount > 0 || result.skippedCount > 0) {
            this.$Message.warning({ content: message, duration: 8 });
          } else {
            this.$Message.success(message);
          }
        }
        this.close(true);
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>
