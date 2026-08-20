<template>
  <Tabs v-if="readonlyAlertData" v-model="currentTab" :animated="false">
    <TabPane
      v-if="readonlyAlertData"
      :label="$t('term.alert.alertdetail')"
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
                  :row="readonlyAlertData"
                  mode="detail"
                  :value="readonlyAlertData[attr.name.replace('const_', '')]"
                ></AlertAttrViewer>
              </span>
              <span v-else-if="attr.kind === 'attr' && readonlyAlertData.attrObj">
                <AlertAttrViewer
                  v-if="readonlyAlertData.attrObj.hasOwnProperty(attr.name.replace('attr_', ''))"
                  type="attr"
                  mode="detail"
                  :row="readonlyAlertData"
                  :attr="attr"
                  :value="readonlyAlertData.attrObj[attr.name.replace('attr_', '')]"
                ></AlertAttrViewer>
              </span>
            </div>
          </div>
        </div>
        <Divider v-if="hasRole"></Divider>
        <TsFormItem v-if="hasRole" :label="$t('page.close')" labelPosition="left">
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
              :trueText="$t('term.alert.applychildalert')"
              :falseText="$t('term.alert.applychildalert')"
            ></TsFormSwitch></div>
          </div>
        </TsFormItem>
        <TsFormItem v-if="hasRole" :label="$t('page.status')" labelPosition="left">
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
              :trueText="$t('term.alert.applychildalert')"
              :falseText="$t('term.alert.applychildalert')"
              :falseValue="0"
              :trueValue="1"
            ></TsFormSwitch></div>
          </div>
        </TsFormItem>
        <TsFormItem v-if="hasRole" :label="$t('page.tag')" labelPosition="left">
          <TsFormSelect
            v-model="alertData.markNameList"
            dynamicUrl="/api/rest/alert/mark/search"
            transfer
            :multiple="true"
            :allowCreate="true"
            valueName="name"
            textName="name"
            border="border"
          ></TsFormSelect>
        </TsFormItem>
        <TsFormItem v-if="hasRole" :label="$t('term.alert.transferworker')" labelPosition="left">
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
        <TsFormItem v-if="hasRole" :label="$t('term.alert.transferteam')" labelPosition="left">
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
        <TsFormItem v-if="hasRole" :label="$t('page.comment')" labelPosition="left">
          <TsCkeditor v-model="comment"></TsCkeditor>
        </TsFormItem>
      </div>
    </TabPane>
    <TabPane
      v-for="(attr, index) in tabAttrList"
      :key="'tab_' + index"
      :name="'attr_' + attr.id"
      :label="attr.label"
      :index="index + 10"
    >
      <AlertAttrViewer
        v-if="readonlyAlertData.attrObj.hasOwnProperty(attr.name.replace('attr_', ''))"
        type="attr"
        mode="detail"
        :row="readonlyAlertData"
        :attr="attr"
        :value="readonlyAlertData.attrObj[attr.name.replace('attr_', '')]"
      ></AlertAttrViewer>
    </TabPane>
    <TabPane
      v-if="alertData.childAlertCount"
      name="childalert"
      :label="getChildAlertTabLabel()"
      :index="100"
    >
      <AlertList v-if="currentTab === 'childalert'" :fromAlertId="alertData.id"></AlertList>
    </TabPane>
    <TabPane :label="$t('term.alert.reportdata')" name="origin" :index="101">
      <AlertOriginal v-if="currentTab === 'origin'" :alertData="alertData"></AlertOriginal>
    </TabPane>
    <TabPane :label="$t('page.actionaudit')" name="audit" :index="102">
      <AlertViewAudit v-if="currentTab === 'audit'" :alertData="alertData" :attrList="attrList"></AlertViewAudit>
    </TabPane>
    <TabPane :label="$t('term.alert.eventaudit')" name="eventaudit" :index="103">
      <AlertViewEventAudit v-if="currentTab === 'eventaudit'" :alertData="alertData"></AlertViewEventAudit>
    </TabPane>
    <TabPane
      v-if="commentData && commentData.tbodyList && commentData.tbodyList.length > 0"
      :index="104"
      :label="$t('page.comment')"
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
    <TabPane
      v-if="COMMERCIAL_MODULES.includes('alert')"
      :index="200"
      :label="$t('term.alert.subscribehistory')"
      name="subscribe"
    >
      <component :is="alertSubscribeAudit" v-if="currentTab === 'subscribe'" :alertId="id"></component>
    </TabPane>
    <TabPane
      v-if="$AuthUtils.hasRole('ALERT_TITLE_AI') && $AuthUtils.hasRole('AI_CHAT')"
      :index="201"
      :label="$t('term.alert.ai')"
      name="ai"
      class="bg-op"
    >
      <component
        :is="alertAiChat"
        v-if="isAiTabVisited && readonlyAlertData.id"
        :alertId="readonlyAlertData.id"
      ></component>
    </TabPane>
    <div v-if="alertData.actionList && alertData.actionList.length > 0" slot="extra">
      <Dropdown placement="bottom-end">
        <a href="javascript:void(0)">
          <span>{{ $t('term.alert.customaction') }}</span>
          <span class="tsfont-drop-down"></span>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem v-for="(action,ai) in alertData.actionList" :key="ai" @click.native="doAction(alertData,action.script)">
            <span :class="action.icon">{{ action.label }}</span></DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </Tabs>
  <Alert v-else-if="!loading" type="error" show-icon>
    {{ $t('page.exception') }}
    <span slot="desc">
      {{ $t('term.alert.alertnotexists') }}
    </span>
  </Alert>
