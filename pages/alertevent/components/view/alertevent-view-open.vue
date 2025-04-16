<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="打开方式" labelPosition="left" style="margin:0px !important">
      <span>{{ configLocal.openType === 'id' ? 'id' : '唯一键' }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.openType === 'uniquekey'"
      style="margin:0px !important"
      label="唯一键"
      labelPosition="left"
    >
      <div v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length> 0">
        <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      </div>
      <div v-else class="text-grey">-</div>
    </TsFormItem>
    <TsFormItem label="同时打开子告警" labelPosition="left" style="margin:0px !important">
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
      label="打开数量"
      labelPosition="left"
    >
      <span class="text-grey">打开了</span><span class="mr-xs ml-xs"><b>{{ handler.result.openCount }}</b></span><span class="text-grey">个告警</span>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
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
      if (this.configLocal.openType === 'id') {
        return '关闭当前告警';
      } else if (this.configLocal.openType === 'uniquekey') {
        return '打开唯一键相同的所有告警';
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
