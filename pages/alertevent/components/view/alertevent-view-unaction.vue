<template>
  <div
    class="padding-md radius-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler"></ViewBase>
    <TsFormItem :label="$t('dialog.title.deletetarget', { target: $t('page.action') })" labelPosition="left">
      <div>
        <Tag v-for="(action, index) in actionDataList" :key="index">
          {{ action.label }}
        </Tag>
      </div>
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
    return { actionDataList: [] };
  },
  beforeCreate() {},
  created() {
    this.getActionByNameList();
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
    getActionByNameList() {
      if (this.configLocal.actionList && this.configLocal.actionList.length > 0) {
        this.$api.alert.action.searchAction({ defaultValue: this.configLocal.actionList }).then(res => {
          this.actionDataList = res.Return;
        });
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
