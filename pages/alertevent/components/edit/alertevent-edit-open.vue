<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="打开方式" labelPosition="left">
      <TsFormRadio
        v-model="configLocal.openType"
        :dataList="typeList"
      ></TsFormRadio>
    </TsFormItem>
    <TsFormItem v-if="configLocal.openType === 'uniquekey'" label="唯一属性" labelPosition="left">
      <TsFormCheckbox
        :dataList="attrList"
        valueName="name"
        textName="label"
        :value="configLocal.uniqueAttrList.map(d => d.name)"
        @on-change="selectAttr"
      ></TsFormCheckbox>
      <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">已选属性</Divider>
      <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      <div v-if="error" class="text-error">{{ error }}</div>
    </TsFormItem>
    <TsFormItem label="同时打开子告警" labelPosition="left">
      <TsFormSwitch
        v-model="configLocal.isCloseChildAlert"
        :showStatus="true"
        :trueValue="1"
        :falseValue="0"
        trueText="是"
        falseText="否"
      ></TsFormSwitch>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      typeList: [
        { value: 'id', text: '打开当前告警' },
        { value: 'uniquekey', text: '打开唯一键相同的所有告警' }
      ],
      attrList: [],
      error: ''
    };
  },
  beforeCreate() {},
  created() {
    if (!this.configLocal.openType) {
      this.$set(this.configLocal, 'openType', []);
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
        this.error = '请至少选择一个属性';
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
