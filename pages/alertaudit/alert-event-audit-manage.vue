<template>
  <div>
    <TsContain>
      <template v-slot:topRight>
        <CombineSearcher
          v-model="searchValue"
          v-bind="searchConfig"
          @change="searchAudit(1)"
        ></CombineSearcher>
      </template>
      <template v-slot:content>
        <TsTable
          v-bind="auditData"
          :theadList="theadList"
          :canExpand="true"
          @changeCurrent="searchAudit"
          @changePageSize="changePageSize"
          @toggleExpand="toggleAuditExpand"
        >
          <template v-slot:alert="{ row }">
            <span
              v-if="row.isAlertExists"
              class="text-href"
              @click.stop="gotoAlertDetail(row.alertId)"
            >
              <span v-if="row.alertTitle">{{ row.alertTitle }}</span>
              <span v-else>#{{ row.alertId }}</span>
            </span>
            <span v-else>
              <span>#{{ row.alertId }}</span>
              <Tag class="ml-xs">{{ $t('term.alert.alertnotexists') }}</Tag>
            </span>
          </template>
          <template v-slot:event="{ row }">
            <span>{{ row.eventName || row.event || '-' }}</span>
          </template>
          <template v-slot:handler="{ row }">
            <div class="overflow">
              <span v-if="row.handlerIcon" :class="row.handlerIcon" class="mr-xs"></span>
              <span>{{ row.handlerName || row.handler || '-' }}</span>
              <span v-if="row.handlerName && row.handler" class="text-grey ml-xs">· {{ row.handler }}</span>
            </div>
          </template>
          <template v-slot:status="{ row }">
            <span :class="getStatusClass(row.status)">{{ row.statusName || row.status || '-' }}</span>
          </template>
          <template v-slot:startTime="{ row }">
            <span>{{ row.startTime | formatDate }}</span>
          </template>
          <template v-slot:endTime="{ row }">
            <span v-if="row.endTime">{{ row.endTime | formatDate }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:timeCost="{ row }">
            <span v-if="row.endTime">{{ getTimeCost(row.timeCost) }}</span>
            <span v-else>-</span>
          </template>
          <template v-slot:isAsync="{ row }">
            <span v-if="row.isAsync" class="text-warning">{{ $t('page.yes') }}</span>
            <span v-else>{{ $t('page.no') }}</span>
          </template>
          <template v-slot:expand="{ row }">
            <div v-if="row._expand" class="padding bg-op radius-md">
              <Loading v-if="row.auditTreeLoading" :loadingShow="true"></Loading>
              <AuditItem v-else-if="row.auditTree" :auditList="[row.auditTree]"></AuditItem>
              <div v-else class="text-tip padding">{{ $t('page.nodata') }}</div>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
  </div>
</template>
<script>
export default {
  name: 'AlertEventAuditManage',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    AuditItem: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-eventaudit-list-item.vue')
  },
  data() {
    return {
      searchValue: {},
      searchParam: {
        currentPage: 1,
        pageSize: 20
      },
      auditData: {},
      searchConfig: {
        searchMode: 'clickBtnSearch',
        labelPosition: 'left',
        searchList: [
          {
            type: 'text',
            name: 'alertId',
            label: this.$t('term.alert.alertid')
          },
          {
            type: 'select',
            name: 'event',
            label: this.$t('term.alert.event'),
            url: '/api/rest/alert/event/list',
            valueName: 'name',
            textName: 'label',
            transfer: true
          },
          {
            type: 'select',
            name: 'handler',
            label: this.$t('term.alert.rootplugin'),
            url: '/api/rest/alert/event/plugin/list',
            valueName: 'name',
            textName: 'label',
            transfer: true
          },
          {
            type: 'select',
            name: 'status',
            label: this.$t('page.status'),
            url: '/api/rest/alert/event/audit/status/list',
            valueName: 'value',
            textName: 'text',
            transfer: true
          },
          {
            type: 'datetimerange',
            name: 'timeRange',
            label: this.$t('term.alert.executiontime'),
            format: 'yyyy-MM-dd HH:mm',
            transfer: true
          },
          {
            type: 'radio',
            name: 'hasChild',
            label: this.$t('term.alert.haschildrecord'),
            dataList: [
              { value: 1, text: this.$t('page.yes') },
              { value: 0, text: this.$t('page.no') }
            ]
          }
        ]
      },
      theadList: [
        { key: 'expander', width: 40 },
        { key: 'alert', title: this.$t('term.alert.invokealert') },
        { key: 'event', title: this.$t('term.alert.event') },
        { key: 'handler', title: this.$t('term.alert.rootplugin') },
        { key: 'status', title: this.$t('page.status') },
        { key: 'startTime', title: this.$t('page.starttime') },
        { key: 'endTime', title: this.$t('page.endtime') },
        { key: 'timeCost', title: this.$t('page.timecost') },
        { key: 'isAsync', title: this.$t('term.alert.async') }
      ]
    };
  },
  created() {
    this.searchAudit();
  },
  methods: {
    searchAudit(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      this.$api.alert.alert.searchRootAlertEventAudit({ ...this.searchParam, ...this.searchValue }).then(res => {
        this.auditData = res.Return || {};
        this.setAuditExpandStatus(this.auditData.tbodyList);
      });
    },
    setAuditExpandStatus(tbodyList) {
      // TsTable通过#expander控制行级展开入口，仅有子审计记录的根记录允许展开
      (tbodyList || []).forEach(row => {
        this.$set(row, '#expander', row.hasChild === 1 || row.hasChild === true);
        this.$set(row, '_expand', false);
      });
    },
    changePageSize(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchAudit(1);
    },
    toggleAuditExpand(row, isExpand) {
      const nextExpand = typeof isExpand === 'boolean' ? isExpand : !row._expand;
      this.$set(row, '_expand', nextExpand);
      if (!nextExpand || row.auditTree || row.auditTreeLoading) {
        return;
      }
      this.$set(row, 'auditTreeLoading', true);
      this.$api.alert.alert.getAlertEventAuditTree(row.id).then(res => {
        this.$set(row, 'auditTree', res.Return || null);
      }).finally(() => {
        this.$set(row, 'auditTreeLoading', false);
      });
    },
    gotoAlertDetail(alertId) {
      this.$router.push({ path: '/alert-detail/' + alertId });
    },
    getStatusClass(status) {
      if (status === 'succeed') {
        return 'text-success';
      } else if (status === 'failed') {
        return 'text-error';
      } else if (status === 'breaked') {
        return 'text-warning';
      }
      return 'text-grey';
    },
    getTimeCost(ms) {
      const hours = Math.floor(ms / (1000 * 60 * 60));
      ms %= 1000 * 60 * 60;
      const minutes = Math.floor(ms / (1000 * 60));
      ms %= 1000 * 60;
      const seconds = Math.floor(ms / 1000);
      ms %= 1000;
      const parts = [];
      if (hours > 0) parts.push(this.$t('term.alert.hours', { target: hours }));
      if (minutes > 0) parts.push(this.$t('term.alert.minutes', { target: minutes }));
      if (seconds > 0) parts.push(this.$t('term.alert.seconds', { target: seconds }));
      if (parts.length === 0) parts.push(this.$t('term.alert.milliseconds', { target: ms }));
      return parts.join(' ');
    }
  }
};
</script>
