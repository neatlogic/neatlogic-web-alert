<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <Tabs v-model="currentTab">
        <TabPane label="详情" name="detail" :index="1">
          <div class="grid padding">
            <div>
              <TsFormItem label="id" labelPosition="left">
                <span>{{ alertData.id }}</span>
              </TsFormItem>
            </div>
            <div>
              <TsFormItem label="类型-适配器" labelPosition="left">
                <span>{{ alertData.type }}-{{ alertData.adaptor }}</span>
              </TsFormItem>
            </div>
            <div>
              <TsFormItem label="时间" labelPosition="left">
                <span>{{ alertData.time | formatDate }}</span>
              </TsFormItem>
            </div>
            <div>
              <TsFormItem label="状态" labelPosition="left">
                <span :class="{ 'text-success': alertData.status === 'succeed', 'text-error': alertData.status === 'failed' }">{{ alertData.statusText }}</span>
              </TsFormItem>
            </div>
            <div style="grid-column-start: 1; grid-column-end: 3">
              <TsFormItem label="原始数据" labelPosition="left">
                <JsonViewer
                  v-if="parseJson(alertData.content)"
                  boxed
                  copyable
                  :value="parseJson(alertData.content)"
                ></JsonViewer>
                <div v-else class="bg-op radius-sm padding" style="white-space: normal; word-break: break-all">{{ alertData.content }}</div>
              </tsformitem></div>
            <div v-if="alertData.alertData" style="grid-column-start: 1; grid-column-end: 3">
              <TsFormItem label="转换数据" labelPosition="left">
                <JsonViewer
                  boxed
                  copyable
                  :value="alertData.alertData"
                ></JsonViewer>
              </TsFormItem>
            </div>
            <div v-if="alertData.error" style="grid-column-start: 1; grid-column-end: 3">
              <TsFormItem label="异常" labelPosition="left">
                <div style="white-space: normal; word-break: break-all">{{ alertData.error }}</div>
              </TsFormItem>
            </div>
          </div>
        </TabPane>
        <TabPane label="事件记录" name="eventaudit" :index="2">
          <AlertViewEventAudit v-if="currentTab === 'eventaudit'" :alertData="alertData.alertData"></AlertViewEventAudit>
        </TabPane>
      </Tabs>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    JsonViewer: () => import('vue-json-viewer'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    AlertViewEventAudit: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-eventaudit-list.vue')
  },
  props: {
    alertId: { type: Number }
  },
  data() {
    return {
      dialogConfig: {
        title: '告警详情',
        type: 'slider',
        width: 'medium',
        isShow: true,
        maskClose: true
      },
      currentTab: 'detail',
      alertData: {}
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
    parseJson(content) {
      try {
        return JSON.parse(content);
      } catch (e) {
        return null;
      }
    },
    close() {
      this.$emit('close');
    },
    getAlertById() {
      this.$api.alert.alert.getAlertOriginById(this.alertId).then(res => {
        this.alertData = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
}
</style>
