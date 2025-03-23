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
    <TsFormItem v-if="integrationData && paramList.length > 0" label="参数映射" labelPosition="left">
      <TsFormItem
        v-for="(param, index) in paramList"
        :key="index"
        labelPosition="left"
        :label="param.description || param.name"
      >
        <span>{{ getExpression(param.name) }}</span>
      </TsFormItem>
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
