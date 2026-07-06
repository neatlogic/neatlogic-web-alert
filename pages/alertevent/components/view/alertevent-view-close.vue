<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <TsFormItem :label="$t('term.alert.closemethod')" labelPosition="left" style="margin:0px !important">
      <span>{{ getCloseType() }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.closeType === 'uniquekey'"
      style="margin:0px !important"
      :label="$t('term.alert.uniquekey')"
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
      :label="$t('term.alert.alertsign')"
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
    <TsFormItem :label="$t('term.alert.closesubalert')" labelPosition="left" style="margin:0px !important">
      <span v-if="configLocal.isCloseChildAlert" class="text-success">{{ $t('page.yes') }}</span>
      <span v-else class="text-grey">{{ $t('page.no') }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.status"
      style="margin:0px !important"
      :label="$t('term.alert.dealresult')"
      labelPosition="left"
    >
      <span :class="{ 'text-success': handler.status === 'succeed', 'text-error': handler.status === 'failed' }">{{ handler.statusName }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result"
      style="margin:0px !important"
      :label="$t('term.alert.closecount')"
      labelPosition="left"
    >
      <span class="text-grey">{{ $t('term.alert.closedalertcount', { target: handler.result.closeCount }) }}</span>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue'),
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
        return this.$t('term.alert.closecurrentalert');
      } else if (this.configLocal.closeType === 'uniquekey') {
        return this.$t('term.alert.closesameuniquekeyalert');
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
