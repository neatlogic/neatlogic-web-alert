<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item">
            <Dropdown trigger="click">
              <Button type="primary" ghost :disabled="!selectList || selectList.length == 0">
                {{ $t('page.batchoperation') }}
                <span class="tsfont-down"></span>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="batchClose()">关闭告警</DropdownItem>
                <DropdownItem @click.native="batchOpen()">打开告警</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="action-item">
            <Dropdown placement="bottom-start" trigger="click">
              <div>
                <span v-if="alertViewData">{{ alertViewData.label }}</span>
                <span v-else>所有告警</span>
                <span v-if="alertViewData" class="tsfont-drop-down"></span>
              </div>
              <DropdownMenu v-if="alertViewData" slot="list" v-auth="['ALERT_VIEW_MODIFY']">
                <DropdownItem>
                  <span class="tsfont-edit" @click.stop="editView()">{{ $t('dialog.title.edittarget', { target: $t('term.cmdb.view') }) }}</span>
                </DropdownItem>
                <DropdownItem>
                  <span class="tsfont-trash-o" @click.stop="deleteView()">{{ $t('dialog.title.deletetarget', { target: $t('term.cmdb.view') }) }}</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div class="action-item">
            <TsFormSwitch
              v-model="isAutoRefresh"
              trueText="自动刷新"
              falseText="自动刷新"
              :trueValue="true"
              :falseValue="false"
              :showStatus="true"
            ></TsFormSwitch>
          </div>
          <div v-if="isAutoRefresh" class="action-item">
            <span>
              <Progress
                v-if="countdown > 0"
                hide-info
                style="width: 30px"
                :percent="(countdown / interval) * 100"
              />
            </span>
          </div>
        </div>
      </template>
      <template v-slot:topRight>
        <div class="action-group">
          <div class="action-item" style="width: 450px">
            <CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="searchAlert(1)">
              <template v-for="(attr, index) in topAttrList" :slot="'attr_' + attr.name" slot-scope="{ valueConfig, textConfig }">
                <div :key="index">
                  <ConditionItem
                    :value="valueConfig['attr_'+attr.name]"
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
          <!--<div v-if="!isShowFilter" class="action-item">
            <Button type="primary" @click="searchAlert(1)">{{ $t('page.search') }}</Button>
          </div>-->
          <div class="action-item" @click="isShowFilter = !isShowFilter">
            <Button type="primary" ghost @click="searchAlert(1)">
              <span :class="{ 'tsfont-drop-right': !isShowFilter, 'tsfont-drop-down': isShowFilter }">{{ $t('page.advancesearch') }}</span>
            </Button>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="isShowFilter" class="border-base radius-md mb-md padding-md">
          <ConditionGroup v-model="searchParam.rule" :attrList="attrList"></ConditionGroup>
          <div style="text-align: right" class="mt-md">
            <Button type="primary" @click="searchAlert(1)">{{ $t('page.search') }}</Button>
          </div>
        </div>
        <TsTable
          v-if="finalTheadList && finalTheadList.length > 0"
          :multiple="true"
          :value="selectList"
          v-bind="alertData"
          resizeKey="alert-table"
          :canResize="true"
          keyName="id"
          :theadList="[{ key: 'selection' }, ...finalTheadList, { key: 'action' }]"
          @getSelected="getSelected"
          @changeCurrent="searchAlert"
          @changePageSize="changePageSize"
        >
          <template v-for="(thead, index) in finalTheadList" :slot="thead.key" slot-scope="{ row }">
            <div v-if="thead.key === 'const_attrObj'" :key="index">
              <div v-if="thead.attrList && thead.attrList.length > 0">
                <template v-for="(extendattr, aindex) in thead.attrList">
                  <div v-if="getAttrByName(extendattr) && row.attrObj && row.attrObj[extendattr.replace('attr_', '')]" :key="aindex">
                    <Tag>
                      <span class="text-grey mr-xs">{{ getAttrByName(extendattr).label }}</span>
                      <span class="text-grey">
                        <b><AlertAttrViewer
                          v-if="row.attrObj[extendattr.replace('attr_', '')]"
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
            <div v-else-if="thead.key.startsWith('const_')" :key="index">
              <AlertAttrViewer
                :attr="getAttrByName(thead.key)"
                :row="row"
                :view="alertViewData"
                :value="row[thead.key.replace('const_', '')]"
                @toggleChildren="toggleChildAlert"
                @refresh="searchAlert"
              ></AlertAttrViewer>
            </div>
            <div v-else-if="thead.key.startsWith('attr_') && row.attrObj" :key="index">
              <AlertAttrViewer
                :view="alertViewData"
                :attr="getAttrByName(thead.key)"
                :value="row.attrObj[thead.key.replace('attr_', '')]"
                @refresh="searchAlert"
              ></AlertAttrViewer>
            </div>
          </template>
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-list" @click="toAlertDetail(row)">{{ $t('page.detail') }}</li>
                <li v-if="hasRole(row)" class="tsfont-close-o" @click="closeAlert(row)">{{ $t('page.close') }}</li>
                <li v-if="$AuthUtils.hasRole('ALERT_ADMIN')" class="tsfont-trash-o" @click="deleteAlert(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AlertViewEdit v-if="isViewEdit && alertViewData && alertViewData.id" :id="alertViewData.id" @close="closeViewEdit"></AlertViewEdit>
    <AlertDeleteDialog v-if="isDeleteShow && currentAlertId" :id="currentAlertId" @close="closeAlertDelete"></AlertDeleteDialog>
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
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertViewEdit: () => import('@/commercial-module/alert/pages/alert/alert-view-edit.vue'),
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue'),
    AlertAttrViewer: () => import('@/commercial-module/alert/pages/alert/alert-attr-viewer.vue'),
    AlertDeleteDialog: () => import('@/commercial-module/alert/pages/alert/alert-delete-dialog.vue'),
    AlertCloseDialog: () => import('@/commercial-module/alert/pages/alert/alert-close-dialog.vue'),
    AlertOpenDialog: () => import('@/commercial-module/alert/pages/alert/alert-open-dialog.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    ConditionItem: () => import('@/resources/components/Condition/condition-item.vue')
  },
  props: {},
  data() {
    return {
      searchVal: {},
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
      selectList: [],
      isAutoRefresh: false,
      timmer: null,
      intervaler: null,
      interval: 60000,
      startTime: null,
      countdown: 0
    };
  },
  beforeCreate() {},
  async created() {
    await this.listAlertAttrList();
    if (this.$localStore.get('isAutoRefresh')) {
      this.isAutoRefresh = true;
    }
    this.searchParam.viewName = this.$route.params['view'] || '';
    this.searchAlert();
    this.listAllStatus();
    this.listAllLevel();
    //this.listAlertView();
    this.getViewByName();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {
    if (this.intervaler) {
      clearInterval(this.intervaler);
      this.intervaler = null;
    }
    if (this.timmer) {
      clearTimeout(this.timmer);
      this.timmer = null;
      this.startTime = null;
    }
  },
  destroyed() {},
  methods: {
    doSearch(attr) {
      this.searchAlert(1);
      this.$set(this.attrPopMap, attr.name, false);
    },
    toggleCountdown() {
      if (this.intervaler) {
        clearInterval(this.intervaler);
        this.intervaler = null;
      }
      if (this.isAutoRefresh) {
        this.intervaler = setInterval(() => {
          this.countdown = parseInt(this.interval - (Date.now() - this.startTime));
        }, 1000);
      }
    },
    hasRole(alertData) {
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
    batchClose() {
      if (this.selectList && this.selectList.length > 0) {
        this.isCloseShow = true;
      }
    },
    batchOpen() {
      if (this.selectList && this.selectList.length > 0) {
        this.isOpenShow = true;
      }
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
    deleteAlert(alert) {
      this.isDeleteShow = true;
      this.currentAlertId = alert.id;
    },
    toggleChildAlert(row) {
      if (!row._loading) {
        const index = this.alertData.tbodyList.findIndex(d => d.id === row.id);
        if (index > -1) {
          if (row['_expand']) {
            this.$set(row, '_expand', false);
            this.alertData.tbodyList = this.alertData.tbodyList.filter(d => !d['parents'] || !d['parents'].includes(row.id));
          } else {
            this.searchChildAlert(row, index);
          }
        }
      }
    },
    getViewByName() {
      if (this.searchParam.viewName) {
        this.$api.alert.alert.getAlertViewByName(this.searchParam.viewName).then(res => {
          this.alertViewData = res.Return;
          this.searchParam.rule = this.alertViewData?.config?.rule;
        });
      }
    },
    getAttrByName(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
    },
    async listAlertAttrList() {
      await this.$api.alert.alert.listAlertAttrList(this.searchParam.viewName ? { viewName: this.searchParam.viewName } : {}).then(res => {
        this.attrList = res.Return;
      });
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
      console.log(this.alertViewData);
    },
    deleteView() {
      this.$createDialog({
        title: this.$t('dialog.title.deletetarget', { target: this.$t('term.cmdb.view') }),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('term.cmdb.view') }),
        'on-ok': vnode => {
          this.$api.alert.alert.deleteAlertView(this.alertViewData.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              //删除视图用del，菜单会根据action来判断是否更换当前视图
              this.$store.commit('leftMenu/setAlertViewCount', 'del');
              vnode.isShow = false;
            }
          });
        }
      });
    },
    changePageSize(pageSize) {
      if (pageSize) {
        this.searchParam.pageSize = pageSize;
      }
      this.searchAlert(1);
    },
    searchChildAlert(row, index) {
      const searchParam = {};
      searchParam.fromAlertId = row.id;
      this.$set(row, '_loading', true);
      this.$api.alert.alert
        .searchAlert(searchParam)
        .then(res => {
          const dataList = res.Return.tbodyList;
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
          if (index < this.alertData.tbodyList.length - 1) {
            this.alertData.tbodyList.splice(index + 1, 0, ...dataList);
          } else {
            this.alertData.tbodyList.push(...dataList);
          }
          this.$set(row, '_expand', true);
        })
        .finally(() => {
          this.$set(row, '_loading', false);
        });
    },
    searchAlert(currentPage) {
      if (this.timmer) {
        clearTimeout(this.timmer);
        this.timmer = null;
        this.startTime = null;
      }
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      //判断搜索模式组织条件
      if (this.isShowFilter) {
        //高级搜索去掉关键字
        this.searchParam.mode = 'advanced';
        //this.searchParam.keyword = '';
      } else {
        //普通搜索还原搜索条件
        this.searchParam.mode = 'simple';
        this.searchParam.rule = this.alertViewData?.config?.rule;
      }
     
      //提取固定属性
      const { keyword, level, status, updateTimeHour } = this.searchVal;
      const param = { keyword, level, status, updateTimeHour };
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
      this.$api.alert.alert.searchAlert({ ...this.searchParam, attrFilterList: attrFilterList, ...param }).then(res => {
        this.alertData = res.Return;
        this.alertData.tbodyList.forEach(item => {
          if (!this.hasRole(item)) {
            item.isDisabled = true;
          }
        });
        if (this.isAutoRefresh) {
          this.startTime = Date.now();
          this.toggleCountdown();
          this.timmer = setTimeout(() => {
            this.searchAlert();
          }, this.interval);
        }
      });
    },
    closeViewEdit(needRefresh) {
      this.isViewEdit = false;
      if (needRefresh) {
        this.searchAlert(1);
      }
    }
  },
  filter: {},
  computed: {
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
          return '最近' + this.searchParam.updateTimeHour + '小时';
        } else {
          return '最近' + this.searchParam.updateTimeHour / 24 + '天';
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
        search: true,
        labelPosition: 'left',
        searchList: [
          {
            type: 'select',
            name: 'level',
            label: '告警级别',
            valueName: 'level',
            textName: 'label',
            url: '/api/rest/alert/level/list',
            transfer: true
          },
          {
            type: 'select',
            name: 'status',
            label: '告警状态',
            url: '/api/rest/alert/status/list',
            valueName: 'name',
            textName: 'label',
            transfer: true
          },
          {
            type: 'select',
            name: 'updateTimeHour',
            label: '告警时间',
            dataList: [
              { value: 1, text: '最近1小时' },
              { value: 3, text: '最近3小时' },
              { value: 24, text: '最近24小时' },
              { value: 72, text: '最近3天' },
              { value: 168, text: '最近7天' }
            ],
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
      this.attrList &&
        this.attrList.forEach(item => {
          if (item.isTop) {
            attrList.push(item);
          }
        });
      return attrList;
    }
  },
  watch: {
    isAutoRefresh: {
      handler: function(val) {
        this.$localStore.set('isAutoRefresh', val);
        if (val) {
          this.searchAlert();
        } else {
          if (this.timmer) {
            clearTimeout(this.timmer);
            this.timmer = null;
          }
          this.toggleCountdown();
        }
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
