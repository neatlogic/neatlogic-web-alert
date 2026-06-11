<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <TsFormItem
      v-if="integrationData"
      style="margin: 0px !important"
      :label="$t('page.integration')"
      labelPosition="left"
    >
      <span>
        {{ integrationData.name }}
      </span>
    </TsFormItem>
    <TsFormItem
      v-if="integrationData && paramList.length > 0"
      :label="$t('term.process.paramsMapping')"
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
    <!--异常才显示数据-->
    <TsFormItem
      v-if="handler.error && handler.result && handler.result.sourceParam"
      labelPosition="left"
      style="margin: 0px !important"
      :label="$t('term.alert.alertdata')"
    >
      <div>{{ handler.result.sourceParam }}</div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.error && handler.result && handler.result.param"
      labelPosition="left"
      style="margin: 0px !important"
      :label="$t('term.framework.sendingparam')"
    >
      <div>{{ handler.result.param }}</div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.interval"
      style="margin: 0px !important"
      :label="$t('term.alert.invokeinterval')"
      labelPosition="left"
    >
      <span>
        <span class="mr-xs">
          <b>{{ configLocal.interval }}</b>
        </span>
        <span class="text-grey">{{ $t('page.minute') }}</span>
      </span>
    </TsFormItem>
    <TsFormItem
      v-if="mode !== 'audit' && configLocal.successCallbackList && configLocal.successCallbackList.length > 0"
      :label="$t('term.alert.successaction')"
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
            <div>
              <b class="text-grey">
                <span v-if="!selectedHandler.isActive">
                  <Tag color="error">{{ $t('page.ban') }}</Tag>
                </span>
                <span>{{ hindex + 1 }}.{{ selectedHandler.name }}</span>
                <span v-if="selectedHandler.typeLabel">
                  <Tag>{{ selectedHandler.typeLabel }}</Tag>
                </span>
                <span v-if="selectedHandler.isAsync">
                  <Tag color="warning">{{ $t('term.alert.async') }}</Tag>
                </span>
              </b>
            </div>
          </div>
          <component
            :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            :handler="selectedHandler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :level="level + 1"
            :alertType="alertType"
            :alertData="alertData"
          ></component>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="mode !== 'audit' && configLocal.failedCallbackList && configLocal.failedCallbackList.length > 0"
      :label="$t('term.alert.failedaction')"
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
            <div>
              <b class="text-grey">
                <span v-if="!selectedHandler.isActive">
                  <Tag color="error">{{ $t('page.ban') }}</Tag>
                </span>
                <span>{{ hindex + 1 }}.{{ selectedHandler.name }}</span>
                <span v-if="selectedHandler.typeLabel">
                  <Tag>{{ selectedHandler.typeLabel }}</Tag>
                </span>
                <span v-if="selectedHandler.isAsync">
                  <Tag color="warning">{{ $t('term.alert.async') }}</Tag>
                </span>
              </b>
            </div>
          </div>
          <component
            :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            :handler="selectedHandler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :alertData="alertData"
            :alertType="alertType"
            :level="level + 1"
          ></component>
        </div>
      </div>
    </TsFormItem>
    <!--执行结果-->
    <TsFormItem
      v-if="mode === 'audit' && handler.status && handler.childAuditList && handler.childAuditList.length > 0"
      :label="handler.status === 'succeed' ? $t('term.alert.successaction') : $t('term.alert.failedaction')"
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
            :alertType="alertType"
          ></component>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('term.alert.invokeresult')"
    >
      <span :class="{ 'text-success': handler.status === 'succeed', 'text-error': handler.status === 'failed' }">{{ handler.statusName }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="handler.result && handler.result.response"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('term.alert.returnresult')"
    >
      <div>{{ handler.result.response }}</div>
    </TsFormItem>
    <TsFormItem
      v-if="handler.error"
      style="margin: 0px !important"
      labelPosition="left"
      :label="$t('page.exception')"
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
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue'),
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
