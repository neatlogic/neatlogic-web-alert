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
          <div style="line-height: 1">{{ getExpression(param.name) }}</div>
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
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      integrationData: null
    };
  },
  beforeCreate() {},
  created() {
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
