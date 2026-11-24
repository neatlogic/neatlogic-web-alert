<template>
  <div class="alert-convergence-config">
    <TsFormItem :required="attributesRequired" :label="$t('term.alert.uniquekey')" labelPosition="left">
      <div class="text-grey">{{ attributeHelp }}</div>
      <Loading v-if="attributesLoading" loadingShow></Loading>
      <TsFormCheckbox
        v-else
        :dataList="attributes"
        :value="selectedAttributes.map(attr => attr.name)"
        valueName="name"
        textName="label"
        @on-change="(names, items) => $emit('change-attributes', names, items)"
      ></TsFormCheckbox>
      <Divider v-if="selectedAttributes.length" orientation="left">{{ $t('term.alert.selectedattr') }}</Divider>
      <Tag v-for="attr in selectedAttributes" :key="attr.name">{{ attr.label || attr.name }}</Tag>
    </TsFormItem>
    <TsFormItem v-if="showSignatures" :label="$t('term.alert.alertsign')" labelPosition="left">
      <Loading v-if="signaturesLoading" loadingShow></Loading>
      <TsFormSelect
        v-else
        v-bind="signatureSelect"
        :value="signatureIds"
        transfer
        border="border"
        valueName="id"
        textName="label"
        multiple
        @on-change="$emit('change-signatures', $event)"
      ></TsFormSelect>
      <div class="text-grey">{{ $t('term.alert.alertsignhelp') }}</div>
    </TsFormItem>
  </div>
</template>

<script>
// 复用属性和特征的选择界面，由调用方加载数据并处理各自的配置校验。
export default {
  name: 'AlertConvergenceConfig',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormCheckbox: () => import('@/resources/plugins/TsForm/TsFormCheckbox'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  props: {
    attributesRequired: { type: Boolean, default: false },
    attributeHelp: { type: String, required: true },
    attributes: { type: Array, default: () => [] },
    selectedAttributes: { type: Array, default: () => [] },
    signatureIds: { type: Array, default: () => [] },
    signatureSelect: { type: Object, default: () => ({}) },
    attributesLoading: { type: Boolean, default: false },
    signaturesLoading: { type: Boolean, default: false },
    showSignatures: { type: Boolean, default: false }
  }
};
</script>

<style lang="less" scoped>
// 还有后续表单项时，保留组件内最后一项原有的行间距。
.alert-convergence-config:not(:last-child) > .tsform-item:last-child {
  margin-bottom: @space-normal;
}
</style>
