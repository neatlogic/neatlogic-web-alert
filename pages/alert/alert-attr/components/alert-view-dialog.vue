<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <div>
        <Tabs v-model="currentTab" :animated="false">
          <TabPane v-if="alertData" label="告警详情" name="info">
            <div v-if="currentTab === 'info'">
              <div class="attr-main">
                <div v-for="(attr, index) in attrList" :key="index" class="attr-item">
                  <div class="attr-title text-grey">{{ attr.label }}</div>
                  <div class="attr-content">
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
                  </div>
                </div>
              </div>
              <Divider></Divider>
              <TsFormItem label="状态" labelPosition="left">
                <div class="action-group">
                  <div class="action-item"><Badge :color="alertData.statusColor" :status="alertData.statusStatus" :text="alertData.statusName"></Badge></div>
                  <div class="action-item"><Divider style="padding: 0px; margin: 0px" type="vertical"></Divider></div>
                  <div class="action-item">
                    <Tag
                      v-for="(status, sindex) in finalStatusList"
                      :key="sindex"
                      :color="status.value === selectedStatus ? 'primary' : 'default'"
                      @click.native="changeStatus(status)"
                    >{{ status.text }}</Tag>
                  </div>
                </div>
              </TsFormItem>
              <TsFormItem label="评论" labelPosition="left">
                <TsCkeditor v-model="comment"></TsCkeditor>
              </TsFormItem>
            </div>
          </TabPane>
          <TabPane v-if="alertOriginData" label="原始数据" name="origin">
            <div v-if="currentTab === 'origin'">
              <!--<TsFormItem label="状态">
              <span>{{ alertOriginData.statusText }}</span>
            </TsFormItem>-->
              <TsFormItem label="上报时间" labelPosition="left" :labelWidth="80">
                <span>{{ alertOriginData.time | formatDate }}</span>
              </TsFormItem>
              <TsFormItem label="原始数据" labelPosition="left" :labelWidth="80">
                <div class="radius-md"><JsonViewer boxed copyable :value="alertOriginData.content"></JsonViewer></div>
              </TsFormItem>
            </div>
          </TabPane>
          <TabPane v-if="auditData && auditData.tbodyList && auditData.tbodyList.length > 0" label="操作记录" name="audit">
            <TsTable
              v-if="currentTab === 'audit'"
              :theadList="auditHeaderList"
              v-bind="auditData"
              @changeCurrent="searchAlertAudit"
            >
              <template v-slot:attrName="{ row }">
                {{ getAttrByName(row.attrName) && getAttrByName(row.attrName).label }}
              </template>
              <template v-slot:inputUser="{ row }">
                <UserCard :uuid="row.inputUser" :hideAvatar="true"></UserCard>
              </template>
              <template v-slot:oldValue="{ row }">
                <AlertAttrViewer mode="audit" :attr="getAttrByName(row.attrName)" :value="row.oldValueList"></AlertAttrViewer>
              </template>
              <template v-slot:newValue="{ row }">
                <AlertAttrViewer mode="audit" :attr="getAttrByName(row.attrName)" :value="row.newValueList"></AlertAttrViewer>
              </template>
            </TsTable>
          </TabPane>
          <TabPane v-if="commentData && commentData.tbodyList && commentData.tbodyList.length > 0" label="评论" name="comment">
            <Timeline>
              <TimelineItem v-for="(c, index) in commentData.tbodyList" :key="index">
                <div class="time text-grey mb-md">{{ c.commentTime | formatDate }}</div>
                <div class="content">
                  <div class="comment-grid">
                    <div style="text-align: center"><UserCard
                      :iconSize="30"
                      alignMode="vertical"
                      :uuid="c.commentUser"
                      :hideAvatar="false"
                    ></UserCard></div>
                    <div class="bg-op radius-md padding-md comment-content" v-html="c.comment"></div>
                  </div>
                </div>
              </TimelineItem>
            </Timeline>
            <div style="text-align: right"><Page
              size="small"
              :showTotal="true"
              :total="commentData.rowNum"
              :current="commentData.currentPage"
              :page-size="commentData.pageSize"
              :transfer="true"
              @on-change="searchAlertComment"
            /></div>
          </TabPane>
        </Tabs>
      </div>
    </template>
    <template v-slot:footer>
      <div class="action-group">
        <div v-if="currentTab === 'info'" class="action-item">
          <TsFormSwitch
            v-if="alertData && alertData.childAlertCount"
            v-model="isChangeChildAlertStatus"
            :showStatus="true"
            trueText="同时修改子告警状态"
            falseText="同时修改子告警状态"
            :falseValue="0"
            :trueValue="1"
          ></TsFormSwitch>
        </div>
        <div class="action-item">
          <Button @click="close()">{{ $t('page.close') }}</Button>
        </div>
        <div v-if="currentTab === 'info'" class="action-item">
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
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue'),
    JsonViewer: () => import('vue-json-viewer'),
    TsCkeditor: () => import('@/resources/plugins/TsCkeditor/TsCkeditor.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertAttrViewer: () => import('@/commercial-module/alert/pages/alert/alert-attr-viewer.vue')
  },
  props: {
    id: { type: Number },
    view: { type: Object }
  },
  data() {
    return {
      currentTab: 'info',
      alertData: null,
      alertOriginData: null,
      dialogConfig: {
        title: '告警详情',
        width: 'medium',
        isShow: true,
        maskClose: true
      },
      statusList: [
        { value: 'new', text: '新告警', color: 'green', status: '' },
        { value: 'confirmed', text: '已确认', color: '', status: '' },
        { value: 'processing', text: '处理中', color: '', status: '' },
        { value: 'resolved', text: '已处理', color: '', status: '' },
        { value: 'closed', text: '已关闭', color: '', status: '' }
      ],
      auditHeaderList: [
        { key: 'inputTime', title: '操作时间', type: 'time' },
        { key: 'inputUser', title: '操作用户' },
        { key: 'inputFrom', title: '操作来源' },
        { key: 'attrName', title: '属性' },
        { key: 'oldValue', title: '操作前' },
        { key: 'newValue', title: '操作后' }
      ],
      attrList: [],
      selectedStatus: null,
      comment: null,
      auditData: null,
      isChangeChildAlertStatus: 0,
      commentData: null
    };
  },
  beforeCreate() {},
  async created() {
    this.listAlertAttrList();
    await this.getAlertById();
    await this.getAlertOriginalById();
    await this.searchAlertAudit();
    await this.searchAlertComment();
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
    async searchAlertComment(currentPage) {
      const param = { alertId: this.id };
      if (currentPage) {
        param.currentPage = currentPage;
      }
      await this.$api.alert.alert.searchAlertComment(param).then(res => {
        this.commentData = res.Return;
      });
    },
    async searchAlertAudit(currentPage) {
      const param = { alertId: this.id };
      if (currentPage) {
        param.currentPage = currentPage;
      }
      await this.$api.alert.alert.searchAlertAudit(param).then(res => {
        this.auditData = res.Return;
      });
    },
    changeStatus(status) {
      this.selectedStatus = this.selectedStatus === status.value ? null : status.value;
    },
    listAlertAttrList() {
      const param = {};
      if (this.view) {
        param.viewId = this.view.id;
      }
      this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
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
    },
    confirm() {
      const alertData = this.$utils.deepClone(this.alertData);
      if (this.selectedStatus) {
        alertData.status = this.selectedStatus;
      }
      if (this.comment) {
        alertData.comment = this.comment;
      }
      alertData.isChangeChildAlertStatus = this.isChangeChildAlertStatus;
      this.$api.alert.alert.handleAlert(alertData).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success('操作成功');
          this.close(true);
        }
      });
    },
    getAttrByName(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
    }
  },
  filter: {},
  computed: {
    finalStatusList() {
      return this.statusList.filter(d => d.value !== this.alertData.status);
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.audit-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid: 10px;
}
.attr-main {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
  .attr-item-row {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .attr-item {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 120px auto;
    .attr-title {
      text-align: left;
      padding: 3px;
    }
    .attr-content {
      padding: 3px;
    }
    .attr-content .content {
      word-break: break-all;
    }
  }
}
.comment-grid {
  display: grid;
  grid-template-columns: 80px auto;
}
.comment-content {
  overflow: hidden;
  width: 625px;
}
::v-deep(.comment-content img) {
  max-width: 100%;
  height: auto;
}
</style>
