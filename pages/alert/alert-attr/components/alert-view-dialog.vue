<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <div>
        <Tabs value="info">
          <TabPane v-if="alertData" label="告警详情" name="info">
            <TsFormItem v-for="(attr, index) in attrList" :key="index" :label="attr.label">
              <span v-if="attr.kind === 'const'">
                <AlertAttrViewer
                  type="const"
                  :attr="attr"
                  :row="alertData"
                  mode="detail"
                  :view="view"
                  :value="alertData[attr.name.replace('const_', '')]"
                ></AlertAttrViewer>
              </span>
              <span v-else-if="attr.kind === 'attr' && alertData.attrObj">
                <AlertAttrViewer
                  v-if="alertData.attrObj[attr.name.replace('attr_', '')]"
                  type="attr"
                  :view="view"
                  mode="detail"
                  :row="alertData"
                  :attr="attr"
                  :value="alertData.attrObj[attr.name.replace('attr_', '')].value"
                ></AlertAttrViewer>
              </span>
            </TsFormItem>
          </TabPane>
          <TabPane v-if="alertOriginData" label="原始数据" name="origin">
            <!--<TsFormItem label="状态">
              <span>{{ alertOriginData.statusText }}</span>
            </TsFormItem>-->
            <TsFormItem label="时间">
              <span>{{ alertOriginData.time|formatDate }}</span>
            </TsFormItem>
            <TsFormItem label="原始数据">
              <div class="radius-md"><JsonViewer
                boxed
                copyable
                :value="alertOriginData.content"
              ></JsonViewer></div>
            </TsFormItem>
          </TabPane>
        </Tabs>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.close') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    JsonViewer: () => import('vue-json-viewer'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    AlertAttrViewer: () => import('@/commercial-module/alert/pages/alert/alert-attr-viewer.vue')
  },
  props: {
    id: { type: Number },
    view: { type: Object }
  },
  data() {
    return {
      alertData: null,
      alertOriginData: null,
      dialogConfig: {
        title: '告警详情',
        width: 'medium',
        isShow: true,
        maskClose: true
      },
      attrList: []
    };
  },
  beforeCreate() {},
  async created() {
    this.listAlertAttrList();
    await this.getAlertById();
    await this.getAlertOriginalById();
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
    listAlertAttrList() {
      const param = {};
      if (this.view) {
        param.viewId = this.view.id;
      }
      this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    close() {
      this.$emit('close');
    },
    async getAlertOriginalById() {
      if (this.id) {
        await this.$api.alert.alert.getAlertOriginById(this.id).then(res => {
          this.alertOriginData = res.Return;
        });
      }
    },
    async getAlertById() {
      if (this.id) {
        await this.$api.alert.alert.getAlertById(this.id).then(res => {
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