</template>
<script>
import ComponentManager from '@/resources/import/component-manager.js';

export default {
  name: '',
  components: {
    AlertViewAudit: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-audit-list.vue'),
    AlertViewEventAudit: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-eventaudit-list.vue'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue'),
    AlertOriginal: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-original.vue'),
    TsCkeditor: () => import('@/resources/plugins/TsCkeditor/TsCkeditor.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue'),
    AlertList: () => import('@/community-module/alert/pages/alert/alert-list.vue'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      COMMERCIAL_MODULES: COMMERCIAL_MODULES,
      alertAiChat: null,
      alertSubscribeAudit: null,
      isAiTabVisited: false,
      loading: true,
      currentTab: 'info',
      alertData: null,
      readonlyAlertData: null, //用于显示的只读数据
      //alertTypeData: null,
      dialogConfig: {
        title: this.$t('term.alert.alertdetail'),
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
        { value: 'append', text: this.$t('page.append') },
        { value: 'replace', text: this.$t('page.replace') }
      ],
      applyUserList: [],
      applyTeamList: [],
      markList: [],
      applyUserType: 'replace',
      applyTeamType: 'replace'
    };
  },
  beforeCreate() {

  },
  async created() {
    if (this.COMMERCIAL_MODULES.includes('alert')) {
      this.alertAiChat = ComponentManager.getVueTemplate('alert-ai-chat');
      this.alertSubscribeAudit = ComponentManager.getVueTemplate('alert-subscribe-audit');
    }
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
    doAction(alertData, script) {
      const fn = new Function(`"use strict"; return (${script});`)();
      try {
        fn.call(this, alertData);
      } catch (e) {
        this.$Notice.error({ title: this.$t('page.exception'), desc: this.$t('term.alert.actionexecexception', { target: e.message }) });
      }
    },
    getChildAlertTabLabel() {
      return h => {
        const returnList = [h('span', { class: 'mr-xs' }, this.$t('term.alert.childalert'))];
        let eventCount = 0;
        if (this.alertData && this.alertData.childAlertCount) {
          returnList.push(
            h('Badge', {
              props: {
                type: 'info',
                count: this.alertData.childAlertCount
              }
            })
          );
        }
        return h('div', returnList);
      };
    },
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
      this.$api.alert.alert.listAlertAttrList({ isColumn: 1 }).then(res => {
        this.attrList = res.Return;
      });
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },

    async getAlertById() {
      if (this.id) {
        await this.$api.alert.alert
          .getAlertById(this.id)
          .then(res => {
            this.alertData = res.Return;
            this.readonlyAlertData = this.$utils.deepClone(this.alertData);
            /*if (this.alertData) {
            this.getAlertTypeById(this.alertData.type);
          }*/
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    /*async getAlertTypeById(id) {
      if (id) {
        await this.$api.alert.alerttype.getAlertTypeById(id).then(res => {
          this.alertTypeData = res.Return;
        });
      }
    },*/
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
          this.$Message.success(this.$t('message.executesuccess'));
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
        if (this.alertData.teamList && userInfo.teamUuidList) {
          for (let i = 0; i < this.alertData.teamList.length; i++) {
            const team = this.alertData.teamList[i];
            if (userInfo.teamUuidList.find(d => d === 'team#' + team.teamUuid)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    tabAttrList() {
      const attrList = [];
      if (this.attrList && this.attrList.length > 0 && this.readonlyAlertData && this.readonlyAlertData.attrObj) {
        this.attrList.forEach(d => {
          const attrName = d.name.replace('attr_', '');
          if (d.isTab && Object.prototype.hasOwnProperty.call(this.readonlyAlertData.attrObj, attrName)) {
            attrList.push(d);
          }
        });
      }
      return attrList;
    },
    finalAttrList() {
      const attrList = [];
      if (this.attrList && this.attrList.length > 0) {
        this.attrList.forEach(d => {
          if (d.kind === 'const') {
            attrList.push(d);
          } else if (!d.isTab && this.alertData && this.alertData.attrObj && this.alertData.attrObj.hasOwnProperty(d.name.replace('attr_', ''))) {
            //没有值的扩展属性不显示
            attrList.push(d);
          }
        });
      }
      return attrList;
    }
  },
  watch: {
    currentTab(value) {
      if (value === 'ai') {
        this.isAiTabVisited = true;
      }
      this.$emit('tab-change', value);
    }
  }
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
