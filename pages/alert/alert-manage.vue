<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item">
            <Dropdown placement="bottom-start" trigger="click">
              <div>
                <span class="tsfont-blocklist"></span>
                <span class="tsfont-drop-down"></span>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(view, index) in alertViewList"
                  :key="index"
                  :selected="searchParam.viewName === view.name"
                  @click.native="switchAlertView(view)"
                >
                  <span v-auth="['ALERT_VIEW_MODIFY']" class="tsfont-edit mr-xs" @click.stop="editView(view)"></span>
                  <span>{{ view.label }}</span>
                </DropdownItem>
                <DropdownItem v-auth="['ALERT_VIEW_MODIFY']" divided @click.native="editView()">
                  <span class="tsfont-plus mr-xs"></span>
                  <span>添加视图</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </template>
      <template v-slot:topRight>
        <div class="action-group">
          <div class="action-item" :class="{ 'tsfont-drop-down': !isShowFilter, 'tsfont-drop-up': isShowFilter }" @click="isShowFilter = !isShowFilter">高级搜索</div>
          <div v-if="!isShowFilter" class="action-item">
            <InputSearcher v-model="searchParam.keyword" :width="400" @change="searchAlert(1)"></InputSearcher>
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div v-if="isShowFilter" class="border-base radius-md mb-md padding-md">
          <ConditionGroup v-model="searchParam.rule" :attrList="attrList"></ConditionGroup>
          <div style="text-align: right" class="mt-md">
            <Button type="primary" @click="searchAlert(1)">搜索</Button>
          </div>
        </div>
        <TsTable
          :multiple="true"
          v-bind="alertData"
          :theadList="finalTheadList"
          @changeCurrent="searchAlert"
          @changePageSize="changePageSize"
        >
          <template v-for="(thead, index) in finalTheadList" :slot="thead.key" slot-scope="{ row }">
            <div :key="index">
              <span v-if="thead.key.startsWith('const_')">
                <AlertAttrViewer type="const" :attr="getAttrByName(thead.key)" :value="row[thead.key.replace('const_', '')]"></AlertAttrViewer>
              </span>
              <span v-if="thead.key.startsWith('attr_') && row.attrObj">
                <AlertAttrViewer
                  v-if="row.attrObj[thead.key.replace('attr_', '')]"
                  type="attr"
                  :attr="getAttrByName(thead.key)"
                  :value="row.attrObj[thead.key.replace('attr_', '')].value"
                ></AlertAttrViewer>
              </span>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AlertViewEdit v-if="isViewEdit" :id="currentView && currentView.id" @close="closeAttrEdit"></AlertViewEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    InputSearcher: () => import('@/resources/components/InputSearcher/InputSearcher.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AlertViewEdit: () => import('@/commercial-module/alert/pages/alert/alert-view-edit.vue'),
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue'),
    AlertAttrViewer: () => import('@/commercial-module/alert/pages/alert/alert-attr-viewer.vue')
  },
  props: {},
  data() {
    return {
      alertViewData: null,
      isShowFilter: false,
      currentView: null,
      isViewEdit: false,
      attrList: [],
      searchParam: { mode: 'simple', rule: {} },
      alertData: {},
      rule: {},
      alertViewList: []
      /*theadList: [
        {
          key: 'selection'
        },
        { key: 'level', title: '告警级别' },
        { key: 'title', title: '标题' },
        { key: 'alertTime', title: '告警时间' },
        { key: 'type', title: '类型' },
        { key: 'status', title: '状态' },
        { key: 'source', title: '来源' },
        { key: 'alertCount', title: '告警次数' },
        { key: 'entityType', title: '实体类型' },
        { key: 'entityName', title: '实体名称' },
        { key: 'ip', title: 'ip' }
      ]*/
    };
  },
  beforeCreate() {},
  async created() {
    this.searchParam.viewName = this.$route.params['view'] || '';
    this.searchAlert();
    this.listAlertAttrList();
    this.listAlertView();
    this.getViewByName();
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
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
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
    editView(view) {
      this.isViewEdit = true;
      if (view) {
        this.currentView = view;
      }
    },
    changePageSize(pageSize) {
      if (pageSize) {
        this.searchParam.pageSize = pageSize;
      }
      this.searchAlert(1);
    },
    searchAlert(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      //判断搜索模式组织条件
      if (this.isShowFilter) {
        //高级搜索去掉关键字
        this.searchParam.mode = 'advanced';
        this.searchParam.keyword = '';
      } else {
        //普通搜索还原搜索条件
        this.searchParam.mode = 'simple';
        this.searchParam.rule = this.alertViewData?.config?.rule;
      }
      console.log(JSON.stringify(this.searchParam));
      this.$api.alert.alert.searchAlert(this.searchParam).then(res => {
        this.alertData = res.Return;
      });
    },
    closeAttrEdit() {
      this.isViewEdit = false;
      if (this.currentView && this.currentView.name === this.searchParam.viewName) {
        this.searchAlert(1);
      }
    }
  },
  filter: {},
  computed: {
    finalTheadList() {
      return this.alertData.theadList;
    },
    conditionAttrList() {
      const attrList = [];
      this.attrList &&
        this.attrList.forEach(item => {
          attrList.push({
            name: item.value,
            label: item.text,
            expressionList: ['equal', 'notequal', 'like', 'notlike', 'is-null', 'is-not-null']
          });
        });
      return attrList;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
