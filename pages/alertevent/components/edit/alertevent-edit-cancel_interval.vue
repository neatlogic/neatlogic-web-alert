<template>
  <div
    class="radius-md"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <EditBase :handler="handler"></EditBase>
    <TsFormItem label="定时插件" labelPosition="left">
      <TsFormSelect
        v-model="configLocal.intervalHandlerIdList"
        url="/api/rest/alert/event/handler/list"
        :params="handlerSearchParams"
        transfer
        border="border"
        valueName="id"
        textName="name"
        multiple
        :validateList="['required']"
        @on-change="changeIntervalHandler"
      ></TsFormSelect>
      <div class="text-grey">选择当前告警类型下需要取消的一个或多个定时调度插件。</div>
    </TsFormItem>
    <Alert v-if="error" type="error">{{ error }}</Alert>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  extends: AlertEventBase,
  data() {
    return {
      error: ''
    };
  },
  created() {
    if (this.$utils.isEmpty(this.configLocal)) {
      this.configLocal = {};
    }
    if (!this.configLocal.intervalHandlerIdList) {
      this.$set(this.configLocal, 'intervalHandlerIdList', []);
    }
  },
  methods: {
    async valid() {
      if (!this.configLocal.intervalHandlerIdList || this.configLocal.intervalHandlerIdList.length === 0) {
        this.error = '请选择定时插件';
        return false;
      }
      return true;
    },
    changeIntervalHandler(value, optionList) {
      this.configLocal.intervalHandlerIdList = value || [];
      this.error = '';
    }
  },
  computed: {
    handlerSearchParams() {
      return {
        alertType: this.alertType.id,
        event: this.event.name,
        handler: 'INTERVAL'
      };
    }
  }
};
</script>
<style lang="less"></style>
