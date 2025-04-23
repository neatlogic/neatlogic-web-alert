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
        @on-change="changeAlertType"
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem
      v-if="currentAlertType && currentAlertType.adaptorList"
      label="请选择接入转换"
      :required="true"
      labelPosition="top"
    >
      <TsFormSelect
        ref="alertAdaptor"
        v-model="configLocal.adaptor"
        valueName="name"
        textName="label"
        :validateList="['required']"
        transfer
        :dataList="currentAlertType.adaptorList"
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
      configLocal: {},
      currentAlertType: {}
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
    getAlertTypeByName() {
      if (this.configLocal.alertType) {
        this.$api.alert.alerttype.getAlertTypeByName(this.configLocal.alertType).then(res => {
          this.currentAlertType = res.Return;
        });
      }
    },
    changeAlertType(val, option, item) {
      this.currentAlertType = item;
    },
    valid() {
      let isValid = true;
      if (!this.$refs.alertType.valid()) {
        isValid = false;
      }
      if (this.$refs.alertAdaptor && !this.$refs.alertAdaptor.valid()) {
        isValid = false;
      }
      return isValid;
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
          this.getAlertTypeByName();
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
