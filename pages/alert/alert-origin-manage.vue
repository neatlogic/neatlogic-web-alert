<template>
  <div>
    <TsContain>
      <template v-slot:topRight>
        <CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="searchAlertOrigin(1)"></CombineSearcher>
      </template>
      <template v-slot:content>
        <TsTable v-bind="alertOriginData" :theadList="theadList" @changeCurrent="searchAlertOrigin">
          <template v-slot:status="{ row }">
            <span v-if="row.status === 'succeed'" class="text-success">{{ $t('page.success') }}</span>
            <span v-else-if="row.status === 'failed'" class="text-error">{{ $t('page.fail') }}</span>
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
            <div v-else class="div-content text-grey">{{ row.content }}</div>
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
            <div v-else-if="row.error" class="div-content text-grey">{{ row.error }}</div>
            <span v-else>-</span>
          </template>
          <!--<template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit">编辑</li>
                <li class="tsfont-trash-o">删除</li>
              </ul>
            </div>
          </template>-->
        </TsTable>
      </template>
    </TsContain>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue')
  },
  props: {},
  data() {
    return {
      searchVal: {},
      searchParam: {},
      searchConfig: {
        search: true,
        labelPosition: 'left',
        searchList: [
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
  watch: {}
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
