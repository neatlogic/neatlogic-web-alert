<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <div>
        <AlertDetailCore
          v-if="id"
          :id="id"
          ref="alertDetailCore"
          @ready="isReady()"
        ></AlertDetailCore>
      </div>
    </template>
    <template v-slot:footer>
      <div class="action-group">
        <div class="action-item">
          <Button @click="close()">{{ $t('page.close') }}</Button>
        </div>
        <div v-if="hasRole" class="action-item">
          <Button type="primary" @click="confirm()">{{ $t('page.confirm') }}</Button>
        </div>
      </div>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    AlertDetailCore: () => import('@/commercial-module/alert/pages/alert/alert-detail-core.vue')
  },
  props: {
    id: { type: Number },
    view: { type: Object }
  },
  data() {
    return {
      dialogConfig: {
        title: '告警详情',
        width: 'large',
        isShow: true,
        type: 'slider',
        maskClose: true
      },
      alertData: null,
      hasRole: false
    };
  },
  beforeCreate() {},
  async created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    isReady() {
      this.hasRole = this.$refs.alertDetailCore && this.$refs.alertDetailCore.hasRole;
      this.alertData = this.$refs.alertDetailCore && this.$refs.alertDetailCore.alertData;
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    async confirm() {
      if (this.$refs.alertDetailCore) {
        let result = await this.$refs.alertDetailCore.confirm();
        if (result) {
          this.close(true);
        }
      }
    }
  },
  filter: {},
  computed: {
  },
  watch: {}
};
</script>
<style lang="less" scoped>
</style>
