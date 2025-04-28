<template>
  <div v-if="alertOriginData">
    <TsFormItem label="上报时间" labelPosition="left">
      <span>{{ alertOriginData.time | formatDate }}</span>
    </TsFormItem>
    <TsFormItem label="原始数据" labelPosition="left">
      <JsonViewer
        v-if="isJson(alertOriginData.content)"
        :expanded="true"
        copyable
        :value="JSON.parse(alertOriginData.content)"
      ></JsonViewer>
      <div v-else class="radius-md bg-op padding-md">{{ alertOriginData.content }}</div>
    </TsFormItem>
    <TsFormItem v-if="alertOriginData.alertData" label="转换数据" labelPosition="left">
      <JsonViewer
        :expanded="true"
        copyable
        :value="alertOriginData.alertData"
      ></JsonViewer>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    JsonViewer: () => import('vue-json-viewer')
  },
  props: {
    alertData: { type: Object }
  },
  data() {
    return {
      alertOriginData: null
    };
  },
  beforeCreate() {},
  created() {
    this.getAlertOriginalById();
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
    getAlertOriginalById() {
      if (this.alertData) {
        this.$api.alert.alert.getAlertOriginById(this.alertData.id).then(res => {
          this.alertOriginData = res.Return;
        });
      }
    },
    isJson(content) {
      try {
        JSON.parse(content);
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
::v-deep .jv-code {
  padding: 0 !important;
  background: transparent !important;
}
::v-deep .jv-container {
  padding: 0 !important;
  background: transparent !important;
}
</style>
