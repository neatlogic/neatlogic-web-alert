<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <div v-if="!configLocal.fromAlert">
      <div class="text-grey">帮助：唯一属性值相同的告警将会收敛成一条告警</div>
      <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">已选属性</Divider>
      <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
    </div>
    <div v-else>
      <div><span class="mr-xs">归并到告警</span><span class="text-href" @click="showAlert(configLocal.fromAlert.id)">{{ configLocal.fromAlert.title }}</span></div>
      <AlertView
        v-if="isShowAlert"
        :id="configLocal.fromAlert.id"
        @close="isShowAlert=false"
      ></AlertView>
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
      isShowAlert: false
    };
  },
  beforeCreate() {},
  created() {
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
    showAlert() {
      this.isShowAlert = true;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less">
</style>
