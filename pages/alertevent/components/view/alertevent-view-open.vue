<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <TsFormItem :label="$t('term.alert.openmethod')" labelPosition="left" style="margin:0px !important">
      <span>{{ getOpenType() }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.openType === 'uniquekey'"
      style="margin:0px !important"
      :label="$t('term.alert.uniquekey')"
      labelPosition="left"
    >
      <div v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length> 0">
        <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      </div>
      <div v-else class="text-grey">-</div>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.opensubalert')" labelPosition="left" style="margin:0px !important">
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
      :label="$t('term.alert.opencount')"
      labelPosition="left"
    >
      <span class="text-grey">{{ $t('term.alert.openedalertcount', { target: handler.result.openCount }) }}</span>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue'),
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
    getOpenType() {
      if (this.configLocal.openType === 'id') {
        return this.$t('term.alert.opencurrentalert');
      } else if (this.configLocal.openType === 'uniquekey') {
        return this.$t('term.alert.opensameuniquekeyalert');
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
