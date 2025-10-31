<template>
  <div class="mb-lg">
    <TsFormItem :label="$t('page.type')" labelPosition="left">
      <TsFormSelect
        v-model="handler.typeId"
        dynamicUrl="/api/rest/alert/event/handler/type/search"
        transfer
        valueName="id"
        textName="label"
        border="border"
        @on-change="changeType"
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.async')" labelPosition="left">
      <TsFormRadio
        v-model="handler.isAsync"
        :dataList="[
          { value: 1, text: '异步动作' },
          { value: 0, text: '同步动作' }
        ]"
      ></TsFormRadio>
    </TsFormItem>
    <TsFormItem :label="$t('term.report.isactive')" labelPosition="left">
      <TsFormSwitch v-model="handler.isActive" :trueValue="1" :falseValue="0"></TsFormSwitch>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  props: {
    handler: { type: Object }
  },
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
  methods: {
    changeType(val, option, item) {
      //保存类型名称到子插件的配置中，避免反查
      if (option) {
        this.$set(this.handler, 'typeLabel', option.text);
      } else {
        this.$delete(this.handler, 'typeLabel');
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
