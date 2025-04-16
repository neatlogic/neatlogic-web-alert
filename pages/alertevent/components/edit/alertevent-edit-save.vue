<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="唯一键" labelPosition="left">
      <div class="text-grey">帮助：唯一键值相同的告警将会收敛成一条告警</div>
      <TsFormCheckbox
        :dataList="attrList"
        valueName="name"
        textName="label"
        :value="configLocal.uniqueAttrList.map(d => d.name)"
        @on-change="selectAttr"
      ></TsFormCheckbox>
      <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">已选属性</Divider>
      <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
    </TsFormItem>
    <TsFormItem v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" label="告警特征" labelPosition="left">
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
      <div class="text-grey">
        帮助：告警特征会对属性值进行正则替换，最后再组合成唯一键。可以选择多个告警特征，每个告警特征只会作用于其关联属性，如果其关联属性不属于唯一键成员，此告警特征将不生效。
      </div>
    </TsFormItem>
    <TsFormItem label="默认状态" labelPosition="left">
      <TsFormSelect
        v-model="configLocal.defaultStatus"
        :dataList="statusList"
        valueName="name"
        textName="label"
        :transfer="true"
      ></TsFormSelect>
      <div class="text-grey">帮助：告警事件创建时的默认状态</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
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
