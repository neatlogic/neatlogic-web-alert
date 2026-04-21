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
        <div v-if="$AuthUtils.hasRole('ALERT_INDEX')" class="action-item">
          <Button type="warning" @click="rebuildIndex()">{{ $t('page.rebuildindex') }}</Button>
        </div>
        <div class="action-item">
          <Poptip
            v-model="isShowSendMail"
            trigger="click"
            placement="top-end"
            width="700"
            transfer
            title="发送邮件"
          >
            <Button type="primary" ghost>发邮件</Button>
            <div slot="content" class="alert-mail-poptip" @click.stop>
              <AlertMailSendDialog :alert-id="id" @close="isShowSendMail = false"></AlertMailSendDialog>
            </div>
          </Poptip>
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
    AlertDetailCore: () => import('@/community-module/alert/pages/alert/alert-detail-core.vue'),
    AlertMailSendDialog: () => import('@/community-module/alert/pages/alert/alert-mail-send-dialog.vue')
  },
  props: {
    id: { type: Number },
    view: { type: Object }
  },
  data() {
    return {
      dialogConfig: {
        title: '告警详情',
        width: 'huge',
        isShow: true,
        type: 'slider',
        maskClose: true
      },
      alertData: null,
      hasRole: false,
      isShowSendMail: false
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
    rebuildIndex() {
      this.$api.alert.alert.rebuildIndex(this.id).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('message.executesuccess'));
        }
      });
    },
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
.alert-mail-poptip {
  max-height: 70vh;
  overflow: auto;
}
</style>
