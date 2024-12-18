<template>
  <TsDialog
    v-bind="dialogConfig"
    @on-close="close"
  >
    <template v-slot>
      <div>
        {{ alertData }}
      </div>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    id: { type: Number }
  },
  data() {
    return {
      alertData: null,
      dialogConfig: {
        title: '告警详情',
        width: 'medium',
        isShow: true,
        maskClose: true
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getAlertById();
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
    close() {
      this.$emit('close');
    },
    getAlertById() {
      if (this.id) {
        this.$api.alert.alert.getAlertById(this.id).then(res => {
          this.alertData = res.Return;
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
