<template>
  <div>
    <Loading v-if="isLoading" :loadingShow="true" type="fix"></Loading>
    <div class="mb-md" style="text-align: right; width: 500px">
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
    <TsTable
      v-if="finalTheadList && finalTheadList.length > 0"
      :multiple="true"
      v-bind="alertData"
      resizeKey="alert-table"
      :canResize="true"
      :canExpand="true"
      keyName="id"
      :theadList="[...finalTheadList, { key: 'action' }]"
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
            <li class="tsfont-list" @click="toAlertDetail(row)">{{ $t('page.detail') }}</li>
            <li v-if="row.isClose && hasRole(row)" class="tsfont-eye" @click="openAlert(row)">打开</li>
            <li v-if="!row.isClose && hasRole(row)" class="tsfont-eye-off" @click="closeAlert(row)">{{ $t('page.close') }}</li>
            <li v-if="$AuthUtils.hasRole('ALERT_ADMIN')" class="tsfont-trash-o" @click="deleteAlert(row)">{{ $t('page.delete') }}</li>
          </ul>
        </div>
      </template>
    </TsTable>
    <AlertDeleteDialog
      v-if="isDeleteShow"
      :id="currentAlertId"
      :idList="selectList"
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
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue'),
    ConditionItem: () => import('@/resources/components/Condition/condition-item.vue'),
    AlertDeleteDialog: () => import('@/community-module/alert/pages/alert/alert-delete-dialog.vue'),
    AlertCloseDialog: () => import('@/community-module/alert/pages/alert/alert-close-dialog.vue'),
    AlertOpenDialog: () => import('@/community-module/alert/pages/alert/alert-open-dialog.vue')
  },
  props: {
    fromAlertId: { type: Number }
  },
  data() {
    return {
      isLoading: false,
      searchVal: {},
      alertViewData: null,
      isShowFilter: false,
      currentView: null,
      isViewEdit: false,
      attrPopMap: {},
      attrList: [], //列表展示字段元数据
      searchAttrList: [], //搜索条件字段元数据
      statusList: [],
      levelList: [],
      searchParam: {
        fromAlertId: this.fromAlertId,
        viewName: '',
        pageSize: 10,
        mode: 'simple',
        rule: {},
        attrFilterList: []
      },
      alertData: {},
      attrFilterMap: {},
      rule: {},
      alertViewList: [],
      isDeleteShow: false,
      isCloseShow: false,
      isOpenShow: false,
      currentAlertId: null,
      timmer: null,
      intervaler: null,
      interval: 60000,
      startTime: null,
      countdown: 0,
      childAlertPage: {} //记录子告警分页信息
    };
  },
  beforeCreate() {},
  async created() {
    await this.listAlertAttrList();
    this.searchAlert();
    this.listAllStatus();
    this.listAllLevel();
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
      }
    },
    closeAlertOpen(needRefresh) {
      this.isOpenShow = false;
      this.currentAlertId = null;
      if (needRefresh) {
        this.searchAlert();
      }
    },
    closeAlert(alert) {
      this.isCloseShow = true;
      this.currentAlertId = alert.id;
    },
    openAlert(alert) {
      this.isOpenShow = true;
      this.currentAlertId = alert.id;
    },
    deleteAlert(alert) {
      this.isDeleteShow = true;
      this.currentAlertId = alert.id;
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
    async listAlertAttrList() {
      const searchParam = this.searchParam.viewName ? { viewName: this.searchParam.viewName, isSearch: 1 } : { isSearch: 1 };
      const columnParam = this.searchParam.viewName ? { viewName: this.searchParam.viewName, isColumn: 1 } : { isColumn: 1 };
      const [searchAttrRes, columnAttrRes] = await Promise.all([
        this.$api.alert.alert.listAlertAttrList(searchParam),
        this.$api.alert.alert.listAlertAttrList(columnParam)
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
      this.isLoading = true;
      this.$api.alert.alert
        .searchAlert({ ...this.searchParam, attrFilterList: attrFilterList, ...param })
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
      this.searchAttrList &&
        this.searchAttrList.forEach(item => {
          if (item.isTop) {
            attrList.push(item);
          }
        });
      return attrList;
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
