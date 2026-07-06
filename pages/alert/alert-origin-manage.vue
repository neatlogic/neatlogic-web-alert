<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <span v-auth="['ALERT_ADMIN']"><AuditConfig auditName="ALERT-ORIGIN" :help="$t('term.alert.originretentionhelp')"></AuditConfig></span>
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
            <Poptip
              v-if="row.error"
              trigger="hover"
              word-wrap
              :transfer="true"
              placement="right"
              width="450"
              :title="$t('page.exception')"
              :content="row.error"
            >
              <span class="cursor text-error tsfont-warning-s"></span>
            </Poptip>
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
            label: this.$t('page.keyword'),
            name: 'keyword'
          },
          {
            type: 'radio',
            label: this.$t('page.status'),
            name: 'status',
            dataList: [
              { value: 'succeed', text: this.$t('page.success') },
              { value: 'failed', text: this.$t('page.fail') }
            ]
          },
          {
            type: 'select',
            label: this.$t('page.type'),
            name: 'type',
            transfer: true,
            dynamicUrl: '/api/rest/alert/alerttype/search',
            rootName: 'tbodyList',
            valueName: 'name',
            textName: 'label'
          },
          {
            type: 'select',
            label: this.$t('term.alert.adaptor'),
            name: 'adaptor',
            transfer: true,
            url: '/api/rest/alert/adaptorname/list',
            valueName: 'name',
            textName: 'label'
          },
          {
            type: 'datetimerange',
            name: 'timeRange',
            format: 'yyyy-MM-dd HH:mm',
            label: this.$t('page.time'),
            transfer: true
          }
        ]
      },
      alertOriginData: {},
      theadList: [
        {
          key: 'type',
          title: this.$t('page.type')
        },
        { key: 'adaptor', title: this.$t('term.alert.adaptor') },
        { key: 'sourceName', title: this.$t('page.source') },
        { key: 'time', title: this.$t('page.time'), type: 'time' },
        { key: 'status', title: this.$t('term.alert.processstatus') },
        { key: 'content', title: this.$t('page.content') },
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
