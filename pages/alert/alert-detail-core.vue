<template>
  <Tabs v-model="currentTab" :animated="false">
    <TabPane
      v-if="alertData"
      label="告警详情"
      name="info"
      :index="1"
    >
      <div v-if="currentTab === 'info'">
        <div class="attr-main">
          <div
            v-for="(attr, index) in finalAttrList"
            :key="index"
            class="attr-item"
            :class="{ 'attr-item-row': attr.wholeRow }"
          >
            <div class="attr-title text-grey">{{ attr.label }}</div>
            <div class="attr-content">
              <span v-if="attr.kind === 'const'">
                <AlertAttrViewer
                  type="const"
                  :attr="attr"
                  :row="alertData"
                  mode="detail"
                  :value="alertData[attr.name.replace('const_', '')]"
                ></AlertAttrViewer>
              </span>
              <span v-else-if="attr.kind === 'attr' && alertData.attrObj">
                <AlertAttrViewer
                  v-if="alertData.attrObj[attr.name.replace('attr_', '')]"
                  type="attr"
                  mode="detail"
                  :row="alertData"
                  :attr="attr"
                  :value="alertData.attrObj[attr.name.replace('attr_', '')]"
                ></AlertAttrViewer>
              </span>
            </div>
          </div>
        </div>
        <Divider v-if="hasRole"></Divider>
        <TsFormItem v-if="hasRole" label="关闭" labelPosition="left">
          <div class="action-group">
            <div class="action-item">
              <TsFormRadio
                v-model="alertData.isClose"
                :dataList="[
                  { value: 1, text: $t('page.yes') },
                  { value: 0, text: $t('page.no') }
                ]"
              ></TsFormRadio>
            </div>
            <div v-if="alertData && alertData.childAlertCount" class="action-item"><Divider style="padding: 0px; margin: 0px" type="vertical" /></div>
            <div v-if="alertData && alertData.childAlertCount" class="action-item"><TsFormSwitch
              v-model="isCloseChildAlert"
              :showStatus="true"
              :trueValue="1"
              :falseValue="0"
              trueText="同时关闭子告警"
              falseText="同时关闭子告警"
            ></TsFormSwitch></div>
          </div>
        </TsFormItem>
        <TsFormItem v-if="hasRole" label="状态" labelPosition="left">
          <div class="action-group">
            <div class="action-item"><Badge :color="alertData.statusColor" :text="alertData.statusName"></Badge></div>
            <div v-if="finalStatusList.length > 0" class="action-item"><Divider style="padding: 0px; margin: 0px" type="vertical"></Divider></div>
            <div v-if="finalStatusList.length > 0" class="action-item">
              <Tag
                v-for="(status, sindex) in finalStatusList"
                :key="sindex"
                :color="status.name === selectedStatus ? 'primary' : 'default'"
                @click.native="changeStatus(status)"
              >{{ status.label }}</Tag>
            </div>
            <div v-if="alertData && alertData.childAlertCount" class="action-item"><Divider style="padding: 0px; margin: 0px" type="vertical" /></div>
            <div v-if="alertData && alertData.childAlertCount" class="action-item"><TsFormSwitch
              v-model="isChangeChildAlertStatus"
              :showStatus="true"
              trueText="同时修改子告警状态"
              falseText="同时修改子告警状态"
              :falseValue="0"
              :trueValue="1"
            ></TsFormSwitch></div>
          </div>
        </TsFormItem>
        <TsFormItem v-if="hasRole" label="转交处理人" labelPosition="left">
          <div class="action-group">
            <div class="action-item"><UserSelect
              v-model="applyUserList"
              :width="400"
              :multiple="true"
              :transfer="true"
              :groupList="['user']"
            ></UserSelect></div>
            <div class="action-item">
              <TsFormRadio v-model="applyUserType" :dataList="applyType"></TsFormRadio>
            </div>
          </div>
        </TsFormItem>
        <TsFormItem v-if="hasRole" label="转交处理组" labelPosition="left">
          <div class="action-group">
            <div class="action-item"><UserSelect
              v-model="applyTeamList"
              :width="400"
              :multiple="true"
              :transfer="true"
              :groupList="['team']"
            ></UserSelect></div>
            <div class="action-item">
              <TsFormRadio v-model="applyTeamType" :dataList="applyType"></TsFormRadio>
            </div>
          </div>
        </TsFormItem>
        <TsFormItem v-if="hasRole" label="评论" labelPosition="left">
          <TsCkeditor v-model="comment"></TsCkeditor>
        </TsFormItem>
      </div>
    </TabPane>
    <TabPane label="原始数据" name="origin" :index="2">
      <AlertOriginal v-if="currentTab === 'origin'" :alertData="alertData"></AlertOriginal>
    </TabPane>
    <TabPane label="操作记录" name="audit" :index="3">
      <AlertViewAudit v-if="currentTab === 'audit'" :alertData="alertData" :attrList="attrList"></AlertViewAudit>
    </TabPane>
    <TabPane label="事件记录" name="eventaudit" :index="4">
      <AlertViewEventAudit v-if="currentTab === 'eventaudit'" :alertData="alertData"></AlertViewEventAudit>
    </TabPane>
    <TabPane
      v-if="commentData && commentData.tbodyList && commentData.tbodyList.length > 0"
      :index="5"
      label="评论"
      name="comment"
    >
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
</template>
<script>
export default {
  name: '',
  components: {
    AlertViewAudit: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-audit-list.vue'),
    AlertViewEventAudit: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-eventaudit-list.vue'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue'),
    AlertOriginal: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-original.vue'),
    TsCkeditor: () => import('@/resources/plugins/TsCkeditor/TsCkeditor.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    AlertAttrViewer: () => import('@/commercial-module/alert/pages/alert/alert-attr-viewer.vue'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      currentTab: 'info',
      alertData: null,
      alertTypeData: null,
      dialogConfig: {
        title: '告警详情',
        width: 'large',
        isShow: true,
        maskClose: true
      },
      statusList: [],
      attrList: [],
      selectedStatus: null,
      comment: null,
      isCloseChildAlert: 1,
      isChangeChildAlertStatus: 1,
      commentData: null,
      applyType: [
        { value: 'append', text: '追加' },
        { value: 'replace', text: '替换' }
      ],
      applyUserList: [],
      applyTeamList: [],
      applyUserType: 'append',
      applyTeamType: 'append'
    };
  },
  beforeCreate() {},
  async created() {
    this.listAllStatus();
    this.listAlertAttrList();
    await this.getAlertById();
    await this.searchAlertComment();
    this.$emit('ready');
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
    listAllStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    },
    getAttr(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
      return null;
    },
    init() {
      this.getAlertById();
      this.searchAlertComment();
      this.comment = null;
      this.applyUserList = [];
      this.applyTeamList = [];
      this.applyUserType = 'append';
      this.applyTeamType = 'append';
    },
    async searchAlertComment(currentPage) {
      const param = { alertId: this.id };
      if (currentPage) {
        param.currentPage = currentPage;
      }
      await this.$api.alert.alert.searchAlertComment(param).then(res => {
        this.commentData = res.Return;
      });
    },
    changeStatus(status) {
      this.selectedStatus = this.selectedStatus === status.name ? null : status.name;
    },
    listAlertAttrList() {
      const param = {};
      this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },

    async getAlertById() {
      if (this.id) {
        await this.$api.alert.alert.getAlertById(this.id).then(res => {
          this.alertData = res.Return;
          this.getAlertTypeById(this.alertData.type);
        });
      }
    },
    async getAlertTypeById(id) {
      if (id) {
        await this.$api.alert.alerttype.getAlertTypeById(id).then(res => {
          this.alertTypeData = res.Return;
        });
      }
    },
    async confirm() {
      const alertData = this.$utils.deepClone(this.alertData);
      if (this.selectedStatus) {
        alertData.status = this.selectedStatus;
      }
      if (this.comment) {
        alertData.comment = this.comment;
      }
      if (this.applyUserList && this.applyUserList.length > 0) {
        alertData.applyUserList = this.applyUserList.map(d => d.replace('user#', ''));
        alertData.applyUserType = this.applyUserType;
      }
      if (this.applyTeamList && this.applyTeamList.length > 0) {
        alertData.applyTeamList = this.applyTeamList.map(d => d.replace('team#', ''));
        alertData.applyTeamType = this.applyTeamType;
      }
      alertData.isChangeChildAlertStatus = this.isChangeChildAlertStatus;
      alertData.isCloseChildAlert = this.isCloseChildAlert;
      let result = false;
      await this.$api.alert.alert.handleAlert(alertData).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success('操作成功');
          result = true;
        }
      });
      return result;
    }
  },
  filter: {},
  computed: {
    finalStatusList() {
      return this.statusList.filter(d => d.name !== this.alertData.status);
    },
    hasRole() {
      if (this.alertData) {
        if (this.$AuthUtils.hasRole('ALERT_ADMIN')) {
          return true;
        }
        const userInfo = this.$AuthUtils.getCurrentUser();
        if (this.alertData.userList) {
          if (this.alertData.userList.find(d => d.userId === userInfo.uuid)) {
            return true;
          }
        }
        if (this.alertData.teamList && userInfo.teamList) {
          for (let i = 0; i < this.alertData.teamList.length; i++) {
            const team = this.alertData.teamList[i];
            if (userInfo.teamList.find(d => d.uuid === team.teamUuid)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    finalAttrList() {
      const attrList = [];
      if (this.attrList && this.attrList.length > 0 && this.alertTypeData) {
        this.attrList.forEach(d => {
          if (d.kind === 'const') {
            attrList.push(d);
          } else if (this.alertTypeData.attrTypeIdList && this.alertTypeData.attrTypeIdList.length > 0) {
            if (this.alertTypeData.attrTypeIdList.includes(d.id)) {
              attrList.push(d);
            }
          }
        });
      }
      return attrList;
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
