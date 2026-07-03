<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <span v-auth="['ALERT_ADMIN']" class="action-item">
          <AuditConfig auditName="ALERT-TRASH"></AuditConfig>
        </span>
      </template>
      <template v-slot:topRight>
        <CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="searchAlert(1)"></CombineSearcher>
      </template>
      <template v-slot:content>
        <Loading v-if="isLoading" :loadingShow="true" type="fix"></Loading>
        <div v-if="isShowTopo">
          <component
            :is="TopoDetail"
            v-if="TopoDetail && topoId"
            :id="topoId"
            :alertList="alertData.tbodyList"
          ></component>
        </div>
        <div v-else>
          <TsTable
            v-bind="alertData"
            resizeKey="alert-table"
            :canResize="true"
            :canExpand="true"
            keyName="id"
            :theadList="theadList"
            @changeCurrent="searchAlert"
            @changePageSize="changePageSize"
          ><template v-slot:deleteUser="{ row }">
             <UserCard
               :uuid="row.deleteUser"
               :hideAvatar="true"
             ></UserCard>
           </template>
            <template v-slot:action="{ row }">
              <div class="tstable-action">
                <ul class="tstable-action-ul">
                  <li class="tsfont-list" @click="toAlertDetail(row)">{{ $t('page.detail') }}</li>
                </ul>
              </div>
            </template>
          </TsTable>
        </div>
      </template>
    </TsContain>
    <AlertDetail
      v-if="isShowDetail"
      :id="currentId"
      @close="
        isShowDetail = false;
        currentId = null;
      "
    ></AlertDetail>
  </div>
