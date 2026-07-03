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
    <TsFormItem :label="$t('term.alert.closemethod')" labelPosition="left">
      <TsFormRadio v-model="configLocal.closeType" :dataList="typeList"></TsFormRadio>
    </TsFormItem>
    <TsFormItem v-if="configLocal.closeType === 'uniquekey'" :label="$t('term.alert.uniqueattr')" labelPosition="left">
      <TsFormCheckbox
        :dataList="attrList"
        valueName="name"
        textName="label"
        :value="configLocal.uniqueAttrList.map(d => d.name)"
        @on-change="selectAttr"
      ></TsFormCheckbox>
      <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">{{ $t('term.alert.selectedattr') }}</Divider>
      <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      <div v-if="error" class="text-error">{{ error }}</div>
    </TsFormItem>
    <TsFormItem v-if="configLocal.closeType === 'uniquekey' && configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" :label="$t('term.alert.alertsign')" labelPosition="left">
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
    <TsFormItem :label="$t('term.alert.closesubalert')" labelPosition="left">
      <TsFormSwitch
        v-model="configLocal.isCloseChildAlert"
        :showStatus="true"
        :trueValue="1"
        :falseValue="0"
        :trueText="$t('page.yes')"
        :falseText="$t('page.no')"
      ></TsFormSwitch>
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
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      typeList: [
        { value: 'id', text: this.$t('term.alert.closecurrentalert') },
        { value: 'uniquekey', text: this.$t('term.alert.closesameuniquekeyalert') }
      ],
      attrList: [],
      error: ''
    };
  },
  beforeCreate() {},
  created() {
    if (!this.configLocal.closeType) {
      this.$set(this.configLocal, 'closeType', 'id');
    }
    if (!this.configLocal.uniqueAttrList) {
      this.$set(this.configLocal, 'uniqueAttrList', []);
    }
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
    async valid() {
      if (this.configLocal.closeType === 'uniquekey' && this.configLocal.uniqueAttrList.length === 0) {
        this.error = this.$t('term.alert.selectoneattr');
        return false;
      }
      return true;
    },
    selectAttr(val, options) {
      this.$set(this.configLocal, 'uniqueAttrList', options);
      this.error = '';
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
