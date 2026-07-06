<template>
  <div>
    <TsFormItem :label="$t('term.alert.maxsendperminute')" :labelWidth="150" :labelPosition="readonly ? 'left' : 'top'">
      <TsFormInput
        v-if="!readonly"
        v-model="configLocal.maxSendCount"
        type="number"
        border="border"
        :min="0"
        :step="1"
      ></TsFormInput>
      <span v-else><b>{{ configLocal.maxSendCount || $t('term.alert.unlimited') }}</b></span>
      <div v-if="!readonly" class="text-grey mt-md">{{ $t('term.alert.maxsendhelp') }}</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/config/alertevent-config-base.js';

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
