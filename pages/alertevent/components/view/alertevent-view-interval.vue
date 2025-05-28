<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <div v-if="mode === 'edit'">
      <div v-for="(interval, index) in configLocal.intervalList" :key="index" :class="{ 'mt-md': index > 0 }">
        <div class="action-group">
          <div class="action-item text-grey">当前步骤开始</div>
          <div class="action-item">
            <b>{{ interval.delayMinute }}</b>
          </div>
          <div class="action-item text-grey">分钟后执行</div>
          <div class="action-item text-grey">重复</div>
          <div class="action-item"><b>{{ interval.repeatCount }}</b></div>
          <div class="action-item text-grey">次</div>
          <div class="action-item text-grey">每次间隔</div>
          <div class="action-item"><b>{{ interval.intervalMinute }}</b></div>
          <div class="action-item text-grey">分钟</div>
        </div>
        <div class="mt-md">
          <Divider orientation="start">
            <h4 class="text-grey" :class="interval.handler.icon">{{ interval.handler.name }}</h4>
          </Divider>
          <component
            :is="handlers && handlers[interval.handler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[interval.handler.handler.toLowerCase() + '_eventhandler']"
            :ref="'pluginConfig' + index"
            :handler="interval.handler"
            :event="event"
            :isChild="true"
            :level="level + 1"
          ></component>
        </div>
      </div>
    </div>
    <div v-else-if="mode === 'audit' && handler.result">
      <div v-if="handler.result.nextStartTime" class="action-group">
        <div class="action-item text-grey">下次执行时间</div>
        <div class="action-item">
          {{ handler.result.nextStartTime | formatDate }}
        </div>
        <div class="action-item text-grey">需执行</div>
        <div class="action-item">{{ handler.result.leftExecuteCount }}</div>
        <div class="action-item text-grey">次</div>
        <div v-if="handler.result.intervalMinute" class="action-item text-grey">每次间隔</div>
        <div v-if="handler.result.intervalMinute" class="action-item">{{ handler.result.intervalMinute }}</div>
        <div v-if="handler.result.intervalMinute" class="action-item text-grey">分钟</div>
      </div>
      <div v-else class="text-grey">定时作业已经全部执行完毕</div>
    </div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
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
    const handlers = await import('@/community-module/alert/pages/alertevent/components/view/index.js');
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
    addInterval() {
      this.configLocal.intervalList.push({
        delayMinute: 0,
        repeatCount: 0
      });
    },
    addPlugin(interval, plugin) {
      const handlerData = {
        uuid: this.$utils.setUuid(),
        name: plugin.label,
        handler: plugin.name,
        icon: plugin.icon,
        isActive: 1
      };
      this.$set(interval, 'handler', handlerData);
      this.error = '';
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin({ eventName: this.event.name, parentPlugin: this.handler.handler }).then(res => {
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
<style lang="less" scoped>
.handler-container {
  position: relative;
  width: 100%;

  &:hover {
    .del-handler {
      display: block;
    }
  }

  .del-handler {
    display: none;
    z-index: 10;
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
  }
}
</style>
