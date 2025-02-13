<template>
  <div>
    <TsFormItem label="请选择告警类型" :required="true" labelPosition="top">
      <TsFormSelect
        ref="alertType"
        v-model="configLocal.alertType"
        valueName="name"
        textName="label"
        rootName="tbodyList"
        :validateList="['required']"
        dynamicUrl="/api/rest/alert/alerttype/search"
        transfer
        border="border"
      ></TsFormSelect>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  props: {
    config: { type: Object }
  },
  data() {
    return {
      configLocal: {}
    };
  },
  beforeCreate() {},
  created() {
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
    valid() {
      return this.$refs.alertType.valid();
    },
    getConfig() {
      return this.configLocal;
    }
  },
  filter: {},
  computed: {},
  watch: {
    config: {
      handler(val) {
        if (val) {
          this.configLocal = this.$utils.deepClone(val);
        } else {
          this.configLocal = {};
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less"></style>
