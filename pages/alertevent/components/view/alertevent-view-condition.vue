<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <div
      v-for="(condition, index) in conditionList"
      :key="index"
    >
      <ConditionGroup
        v-model="condition.rule"
        :readonly="true"
        :padding="false"
        :level="level"
        :attrList="attrList"
      ></ConditionGroup>
      <div v-if="condition.hasOwnProperty('result')" class="mt-md">
        <span class="text-grey mr-sm"><b>判定结果</b></span>
        <span :class="{ 'text-success': condition.result, 'text-error': !condition.result }">{{ condition.result }}</span>
      </div>
      <div v-if="condition.handler" class="mt-md">
        <div class="handler-container">
          <Divider orientation="start">
            <h4 class="text-grey" :class="condition.handler.icon">{{ condition.handler.name }}</h4>
          </Divider>
          <component
            :is="handlers && handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
            :ref="'pluginConfig' + index"
            :handler="condition.handler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :level="level + 1"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
      pluginList: [],
      handlers: []
      //AlertEventViewer: null
    };
  },
  beforeCreate() {},
  async created() {
    const handlers = await import('@/commercial-module/alert/pages/alertevent/components/view/index.js');
    this.handlers = handlers.default;
    this.listEventPlugin();
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
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin({ eventName: this.event.name }).then(res => {
        this.pluginList = res.Return;
      });
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.attrList = res.Return;
      });
    }
  },
  filter: {},
  computed: {
    conditionList() {
      if (this.mode === 'audit') {
        return this.handler.result.conditionList;
      } else {
        return this.configLocal.conditionList; 
      }
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
