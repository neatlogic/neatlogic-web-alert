<template>
  <div>
    <div
      v-for="(condition, index) in configLocal.conditionList"
      :key="index"
      class="padding-md radius-md"
      :class="{
        padding: isChild,
        'bg-op': level % 2 === 0,
        'bg-grey': level % 2 !== 0
      }"
    >
      <ConditionGroup
        v-model="condition.rule"
        :readonly="true"
        :padding="false"
        :level="level"
        :attrList="attrList"
      ></ConditionGroup>
      <div class="mt-md">
        <div class="handler-container">
          <Divider orientation="start"><h4 class="text-grey">{{ condition.handler.name }}</h4></Divider>
          <component
            :is="handlers && handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
            :ref="'pluginConfig' + index"
            :config="condition.handler.config"
            :event="event"
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
    };
  },
  beforeCreate() {},
  async created() {
    this.handlers = await import('@/commercial-module/alert/pages/alertevent/components/view/index.js');
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
      this.$api.alert.alertevent.listEventPlugin({eventName: this.event.name}).then(res => {
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
  computed: {},
  watch: {}
};
</script>
<style lang="less">
</style>
