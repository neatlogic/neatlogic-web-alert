<template>
  <div v-if="alertOriginData">
    <TsFormItem label="上报时间" labelPosition="left" :labelWidth="80">
      <span>{{ alertOriginData.time | formatDate }}</span>
    </TsFormItem>
    <TsFormItem label="原始数据" labelPosition="left" :labelWidth="80">
      <div class="radius-md bg-op padding-md">{{ alertOriginData.content }}</div>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
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
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