</template>
<script>
import ComponentManager from '@/resources/import/component-manager.js';
export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertDetail: () => import('@/community-module/alert/pages/alerttrash/alert-trash-detail-dialog.vue'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue'),
    AuditConfig: () => import('@/views/components/auditconfig/auditconfig.vue')
    //AlertViewEdit: () => import('@/community-module/alert/pages/alert/alert-view-edit.vue'),
  },
  props: {},
  data() {
    return {
      COMMERCIAL_MODULES: COMMERCIAL_MODULES,
      TopoDetail: null,
      isLoading: false,
      isShowTopo: false,
      isShowAlert: false,
      searchVal: {},
      deleteMode: 'select', //删除模式:select|match
      alertViewData: null,
      isShowFilter: false,
      currentView: null,
      isViewEdit: false,
      attrPopMap: {},
      attrList: [],
      statusList: [],
      levelList: [],
      searchParam: { mode: 'simple', rule: {}, attrFilterList: [] },
      alertData: {},
      attrFilterMap: {},
      rule: {},
      alertViewList: [],
      isDeleteShow: false,
      isCloseShow: false,
      isOpenShow: false,
      currentAlertId: null,
      isAutoRefresh: false,
      timmer: null,
      intervaler: null,
      interval: 60000,
      startTime: null,
      countdown: 0,
      topoList: [],
      topoId: null,
      topoAlertSize: 1000, //告警拓扑默认查询数据量
      childAlertPage: {}, //记录子告警分页信息
      theadList: [
        {
          key: 'title',
          title: this.$t('page.title')
        },
        { key: 'levelLabel', title: this.$t('page.level') },
        { key: 'typeName', title: this.$t('page.type') },
        { key: 'statusName', title: this.$t('page.status') },
        { key: 'sourceName', title: this.$t('page.source') },
        { key: 'deleteUser', title: this.$t('term.alert.deleteuser') },
        { key: 'alertTime', title: this.$t('term.alert.alerttime'), type: 'time' },
        { key: 'deleteTime', title: this.$t('page.deletetime'), type: 'time' },
        { key: 'action' }
      ],
      isShowDetail: false,
      currentId: null
    };
  },
  beforeCreate() {},
  async created() {
    if (COMMERCIAL_MODULES.includes('alert')) {
      this.TopoDetail = ComponentManager.getVueTemplate('alerttopo-detail');
      this.$api.alert.topo.listTopo().then(res => {
        this.topoList = res.Return;
        if (this.topoList && this.topoList.length > 0) {
          this.topoId = this.topoList[0].id;
        }
      });
    }

    /*if (this.$localStore.get('isAutoRefresh')) {
      this.isAutoRefresh = true;
    }*/
    this.searchAlert();
    this.listAllStatus();
    this.listAllLevel();
    //this.listAlertView();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {
    if (this.intervaler) {
      //clearInterval(this.intervaler);
      //this.intervaler = null;
      this.intervaler.clear();
    }
    if (this.timmer) {
      //clearTimeout(this.timmer);
      //this.timmer = null;
      this.startTime = null;
      this.timmer.clear();
    }
  },
  destroyed() {},
  methods: {
    dropdownClick(name) {
      if (name === 'close') {
        this.batchClose();
      } else if (name === 'open') {
        this.batchOpen();
      } else if (name === 'deleteselect') {
        this.batchDelete();
      } else if (name === 'deletematch') {
        this.batchDeleteMatch();
      }
    },
    changeTopo(topoId) {
      this.topoId = topoId;
    },
    doSearch(attr) {
      this.searchAlert(1);
      this.$set(this.attrPopMap, attr.name, false);
    },
    toggleCountdown() {
      if (this.intervaler) {
        this.intervaler.clear();
      }
      if (this.isAutoRefresh) {
        this.intervaler = this.$utils.setInterval(async() => {
          this.countdown = parseInt(this.interval - (Date.now() - this.startTime));
        }, 1000);
      }
    },
    hasRole(alertData) {
      if (alertData.isDelete) {
        return false;
      }
      if (this.$AuthUtils.hasRole('ALERT_ADMIN')) {
        return true;
      }
      const userInfo = this.$AuthUtils.getCurrentUser();
      if (alertData.userList) {
        if (alertData.userList.find(d => d.userId === userInfo.uuid)) {
          return true;
        }
      }
      if (alertData.teamList && userInfo.teamUuidList) {
        for (let i = 0; i < alertData.teamList.length; i++) {
          const team = alertData.teamList[i];
          if (userInfo.teamUuidList.find(d => d === 'team#' + team.teamUuid)) {
            return true;
          }
        }
      }
      return false;
    },
    listAllLevel() {
      this.$api.alert.alertlevel.listAlertLevel().then(res => {
        this.levelList = res.Return;
      });
    },
    listAllStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    },
    changeLevel(level) {
      if (this.searchParam.level !== level.level) {
        this.$set(this.searchParam, 'level', level.level);
      } else {
        this.$delete(this.searchParam, 'level');
      }
      this.searchAlert(1);
    },
    changeStatus(status) {
      if (this.searchParam.status !== status.name) {
        this.$set(this.searchParam, 'status', status.name);
      } else {
        this.$delete(this.searchParam, 'status');
      }
      this.searchAlert(1);
    },
    changeUpdateTime(time) {
      if (this.searchParam.updateTimeHour !== time) {
        this.$set(this.searchParam, 'updateTimeHour', time);
      } else {
        this.$delete(this.searchParam, 'updateTimeHour');
      }
      this.searchAlert(1);
    },
    toAlertDetail(row) {
      //window.open(HOME + '/alert.html#/alert-trash-detail/' + row.id, '_blank');
      this.currentId = row.id;
      this.isShowDetail = true;
    },
    toggleChildAlert(row) {
      if (!row._loading) {
        if (row['_hasChild']) {
          this.$set(row, '_hasChild', false);
          this.alertData.tbodyList = this.alertData.tbodyList.filter(d => !d['parents'] || !d['parents'].includes(row.id));
        } else {
          this.searchChildAlert(row.id);
        }
      }
    },
    getAttrByName(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
    },
    switchAlertView(view) {
      if (this.searchParam.viewName !== view.name) {
        this.$router.push({ path: '/alert-manage/' + view.name });
      } else {
        this.$router.push({ path: '/alert-manage' });
      }
    },
    listAlertView() {
      this.$api.alert.alert.listAlertView().then(res => {
        this.alertViewList = res.Return;
      });
    },
    editView() {
      this.isViewEdit = true;
    },
    changePageSize(pageSize) {
      if (pageSize) {
        this.searchParam.pageSize = pageSize;
      }
      this.searchAlert(1);
    },
    searchChildAlert(fromAlertId, currentPage, isChangePage) {
      const index = this.alertData.tbodyList.findIndex(d => d.id === fromAlertId);
      if (index <= -1) {
        return;
      }
      const row = this.alertData.tbodyList[index];
      this.childAlertPage[fromAlertId.toString()] = {
        currentPage: currentPage || 1,
        pageSize: 10
      };
      this.$set(row, '_loading', true);

      const searchParam = this.childAlertPage[row.id.toString()];
      searchParam.fromAlertId = row.id;

      this.$api.alert.alert
        .searchAlert(searchParam)
        .then(res => {
          if (isChangePage) {
            //去掉原来展开数据，准备换成第一页
            this.alertData.tbodyList = this.alertData.tbodyList.filter(d => !d['parents'] || !d['parents'].includes(row.id));
          }
          const dataList = res.Return.tbodyList;
          const pageSize = res.Return.pageSize;
          const pageCount = res.Return.pageCount;
          const currentPage = res.Return.currentPage;
          const rowNum = res.Return.rowNum;
          dataList.forEach(d => {
            d['_index'] = (row['_index'] || 0) + 1;
            d['parents'] = [d.fromAlertId];
            if (row['parents']) {
              d['parents'].push(...row['parents']);
            }
            if (!this.hasRole(d)) {
              d.isDisabled = true;
            }
          });
          if (pageCount > 1) {
            dataList[dataList.length - 1]['_pager'] = {
              pageCount: pageCount,
              pageSize: pageSize,
              currentPage: currentPage,
              rowNum: rowNum
            };
            dataList[dataList.length - 1]['_expand'] = true;
          }

          if (index < this.alertData.tbodyList.length - 1) {
            this.alertData.tbodyList.splice(index + 1, 0, ...dataList);
          } else {
            this.alertData.tbodyList.push(...dataList);
          }
          this.$set(row, '_hasChild', true);
          this.childAlertPage[row.id.toString()] = {
            rowNum: res.Return.rowNum,
            pageCount: res.Return.pageCount,
            currentPage: res.Return.currentPage,
            pageSize: res.Return.pageSize
          };
        })
        .finally(() => {
          this.$set(row, '_loading', false);
        });
    },
    async searchAlert(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }

      //提取固定属性
      const { keyword, level, status, source, updateTimeHour, deleteTimeHour } = this.searchVal;
      const param = { keyword, level, status, source, updateTimeHour, deleteTimeHour };

      this.isLoading = true;
      let finalParam = { ...this.searchParam, ...param };
      await this.$api.alert.alerttrash
        .searchAlertTrash(finalParam)
        .then(res => {
          this.alertData = res.Return;
          this.alertData.tbodyList.forEach(item => {
            if (!this.hasRole(item)) {
              item.isDisabled = true;
            }
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  filter: {},
  computed: {
    statusName() {
      if (this.searchParam.status && this.statusList && this.statusList.length > 0) {
        const s = this.statusList.find(d => d.name === this.searchParam.status);
        if (s) {
          return s.label;
        }
      }
      return null;
    },
    updateTimeName() {
      if (this.searchParam.updateTimeHour) {
        if (this.searchParam.updateTimeHour <= 24) {
          return this.$t('term.alert.lasthours', { target: this.searchParam.updateTimeHour });
        } else {
          return this.$t('term.alert.lastdays', { target: this.searchParam.updateTimeHour / 24 });
        }
      }
      return null;
    },
    finalTheadList() {
      let list = [];
      if (this.alertData && this.alertData.theadList) {
        list = this.alertData.theadList;
      }
      return list;
    },
    searchConfig() {
      const config = {
        search: false,
        searchMode: 'clickBtnSearch',
        labelPosition: 'left',
        searchList: [
          {
            type: 'text',
            name: 'keyword',
            label: this.$t('page.keyword')
          },
          {
            type: 'select',
            name: 'level',
            label: this.$t('page.level'),
            valueName: 'level',
            textName: 'label',
            url: '/api/rest/alert/level/list',
            transfer: true
          },
          {
            type: 'select',
            name: 'status',
            label: this.$t('term.alert.alertstatus'),
            url: '/api/rest/alert/status/list',
            valueName: 'name',
            textName: 'label',
            transfer: true
          },
          {
            type: 'select',
            name: 'source',
            label: this.$t('term.alert.alertsource'),
            dynamicUrl: '/api/rest/alert/source/search',
            valueName: 'name',
            textName: 'label',
            rootName: 'tbodyList',
            transfer: true
          },
          {
            type: 'select',
            name: 'updateTimeHour',
            label: this.$t('term.alert.alerttime'),
            dataList: [
              { value: 1, text: this.$t('term.alert.p1hour') },
              { value: 3, text: this.$t('term.alert.p3hour') },
              { value: 24, text: this.$t('term.alert.p24hour') },
              { value: 72, text: this.$t('term.alert.p3day') },
              { value: 168, text: this.$t('term.alert.p7day') }
            ],
            transfer: true
          },
          {
            type: 'select',
            name: 'deleteTimeHour',
            label: this.$t('page.deletetime'),
            dataList: [
              { value: 1, text: this.$t('term.alert.p1hour') },
              { value: 3, text: this.$t('term.alert.p3hour') },
              { value: 24, text: this.$t('term.alert.p24hour') },
              { value: 72, text: this.$t('term.alert.p3day') },
              { value: 168, text: this.$t('term.alert.p7day') }
            ],
            transfer: true
          }
        ]
      };
      return config;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.attr-grid {
  display: grid;
  grid-template-columns: 80px auto;
}
</style>
