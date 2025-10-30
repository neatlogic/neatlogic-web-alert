<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem
      v-if="integrationData"
      style="margin: 0px !important"
      label="集成"
      labelPosition="left"
      :labelWidth="90"
    >
      <span>
        {{ integrationData.name }}
      </span>
    </TsFormItem>
    <TsFormItem
      v-if="integrationData && paramList.length > 0"
      :labelWidth="90"
      label="参数映射"
      style="margin: 0px !important"
      labelPosition="left"
    >
      <div>
        <TsFormItem
          v-for="(param, index) in paramList"
          :key="index"
          labelPosition="top"
          :label="(param.description || param.name) + '(' + param.typeName + ')'"
        >
          <div style="line-height: 1">
            <code>{{ getExpression(param.name) }}</code>
          </div>
        </TsFormItem>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.interval"
      style="margin: 0px !important"
      label="调用间隔"
      labelPosition="left"
      :labelWidth="90"
    >
      <span>
        <span class="mr-xs">
          <b>{{ configLocal.interval }}</b>
        </span>
        <span class="text-grey">分钟</span>
      </span>
    </TsFormItem>
    <TsFormItem
      v-if="mode !== 'audit' && configLocal.successCallbackList && configLocal.successCallbackList.length > 0"
      :labelWidth="90"
      label="成功动作"
      labelPosition="left"
      style="margin: 0px !important"
    >
      <div>
        <div
          v-for="(selectedHandler, hindex) in configLocal.successCallbackList"
          :key="hindex"
          class="handler-container padding-md radius-md mb-md"
          :class="{
            'bg-grey': level % 2 === 0,
            'bg-op': level % 2 !== 0
          }"
        >
          <div>
            <span>
              <b class="text-grey">{{ hindex + 1 }}.{{ selectedHandler.name }}</b>
            </span>
          </div>
          <component
            :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            :handler="selectedHandler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :level="level + 1"
            :alertData="alertData"
          ></component>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="mode !== 'audit' && configLocal.failedCallbackList && configLocal.failedCallbackList.length > 0"
      :labelWidth="90"
      label="失败动作"
      labelPosition="left"
      style="margin: 0px !important"
    >
      <div>
        <div
          v-for="(selectedHandler, hindex) in configLocal.failedCallbackList"
          :key="hindex"
          class="handler-container padding-md radius-md mb-md"
          :class="{
            'bg-grey': level % 2 === 0,
            'bg-op': level % 2 !== 0
          }"
        >
          <div>
            <span>
              <b class="text-grey">{{ hindex + 1 }}.{{ selectedHandler.name }}</b>
            </span>
          </div>
          <component
            :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            :handler="selectedHandler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :alertData="alertData"
            :level="level + 1"
          ></component>
        </div>
      </div>
    </TsFormItem>
    <!--执行结果-->
    <TsFormItem
      v-if="mode === 'audit' && handler.status && handler.childAuditList && handler.childAuditList.length > 0"
      :labelWidth="90"
      :label="handler.status === 'succeed'?'成功动作':'失败动作'"
      labelPosition="left"
      style="margin: 0px !important"
    >
      <div>
        <div
          v-for="(selectedHandler, hindex) in handler.childAuditList"
          :key="hindex"
          class="handler-container padding-md radius-md mb-md"
          :class="{
            'bg-grey': level % 2 === 0,
            'bg-op': level % 2 !== 0
          }"
        >
          <div>
            <span>
              <b class="text-grey">{{ hindex + 1 }}.{{ selectedHandler.handlerName }}</b>
            </span>
          </div>
          <component
            :is="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            :handler="selectedHandler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :level="level + 1"
            :alertData="alertData"
          ></component>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result"
      style="margin: 0px !important"
      labelPosition="left"
      :labelWidth="90"
      label="调用结果"
    >
      <span :class="{ 'text-success': handler.status === 'succeed', 'text-error': handler.status === 'failed' }">{{ handler.statusName }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result && handler.result.response"
      style="margin: 0px !important"
      labelPosition="left"
      :labelWidth="90"
      label="返回信息"
    >
      <div>{{ handler.result.response }}</div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.error"
      style="margin: 0px !important"
      labelPosition="left"
      :labelWidth="90"
      label="异常"
    >
      <div class="text-error">{{ handler.error }}</div>
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
  props: {},
  data() {
    return {
      integrationData: null,
      handlers: []
    };
  },
  beforeCreate() {},
  async created() {
    const handlers = await import('@/community-module/alert/pages/alertevent/components/view/index.js');
    this.handlers = handlers.default;
    this.getIntegration();
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
    getIntegration() {
      if (this.configLocal.integrationUuid) {
        this.$api.framework.integration.getIntegrationByUuid({ uuid: this.configLocal.integrationUuid }).then(res => {
          this.integrationData = res.Return;
        });
      }
    },
    getExpression(name) {
      const item = this.configLocal.paramMapping.find(d => d.name === name);
      return item ? item.expression : '';
    }
  },
  filter: {},
  computed: {
    paramList() {
      return (this.integrationData && this.integrationData?.config?.param?.paramList) || [];
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
