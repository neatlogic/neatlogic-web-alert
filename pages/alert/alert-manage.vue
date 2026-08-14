<template>
  <div>
    <TsContain>
      <template v-slot:navigation>
        <span v-if="alertViewData">
          <span>{{ alertViewData.label }}</span>
          <span
            v-auth="['ALERT_VIEW_MODIFY']"
            class="cursor tsfont-setting ml-xs"
            @click="editView"
          ></span>
        </span>
        <span v-else>
          <span>{{ $t('term.alert.allalert') }}</span>
          <span
            v-auth="['ALERT_ALLALERTCONFIG_MODIFY']"
            class="cursor tsfont-setting ml-xs"
            @click="editView"
          ></span>
        </span>
      </template>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item">
            <TsFormSwitch
              v-model="isAutoRefresh"
              :trueText="$t('page.autorefresh')"
              :falseText="$t('page.autorefresh')"
              :trueValue="true"
              :falseValue="false"
              :showStatus="true"
            ></TsFormSwitch>
          </div>
          <div v-if="isAutoRefresh" class="action-item">
            <span
              class="countdown-clock"
              :style="countdownClockStyle"
              :title="countdownText"
            ></span>
          </div>
          <div v-if="COMMERCIAL_MODULES.includes('alert') && topoList && topoList.length > 0" class="action-item">
            <TsFormSwitch
              v-model="isShowTopo"
              :trueText="$t('term.alert.alerttopo')"
              :falseText="$t('term.alert.alerttopo')"
              :trueValue="true"
              :falseValue="false"
              :showStatus="true"
            ></TsFormSwitch>
          </div>
          <div v-if="isShowTopo" class="action-item">
            <Dropdown>
              <span>
                <span v-if="!topoId">{{ $t('dialog.title.choosetarget', { target: $t('page.topo') }) }}</span>
                <span v-else>{{ topoList.find(d => d.id === topoId).name }}</span>
                <span class="tsfont-drop-down"></span>
              </span>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(topo, index) in topoList"
                  :key="index"
                  :selected="topoId === topo.id"
                  @click.native="changeTopo(topo.id)"
                >{{ topo.name }}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div v-if="!isShowTopo && ((selectList && selectList.length > 0) || canDeleteMatch || canBatchRebuildIndex)" class="action-item">
            <Dropdown trigger="click" @on-click="dropdownClick">
              <div>
                {{ $t('page.batchoperation') }}
                <span class="tsfont-drop-down"></span>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem name="close" :disabled="!selectList || selectList.length == 0">{{ $t('term.alert.closeselectedalert') }}</DropdownItem>
                <DropdownItem name="open" :disabled="!selectList || selectList.length == 0">{{ $t('term.alert.openselectedalert') }}</DropdownItem>
                <DropdownItem v-if="$AuthUtils.hasRole('ALERT_INDEX')" name="rebuildindex" :disabled="!selectList || selectList.length == 0 || isRebuildIndexLoading">重建选中告警索引</DropdownItem>
                <DropdownItem v-if="$AuthUtils.hasRole('ALERT_ADMIN')" name="deleteselect" :disabled="!selectList || selectList.length == 0">{{ $t('term.alert.deleteselectedalert') }}</DropdownItem>
                <DropdownItem
                  v-if="canDeleteMatch"
                  divided
                  name="deletematch"
                  :disabled="isDeleteMatchCounting"
                >{{ $t('term.alert.deletematchalert') }}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="action-item">
            <RadioGroup
              v-if="!isShowTopo"
              v-model="searchParam.searchMode"
              size="small"
              type="button"
            >
              <Radio label="tree">
                <Tooltip :content="$t('term.alert.onlysearchparentalert')"><i class="tsfont-tree"></i></Tooltip>
              </Radio>
              <Radio label="flat">
                <Tooltip :content="$t('term.alert.searchallalert')"><i class="tsfont-list"></i></Tooltip>
              </Radio>
            </RadioGroup>
          </div>
        </div>
      </template>
      <template v-slot:topRight>
        <div class="action-group">
          <div class="action-item" style="width: 400px">
            <CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="searchAlert(1)">
              <template v-for="(attr, index) in topAttrList" :slot="'attr_' + attr.name" slot-scope="{ valueConfig, textConfig }">
                <div :key="index">
                  <ConditionItem
                    :value="valueConfig['attr_' + attr.name]"
                    :conditionItem="attr"
                    @change="
                      val => {
                        if (val != null) {
                          $set(valueConfig, 'attr_' + attr.name, val);
                          $set(textConfig, 'attr_' + attr.name, val);
                        } else {
                          $delete(valueConfig, 'attr_' + attr.name);
                          $delete(textConfig, 'attr_' + attr.name);
                        }
                      }
                    "
                  ></ConditionItem>
                </div>
              </template>
            </CombineSearcher>
          </div>
          <div class="action-item" @click="isShowFilter = !isShowFilter">
            <span :class="{ 'tsfont-drop-right': !isShowFilter, 'tsfont-drop-down': isShowFilter }">{{ $t('page.advancesearch') }}</span>
            <span v-if="hasRule" class="text-error tsfont-dot"></span>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="isShowFilter" class="border-base radius-md mb-md padding-md">
          <ConditionGroup v-model="searchParam.rule" :attrList="searchAttrList"></ConditionGroup>
          <div style="text-align: right" class="mt-md">
            <Button
              v-auth="['ALERT_EXPORT']"
              type="primary"
              class="mr-xs"
              ghost
              @click="exportAlert()"
            >
              {{ $t('page.export') }}
            </Button>
            <Button
              type="primary"
              @click="
                isShowFilter = false;
                searchAlert(1);
              "
            >
              {{ $t('page.search') }}
            </Button>
          </div>
        </div>
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
            v-if="finalTheadList && finalTheadList.length > 0"
            :sortList="sortList"
            :sortOrder="sortOrder"
            :sortMapping="sortMapping"
            :multiple="true"
            :value="selectList"
            v-bind="alertData"
            resizeKey="alert-table"
            :canResize="true"
            :canExpand="true"
            :canSelectRow="false"
            keyName="id"
            :theadList="[{ key: 'selection' }, ...finalTheadList, { key: 'action' }]"
            @getSelected="getSelected"
            @changeCurrent="searchAlert"
            @changePageSize="changePageSize"
            @updateSort="updateSort"
          >
            <template v-for="(thead, index) in finalTheadList" :slot="thead.key" slot-scope="{ row }">
              <div v-if="thead.key === 'const_attrObj'" :key="index">
                <div v-if="thead.attrList && thead.attrList.length > 0">
                  <template v-for="(extendattr, aindex) in thead.attrList">
                    <div
                      v-if="getAttrByName(extendattr) && row.attrObj && row.attrObj[extendattr.replace('attr_', '')] !== null && row.attrObj[extendattr.replace('attr_', '')] !== undefined && row.attrObj[extendattr.replace('attr_', '')] !== ''"
                      :key="aindex"
                    >
                      <Tag>
                        <span class="text-grey mr-xs">{{ getAttrByName(extendattr).label }}</span>
                        <span class="text-grey">
                          <b><AlertAttrViewer
                            :view="alertViewData"
                            :attr="getAttrByName(extendattr)"
                            :value="row.attrObj[extendattr.replace('attr_', '')]"
                            @refresh="searchAlert"
                          ></AlertAttrViewer></b>
                        </span>
                      </Tag>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="thead.key.startsWith('const_')" :key="'e' + index">
                <AlertAttrViewer
                  :attr="getAttrByName(thead.key)"
                  :row="row"
                  :view="alertViewData"
                  :value="row[thead.key.replace('const_', '')]"
                  @toggleChildren="toggleChildAlert"
                  @refresh="searchAlert"
                ></AlertAttrViewer>
              </div>
              <div v-else-if="thead.key.startsWith('attr_') && row.attrObj" :key="'f' + index">
                <AlertAttrViewer
                  :view="alertViewData"
                  :attr="getAttrByName(thead.key)"
                  :value="row.attrObj[thead.key.replace('attr_', '')]"
                  @refresh="searchAlert"
                ></AlertAttrViewer>
              </div>
            </template>
            <template v-slot:expand="{ row }">
              <div v-if="row._pager" style="padding-left: 90px">
                <Page
                  class="page-container"
                  transfer
                  size="small"
                  show-total
                  :total="row._pager.rowNum"
                  :current="row._pager.currentPage"
                  :page-size="row._pager.pageSize"
                  @on-change="
                    page => {
                      searchChildAlert(row.fromAlertId, page, true);
                    }
                  "
                />
              </div>
            </template>
            <template v-slot:action="{ row }">
              <div v-if="!row.isDelete" class="tstable-action">
                <ul class="tstable-action-ul">
                  <li
                    v-for="(action, ai) in row.actionList"
                    :key="ai"
                    :class="action.icon"
                    @click="doAction(row, action.script)"
                  >
                    {{ action.label }}
                  </li>
                  <li class="tsfont-list" @click="toAlertDetail(row)">{{ $t('page.detail') }}</li>
                  <li v-if="row.isClose && hasRole(row)" class="tsfont-eye" @click="openAlert(row)">{{ $t('term.alert.open') }}</li>
                  <li v-if="!row.isClose && hasRole(row)" class="tsfont-eye-off" @click="closeAlert(row)">{{ $t('page.close') }}</li>
                  <li v-if="$AuthUtils.hasRole('ALERT_ADMIN')" class="tsfont-trash-o" @click="deleteAlert(row)">{{ $t('page.delete') }}</li>
                </ul>
              </div>
            </template>
          </TsTable>
        </div>
      </template>
    </TsContain>
    <AlertDeleteDialog
      v-if="isDeleteShow"
      :id="currentAlertId"
      :searchParam="deleteMode === 'match' ? deleteSearchParam : finalSearchParam"
      :mode="deleteMode"
      :idList="selectList"
      :matchCount="deleteMatchCount"
      @close="closeAlertDelete"
    ></AlertDeleteDialog>
    <AlertCloseDialog
      v-if="isCloseShow"
      :id="currentAlertId"
      :idList="selectList"
      @close="closeAlertClose"
    ></AlertCloseDialog>
    <AlertOpenDialog
      v-if="isOpenShow"
      :id="currentAlertId"
      :idList="selectList"
      @close="closeAlertOpen"
    ></AlertOpenDialog>
    <ExportDialog
      v-if="isExportShow"
      :alertIdList="selectList"
      :searchVal="searchVal"
      :searchParam="searchParam"
      @close="isExportShow = false"
    ></ExportDialog>
    <AlertViewEdit
      v-if="isViewEdit"
      :id="alertViewData ? alertViewData.id : null"
      :isDefaultConfig="!searchParam.viewName"
      @close="closeViewEdit"
    ></AlertViewEdit>
  </div>
