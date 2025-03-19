<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <div>
      <div class="text-grey">帮助：唯一键值相同的告警将会收敛成一条告警</div>
      <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">已选属性</Divider>
      <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
    </div>
    <div v-if="configLocal.result">
      <Divider orientation="left">创建结果</Divider>
      <div>
        <span class="text-grey mr-xs">处理结果</span>
        <span :class="{ 'text-success': configLocal.result.status === 'succeed', 'text-error': configLocal.result.status === 'failed' }">{{ configLocal.result.status }}</span>
        <span v-if="configLocal.result.alertId" class="text-grey ml-sm mr-xs">告警</span>
        <span v-if="configLocal.result.alertId" class="text-href" @click="showAlert(configLocal.result.alertId)">{{ configLocal.result.alertTitle }}</span>
        <span v-if="configLocal.result.fromAlertId" class="text-grey ml-sm mr-xs">归并到告警</span>
        <span v-if="configLocal.result.fromAlertId" class="text-href" @click="showAlert(configLocal.result.fromAlertId)">{{ configLocal.result.fromAlertTitle }}</span>
      </div>
      <AlertView v-if="isShowAlert" :id="currentAlertId" @close="isShowAlert = false"></AlertView>
    </div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    AlertView: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-dialog.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      isShowAlert: false,
      currentAlertId: null
    };
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
