<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <span v-auth="['ALERT_ADMIN']"><AuditConfig auditName="ALERT-ORIGIN" help="不设置代表不自动清理接入记录。系统只会清理没有生成告警的接入记录，已经生成告警的接入记录只能跟随告警一起删除"></AuditConfig></span>
      </template>
      <template v-slot:topRight>
        <CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="searchAlertOrigin(1)">
        </CombineSearcher>
      </template>
      <template v-slot:content>
        <TsTable v-bind="alertOriginData" :theadList="theadList" @changeCurrent="searchAlertOrigin">
          <template v-slot:status="{ row }">
            <span v-if="row.status === 'succeed'" class="text-success">{{ $t('page.success') }}</span>
            <span v-else-if="row.status === 'failed'" class="text-error">{{ $t('page.fail') }}</span>
            <span v-else-if="row.status === 'ignored'" class="text-info">{{ $t('page.ignore') }}</span>
          </template>
          <template v-slot:content="{ row }">
            <div v-if="row.highlightMap && row.highlightMap.content">
              <div
                v-for="(c, cindex) in row.highlightMap.content"
                :key="cindex"
                class="div-content text-grey"
                v-html="c"
              ></div>
            </div>
            <div v-else class="div-content text-primary">{{ row.content }}</div>
          </template>
          <template v-slot:error="{ row }">
            <div v-if="row.highlightMap && row.highlightMap.error">
              <div
                v-for="(c, cindex) in row.highlightMap.error"
                :key="cindex"
                class="div-content text-grey"
                v-html="c"
              ></div>
            </div>
            <div v-else-if="row.error" class="div-content text-error" style="max-width: 500px; white-space: normal">{{ row.error }}</div>
            <span v-else>-</span>
          </template>
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="showAlertView(row)">{{ $t('page.detail') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AlertOriginView v-if="isShowView" :alertId="currentAlertId" @close="closeAlertView()"></AlertOriginView>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    AlertOriginView: () => import('@/community-module/alert/pages/alert/alert-origin-view.vue'),
    AuditConfig: () => import('@/views/components/auditconfig/auditconfig.vue')
  },
  props: {},
  data() {
    return {
      searchVal: {},
      searchParam: {},
      isShowView: false,
      currentAlertId: null,
      searchConfig: {
        search: false,
        searchMode: 'clickBtnSearch',
        labelPosition: 'left',
        searchList: [
          {
            type: 'text',
            label: '关键字',
            name: 'keyword'
          },
          {
            type: 'radio',
            label: '状态',
            name: 'status',
            dataList: [
              { value: 'succeed', text: '成功' },
              { value: 'failed', text: '失败' }
            ]
          },
          {
            type: 'select',
            label: '类型',
            name: 'type',
            transfer: true,
            dynamicUrl: '/api/rest/alert/alerttype/search',
            rootName: 'tbodyList',
            valueName: 'name',
            textName: 'label'
          },
          {
            type: 'select',
            label: '适配器',
            name: 'adaptor',
            transfer: true,
            url: '/api/rest/alert/adaptorname/list',
            valueName: 'name',
            textName: 'label'
          },
          /*{
            type: 'text',
            label: '异常',
            name: 'error'
          },*/
          {
            type: 'datetimerange',
            name: 'timeRange',
            format: 'yyyy-MM-dd HH:mm',
            label: '时间',
            transfer: true
          }
        ]
      },
      alertOriginData: {},
      theadList: [
        {
          key: 'type',
          title: '类型'
        },
        { key: 'adaptor', title: '适配器' },
        { key: 'sourceName', title: '来源' },
        { key: 'time', title: '时间', type: 'time' },
        { key: 'status', title: '处理状态' },
        { key: 'content', title: '内容' },
        { key: 'error', title: '异常' },
        { key: 'action' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertOrigin();
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
    showAlertView(alert) {
      this.isShowView = true;
      this.currentAlertId = alert.id;
    },
    closeAlertView() {
      this.isShowView = false;
      this.currentAlertId = null;
    },
    searchAlertOrigin(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      this.$api.alert.alert.searchOriginalAlert({ ...this.searchVal, ...this.searchParam }).then(res => {
        this.alertOriginData = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {
  }
};
</script>
<style lang="less" scoped>
.div-content {
  word-wrap: break-all;
  word-break: break-all;
  white-space: normal;
}
</style>
<style lang="less">
.highlight {
  color: red;
}
</style>
