<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="定时插件" labelPosition="left" style="margin:0px !important">
      <span v-if="intervalHandlerNameList.length > 0">
        <Tag v-for="(name, index) in intervalHandlerNameList" :key="index">{{ name }}</Tag>
      </span>
      <span v-else-if="configLocal.intervalHandlerIdList && configLocal.intervalHandlerIdList.length > 0">
        <Tag v-for="(id, index) in configLocal.intervalHandlerIdList" :key="index">#{{ id }}</Tag>
      </span>
      <span v-else class="text-grey">-</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.status"
      label="处理结果"
      labelPosition="left"
      style="margin:0px !important"
    >
      <span :class="{ 'text-success': handler.status === 'succeed', 'text-error': handler.status === 'failed' }">{{ handler.statusName }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result"
      label="取消结果"
      labelPosition="left"
      style="margin:0px !important"
    >
      <span class="text-grey">停止了</span>
      <span class="ml-xs mr-xs"><b>{{ handler.result.cancelled || 0 }}</b></span>
      <span class="text-grey">个作业</span>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  extends: AlertEventBase,
  data() {
    return {
      intervalHandlerNameList: []
    };
  },
  created() {
    this.getIntervalHandlerNameList();
  },
  methods: {
    getIntervalHandlerNameList() {
      const intervalHandlerIdList = this.configLocal.intervalHandlerIdList || [];
      if ((!this.alertType && !this.alertData) || !this.event || !this.event.name || intervalHandlerIdList.length === 0) {
        this.intervalHandlerNameList = [];
        return;
      }
      const type = this.alertType ? this.alertType.id : this.alertData.type;
      this.$api.alert.alertevent.listAlertEventHandler({
        alertType: type,
        event: this.event.name,
        handler: 'INTERVAL'
      }).then(res => {
        const handlerList = res.Return || [];
        const handlerMap = {};
        handlerList.forEach(item => {
          handlerMap[item.id] = item.name;
        });
        this.intervalHandlerNameList = intervalHandlerIdList.map(id => handlerMap[id]).filter(Boolean);
      });
    }
  }
};
</script>
<style lang="less"></style>
