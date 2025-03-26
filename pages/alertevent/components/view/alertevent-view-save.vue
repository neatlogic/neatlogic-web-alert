<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem
      v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0"
      label="唯一键"
      labelPosition="left"
    >
      <div>
        <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.defaultStatus"
      label="默认状态"
      labelPosition="left"
    >
      <div v-if="statusData">
        <Badge :color="statusData.color" :text="statusData.label"></Badge>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.result"
      label="处理结果"
      style="margin: 0px !important"
      labelPosition="left"
    ><div>
      <span :class="{ 'text-success': configLocal.result.status === 'succeed', 'text-error': configLocal.result.status === 'failed' }">{{ configLocal.result.status }}</span>
      <span v-if="configLocal.result.alertId" class="text-grey ml-sm mr-xs">告警</span>
      <span v-if="configLocal.result.alertId" class="text-href" @click="showAlert(configLocal.result.alertId)">{{ configLocal.result.alertTitle }}</span>
      <span v-if="configLocal.result.fromAlertId" class="text-grey ml-sm mr-xs">归并到告警</span>
      <span v-if="configLocal.result.fromAlertId" class="text-href" @click="showAlert(configLocal.result.fromAlertId)">{{ configLocal.result.fromAlertTitle }}</span>
    </div>
    </TsFormItem>
    <AlertView v-if="isShowAlert" :id="currentAlertId" @close="isShowAlert = false"></AlertView>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    AlertView: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-dialog.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      isShowAlert: false,
      currentAlertId: null,
      statusData: null
    };
  },
  beforeCreate() {},
  created() {
    if (this.configLocal.defaultStatus) {
      this.getAlertStatus(this.configLocal.defaultStatus);
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
    },
    showAlert(alertId) {
      this.isShowAlert = true;
      this.currentAlertId = alertId;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
