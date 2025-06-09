<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="关闭方式" labelPosition="left" style="margin:0px !important">
      <span>{{ configLocal.closeType === 'id' ? 'id' : '唯一键' }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.closeType === 'uniquekey'"
      style="margin:0px !important"
      label="唯一键"
      labelPosition="left"
    >
      <div v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length> 0">
        <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      </div>
      <div v-else class="text-grey">-</div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.closeType === 'uniquekey' && configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0 && configLocal.ruleList && configLocal.ruleList.length > 0"
      style="margin: 0px !important"
      label="告警特征"
      labelPosition="left"
    >
      <TsFormSelect
        :value="configLocal.ruleList"
        url="/api/rest/alert/rule/list"
        :params="{ isActive: 1 }"
        transfer
        border="border"
        valueName="id"
        textName="label"
        multiple
        readonly
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem label="同时关闭子告警" labelPosition="left" style="margin:0px !important">
      <span v-if="configLocal.isCloseChildAlert" class="text-success">{{ $t('page.yes') }}</span>
      <span v-else class="text-grey">{{ $t('page.no') }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.status"
      style="margin:0px !important"
      label="处理结果"
      labelPosition="left"
    >
      <span :class="{ 'text-success': handler.status === 'succeed', 'text-error': handler.status === 'failed' }">{{ handler.statusName }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result"
      style="margin:0px !important"
      label="关闭数量"
      labelPosition="left"
    >
      <span class="text-grey">关闭了</span><span class="mr-xs ml-xs"><b>{{ handler.result.closeCount }}</b></span><span class="text-grey">个告警</span>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    getCloseType() {
      if (this.configLocal.closeType === 'id') {
        return '关闭当前告警';
      } else if (this.configLocal.closeType === 'uniquekey') {
        return '关闭唯一键相同的所有告警';
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
