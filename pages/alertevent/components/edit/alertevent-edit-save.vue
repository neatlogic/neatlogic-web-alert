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
    <TsFormItem :label="$t('term.alert.uniquekey')" labelPosition="left">
      <div class="text-grey">{{ $t('term.alert.uniquealertconvergehelp') }}</div>
      <TsFormCheckbox
        :dataList="attrList"
        valueName="name"
        textName="label"
        :value="configLocal.uniqueAttrList.map(d => d.name)"
        @on-change="selectAttr"
      ></TsFormCheckbox>
      <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">{{ $t('term.alert.selectedattr') }}</Divider>
      <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
    </TsFormItem>
    <TsFormItem v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" :label="$t('term.alert.alertsign')" labelPosition="left">
      <TsFormSelect
        v-model="configLocal.ruleList"
        url="/api/rest/alert/rule/list"
        :params="{ isActive: 1 }"
        transfer
        border="border"
        valueName="id"
        textName="label"
        multiple
      ></TsFormSelect>
      <div class="text-grey">{{ $t('term.alert.alertsignhelp') }}</div>
    </TsFormItem>
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
    TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
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