</template>
<script>
import ComponentManager from '@/resources/import/component-manager.js';
export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertViewEdit: () => import('@/community-module/alert/pages/alert/alert-view-edit.vue'),
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue'),
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue'),
    AlertDeleteDialog: () => import('@/community-module/alert/pages/alert/alert-delete-dialog.vue'),
    AlertCloseDialog: () => import('@/community-module/alert/pages/alert/alert-close-dialog.vue'),
    AlertOpenDialog: () => import('@/community-module/alert/pages/alert/alert-open-dialog.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    ConditionItem: () => import('@/resources/components/Condition/condition-item.vue'),
    ExportDialog: () => import('@/community-module/alert/pages/alert/export-dialog.vue')
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
      defaultViewConfig: null,
      isShowFilter: false,
      currentView: null,
      isViewEdit: false,
      attrPopMap: {},
      attrList: [], //列表展示字段元数据
      searchAttrList: [], //搜索条件字段元数据
      statusList: [],
      levelList: [],
      searchParam: { mode: 'simple', rule: {}, attrFilterList: [], searchMode: 'tree' },
      alertData: {},
      attrFilterMap: {},
      rule: {},
      alertViewList: [],
      isDeleteShow: false,
      isCloseShow: false,
      isOpenShow: false,
      currentAlertId: null,
      selectList: [],
      isAutoRefresh: false,
      timmer: null,
      intervaler: null,
      interval: 1 * 30 * 1000,
      startTime: null,
      countdown: 0,
      topoList: [],
      topoId: null,
      topoAlertSize: 1000, //告警拓扑默认查询数据量
      childAlertPage: {}, //记录子告警分页信息
      finalSearchParam: null, //最后的搜索参数，用于批量删除
      deleteSearchParam: null, //批量删除时的搜索条件快照
      deleteMatchCount: 0,
      isDeleteMatchCounting: false,
      isRebuildIndexLoading: false,
      sortData: {},
      sortMapping: {
        down: 'asc',
        up: 'desc',
        none: ''
      },
      isExportShow: false
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

    this.searchParam.viewName = this.$route.params['view'] || '';
    await this.getViewByName();
    await this.listAlertAttrList();
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
    doAction(alertData, script) {
      const fn = new Function(`"use strict"; return (${script});`)();
      try {
        fn.call(this, alertData);
      } catch (e) {
        this.$Notice.error({ title: this.$t('page.exception'), desc: this.$t('term.alert.actionexecexception', { target: e.message }) });
      }
    },
    exportAlert() {
      this.isExportShow = true;
    },
    updateSort(sort) {
      this.sortData = sort;
      this.searchAlert();
    },
    dropdownClick(name) {
      if (name === 'close') {
        this.batchClose();
      } else if (name === 'open') {
        this.batchOpen();
      } else if (name === 'deleteselect') {
        this.batchDelete();
      } else if (name === 'rebuildindex') {
        this.batchRebuildIndex();
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
    hasValidRule(rule) {
      const conditionGroupList = rule && rule.conditionGroupList;
      if (!conditionGroupList || conditionGroupList.length === 0) {
        return false;
      }
      return conditionGroupList.some(conditionGroup => {
        const conditionList = conditionGroup && conditionGroup.conditionList;
        if (!conditionList || conditionList.length === 0) {
          return false;
        }
        return conditionList.some(condition => {
          if (!condition || !condition.id || !condition.expression) {
            return false;
          }
          if (condition.expression === 'is-null' || condition.expression === 'is-not-null') {
            return true;
          }
          return condition.valueList && condition.valueList.length > 0;
        });
      });
    },
    batchClose() {
      if (this.selectList && this.selectList.length > 0) {
        this.isCloseShow = true;
      }
    },
    batchDelete() {
      if (this.selectList && this.selectList.length > 0) {
        this.isDeleteShow = true;
        this.deleteMode = 'select';
        this.deleteSearchParam = null;
        this.deleteMatchCount = 0;
      }
    },
    async batchDeleteMatch() {
      if (!this.canDeleteMatch) {
        this.$Message.warning(this.$t('term.alert.setadvancedconditionfirst'));
        return;
      }
      const deleteSearchParam = this.$utils.deepClone(this.finalSearchParam);
      deleteSearchParam.searchMode = 'flat';
      this.isDeleteMatchCounting = true;
      await this.$api.alert.alert
        .searchAlertCount(deleteSearchParam)
        .then(res => {
          const matchCount = res.Return || 0;
          if (matchCount <= 0) {
            this.$Message.info(this.$t('term.alert.noalertmatched'));
            return;
          }
          this.deleteSearchParam = deleteSearchParam;
          this.deleteMatchCount = matchCount;
          this.isDeleteShow = true;
          this.deleteMode = 'match';
        })
        .finally(() => {
          this.isDeleteMatchCounting = false;
        });
    },
    batchOpen() {
      if (this.selectList && this.selectList.length > 0) {
        this.isOpenShow = true;
      }
    },
    batchRebuildIndex() {
      if (!this.selectList || this.selectList.length === 0 || this.isRebuildIndexLoading) {
        return;
      }
      const idList = this.selectList.slice();
      this.$createDialog({
        title: this.$t('dialog.title.executeconfirm'),
        content: this.$t('term.alert.rebuildselectedalertindexconfirm'),
        'on-ok': async vnode => {
          this.isRebuildIndexLoading = true;
          try {
            await this.$api.alert.alert.batchRebuildIndex(idList);
            this.$Message.success(this.$t('term.alert.submittedbackendrebuildindex'));
            vnode.isShow = false;
          } finally {
            this.isRebuildIndexLoading = false;
          }
        }
      });
    },
    getSelected(indexList, itemList) {
      this.selectList = itemList.map(d => d.id);
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
      window.open(HOME + '/alert.html#/alert-detail/' + row.id, '_blank');
    },
    closeAlertDelete(needRefresh) {
      this.isDeleteShow = false;
      this.currentAlertId = null;
      this.deleteSearchParam = null;
      this.deleteMatchCount = 0;
      if (needRefresh) {
        this.searchAlert();
      }
    },
    closeAlertClose(needRefresh) {
      this.isCloseShow = false;
      this.currentAlertId = null;
      if (needRefresh) {
        this.searchAlert();
        this.selectList = [];
      }
    },
    closeAlertOpen(needRefresh) {
      this.isOpenShow = false;
      this.currentAlertId = null;
      if (needRefresh) {
        this.searchAlert();
        this.selectList = [];
      }
    },
    closeAlert(alert) {
      this.isCloseShow = true;
      this.currentAlertId = alert.id;
      this.selectList = [];
    },
    openAlert(alert) {
      this.isOpenShow = true;
      this.currentAlertId = alert.id;
      this.selectList = [];
    },
    deleteAlert(alert) {
      this.isDeleteShow = true;
      this.deleteMode = 'select';
      this.currentAlertId = alert.id;
      this.deleteSearchParam = null;
      this.deleteMatchCount = 0;
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
    async getViewByName() {
      if (this.searchParam.viewName) {
        await this.$api.alert.alert.getAlertViewByName(this.searchParam.viewName).then(res => {
          this.alertViewData = res.Return;
          this.$set(this.searchParam, 'rule', this.alertViewData?.config?.rule);
          this.setViewSortData(this.alertViewData?.config?.sortList);
        });
      } else {
        this.alertViewData = null;
        await this.$api.alert.alert.getAllAlertConfig('all').then(res => {
          this.defaultViewConfig = res.Return && res.Return.config ? res.Return.config : null;
          this.$set(this.searchParam, 'rule', this.defaultViewConfig?.rule || {});
          this.setViewSortData(this.defaultViewConfig?.sortList);
        });
      }
    },
    setViewSortData(sortList) {
      const sortData = {};
      if (sortList && sortList.length > 0) {
        sortList.forEach(sort => {
          if (typeof sort === 'string') {
            sortData[sort] = 'asc';
          } else if (sort && sort.name) {
            sortData[sort.name] = sort.type || 'asc';
          }
        });
      }
      this.sortData = sortData;
    },
    getAttrByName(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
    },
    async listAlertAttrList() {
      const [searchAttrRes, columnAttrRes] = await Promise.all([
        this.$api.alert.alert.listAlertAttrList({ isSearch: 1 }),
        this.$api.alert.alert.listAlertAttrList({ isColumn: 1 })
      ]);
      this.searchAttrList = searchAttrRes.Return;
      this.attrList = columnAttrRes.Return;
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
    async closeViewEdit(needRefresh) {
      this.isViewEdit = false;
      if (needRefresh) {
        await this.getViewByName();
        await this.listAlertAttrList();
        this.searchAlert(1);
      }
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
      if (this.timmer) {
        clearTimeout(this.timmer);
        this.timmer = null;
        this.startTime = null;
      }
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }

      //提取固定属性
      const { keyword, levelList, statusList, sourceList, updateTimeHour, markNameList, teamIdList, userIdList } = this.searchVal;
      const param = { keyword, updateTimeHour, markNameList, teamIdList, userIdList, levelList, statusList, sourceList };
      //提取扩展属性
      const attrFilterList = [];
      for (let key in this.searchVal) {
        if (key.startsWith('attr_')) {
          const val = this.searchVal[key];
          if (val !== null && val !== '') {
            let valueList = [];
            if (val instanceof Array) {
              valueList = val;
            } else {
              valueList = [val];
            }
            attrFilterList.push({ name: key.substring(5), valueList: valueList });
          }
        }
      }

      //this.searchParam.attrFilterList = attrFilterList;
      this.isLoading = true;
      let finalParam;
      if (this.isShowTopo) {
        //如果展示拓扑，默认查出最近1000条数据
        finalParam = { ...this.searchParam, attrFilterList: attrFilterList, ...param, pageSize: this.topoAlertSize };
      } else {
        finalParam = { ...this.searchParam, attrFilterList: attrFilterList, ...param };
      }
      if (!this.$utils.isEmptyObj(this.sortData)) {
        finalParam.sortData = this.sortData;
      }
      this.finalSearchParam = {};
      Object.assign(this.finalSearchParam, finalParam);
      await this.$api.alert.alert
        .searchAlert(finalParam)
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
    canBatchRebuildIndex() {
      return this.$AuthUtils.hasRole('ALERT_INDEX') && this.selectList && this.selectList.length > 0;
    },
    canDeleteMatch() {
      return this.$AuthUtils.hasRole('ALERT_BATCH_DELETE') && this.hasValidRule(this.finalSearchParam && this.finalSearchParam.rule);
    },
    hasRule() {
      if (this.searchParam.rule && this.searchParam.rule.conditionGroupList && this.searchParam.rule.conditionGroupList.length > 0) {
        return true;
      }
      return false;
    },
    levelName() {
      if (this.searchParam.level && this.levelList && this.levelList.length > 0) {
        const s = this.levelList.find(d => d.level === this.searchParam.level);
        if (s) {
          return s.label;
        }
      }
      return null;
    },
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
    countdownText() {
      const second = Math.max(Math.ceil(this.countdown / 1000), 0);
      return this.$t('term.alert.autorefreshcountdown', { target: second });
    },
    countdownClockStyle() {
      const countdown = this.interval > 0 ? ((this.countdown % this.interval) + this.interval) % this.interval : 0;
      const ratio = this.interval > 0 ? (this.interval - countdown) / this.interval : 0;
      return {
        '--countdown-progress': `${Math.max(ratio, 0) * 100}`
      };
    },
    finalTheadList() {
      let list = [];
      if (this.alertData && this.alertData.theadList) {
        list = this.alertData.theadList;
      }
      return list;
    },
    sortList() {
      let list = [];
      if (this.alertData && this.alertData.theadList) {
        list = this.alertData.theadList.filter(d => d.sort).map(d => d.key);
      }
      return list;
    },
    sortOrder() {
      const list = [];
      if (!this.$utils.isEmptyObj(this.sortData)) {
        Object.keys(this.sortData).forEach(key => {
          list.push({ [key]: this.sortData[key] });
        });
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
            name: 'levelList',
            label: this.$t('term.cmdb.alertlevel'),
            multiple: true,
            valueName: 'level',
            textName: 'label',
            url: '/api/rest/alert/level/list',
            transfer: true
          },
          {
            type: 'select',
            name: 'statusList',
            label: this.$t('term.alert.alertstatus'),
            multiple: true,
            url: '/api/rest/alert/status/list',
            valueName: 'name',
            textName: 'label',
            transfer: true
          },
          {
            type: 'select',
            name: 'sourceList',
            label: this.$t('term.alert.alertsource'),
            multiple: true,
            dynamicUrl: '/api/rest/alert/source/search',
            valueName: 'name',
            textName: 'label',
            rootName: 'tbodyList',
            transfer: true
          },
          {
            type: 'select',
            name: 'markNameList',
            label: this.$t('term.alert.alerttag'),
            multiple: true,
            dynamicUrl: '/api/rest/alert/mark/search',
            valueName: 'name',
            textName: 'name',
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
            type: 'userselect',
            name: 'teamIdList',
            label: this.$t('term.alert.workerteam'),
            groupList: ['team'],
            multiple: true,
            transfer: true
          },
          {
            type: 'userselect',
            name: 'userIdList',
            label: this.$t('page.dealwidthuser'),
            groupList: ['user'],
            multiple: true,
            transfer: true
          }
        ]
      };
      if (this.topAttrList && this.topAttrList.length > 0) {
        this.topAttrList.forEach(attr => {
          config.searchList.push({
            type: 'slot',
            name: 'attr_' + attr.name,
            label: attr.label
          });
        });
      }
      return config;
    },
    topAttrList() {
      const attrList = [];
      this.searchAttrList &&
        this.searchAttrList.forEach(item => {
          if (item.isTop) {
            attrList.push(item);
          }
        });
      return attrList;
    }
  },
  watch: {
    'searchParam.searchMode': {
      handler: function(val) {
        this.searchAlert(1);
      },
      deep: true
    },
    isAutoRefresh: {
      handler: function(val) {
        this.$localStore.set('isAutoRefresh', val);
        if (val) {
          //this.searchAlert();
          this.timer = this.$utils.setInterval(async() => {
            this.startTime = Date.now();
            await this.searchAlert();
          }, this.interval);
        } else {
          if (this.timmer) {
            this.timer.clear();
          }
        }
        this.toggleCountdown();
      }
    },
    isShowTopo: {
      handler: function(val) {
        if (val) {
          //清空批量选中数据
          this.selectList = [];
        }
        //切换模式触发一次搜索
        this.searchAlert(1);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.attr-grid {
  display: grid;
  grid-template-columns: 80px auto;
}
</style>
