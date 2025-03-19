<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="关闭方式" labelPosition="left">
      <TsFormRadio
        ref="closeType"
        v-model="configLocal.closeType"
        :validateList="[{ name: 'required', message: ' ' }]"
        :dataList="typeList"
      ></TsFormRadio>
    </TsFormItem>
    <TsFormItem v-if="configLocal.closeType==='uniquekey'" label="唯一属性" labelPosition="left">
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
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      typeList: [
        { value: 'id', text: '仅关闭当前告警' },
        { value: 'uniquekey', text: '关闭唯一键相同的所有告警' }
      ],
      attrList: []
    };
  },
  beforeCreate() {},
  created() {
    if (!this.configLocal.closeType) {
      this.configLocal.closeType = 'id';
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
      return this.$refs.closeType && this.$refs.closeType.valid();
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
