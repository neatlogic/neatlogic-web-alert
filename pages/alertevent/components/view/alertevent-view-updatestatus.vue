<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <TsFormItem
      v-if="configLocal.status"
      style="margin: 0px !important"
      label="目标状态"
      labelPosition="left"
    >
      <div v-if="statusData">
        <Badge :color="statusData.color" :text="statusData.label"></Badge>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.status"
      style="margin: 0px !important"
      label="处理结果"
      labelPosition="left"
    ><div>
      <span
        :class="{
          'text-success': handler.status === 'succeed',
          'text-error': handler.status === 'failed'
        }"
      >{{ handler.statusName }}
      </span>
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
    return {
      statusData: null
    };
  },
  beforeCreate() {},
  created() {
    if (this.configLocal.status) {
      this.getAlertStatus(this.configLocal.status);
    }
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
    getAlertStatus(status) {
      this.$api.alert.status.getAlertStatusByName(status).then(res => {
        this.statusData = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
