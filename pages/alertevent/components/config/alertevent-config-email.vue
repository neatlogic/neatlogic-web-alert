<template>
  <div>
    <TsFormItem label="一分钟内最大发送次数" :labelWidth="150" :labelPosition="readonly ? 'left' : 'top'">
      <TsFormInput
        v-if="!readonly"
        v-model="configLocal.maxSendCount"
        type="number"
        border="border"
        :min="0"
        :step="1"
      ></TsFormInput>
      <span v-else><b>{{ configLocal.maxSendCount || '不限制' }}</b></span>
      <div v-if="!readonly" class="text-grey mt-md">帮助：留空或设为0代表不限制，超出发送限制的邮件将无法发送并返回异常</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/config/alertevent-config-base.js';

export default {
  name: '',
  directives: {},
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>
