<template>
  <div
    class="radius-md"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <EditBase :handler="handler"></EditBase>
    <AlertConvergenceConfig
      :attribute-help="$t('term.alert.uniquealertconvergehelp')"
      :attributes="attrList"
      :selected-attributes="configLocal.uniqueAttrList || []"
      :show-signatures="!!configLocal.uniqueAttrList?.length"
      :signature-ids="configLocal.ruleList || []"
      :signature-select="signatureSelect"
      @change-attributes="selectAttr"
      @change-signatures="$set(configLocal, 'ruleList', $event)"
    ></AlertConvergenceConfig>
    <TsFormItem :label="$t('term.alert.defaultstatus')" labelPosition="left">
      <TsFormSelect
        v-model="configLocal.defaultStatus"
        :dataList="statusList"
        valueName="name"
        textName="label"
        :transfer="true"
      ></TsFormSelect>
      <div class="text-grey">{{ $t('term.alert.defaultstatushelp') }}</div>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.serialsave')" labelPosition="left">
      <TsFormSwitch v-model="configLocal.serialSave" :trueValue="true" :falseValue="false"></TsFormSwitch>
      <div class="text-grey">{{ $t('term.alert.serialsavehelp') }}</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    AlertConvergenceConfig: () => import('./components/alert-convergence-config.vue'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
      signatureSelect: { url: '/api/rest/alert/rule/list', params: { isActive: 1 } },
      statusList: []
    };
  },
  beforeCreate() {},
  created() {
    if (this.$utils.isEmpty(this.configLocal)) {
      this.configLocal = { uniqueAttrList: [], ruleList: [] };
    }
    this.listAllStatus();
    this.listAlertAttrList();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    listAllStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    },
    selectAttr(val, options) {
      this.$set(this.configLocal, 'uniqueAttrList', options);
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.attrList = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
