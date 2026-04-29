<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <div>
        <div class="mb-md">
          <span class="text-grey">策略：</span>
          <span>{{ policy.name }}</span>
          <Tag v-if="policy.handlerLabel" class="ml-xs">{{ policy.handlerLabel }}</Tag>
        </div>
        <Tabs v-model="tabName" @on-click="changeTab">
          <TabPane label="当前状态" name="state">
            <TsTable
              v-bind="stateData"
              :theadList="stateTheadList"
              @changeCurrent="searchState"
              @changePageSize="changeStatePageSize"
            >
              <template v-slot:state="{ row }">
                <span :class="getStateClass(row.state)">{{ getStateText(row.state) }}</span>
              </template>
              <template v-slot:uniqueKey="{ row }">
                <span class="overflow" :title="row.uniqueKey">{{ row.uniqueKey }}</span>
              </template>
              <template v-slot:windowTime="{ row }">
                <div>{{ row.windowStart | formatDate }}</div>
                <div class="text-grey">{{ row.windowEnd | formatDate }}</div>
              </template>
              <template v-slot:openTime="{ row }">
                <div>{{ row.openTime | formatDate }}</div>
                <div class="text-grey">{{ row.openUntil | formatDate }}</div>
              </template>
              <template v-slot:lastTriggerTime="{ row }">
                <span>{{ row.lastTriggerTime | formatDate }}</span>
              </template>
            </TsTable>
          </TabPane>
          <TabPane label="执行审计" name="audit">
            <TsTable
              v-bind="auditData"
              :theadList="auditTheadList"
              @changeCurrent="searchAudit"
              @changePageSize="changeAuditPageSize"
            >
              <template v-slot:status="{ row }">
                <span :class="getAuditStatusClass(row.status)">{{ getAuditStatusText(row.status) }}</span>
              </template>
              <template v-slot:startTime="{ row }">
                <span>{{ row.startTime | formatDate }}</span>
              </template>
              <template v-slot:timeCost="{ row }">
                <span>{{ row.timeCost || 0 }}ms</span>
              </template>
              <template v-slot:error="{ row }">
                <span class="text-error">{{ row.error }}</span>
              </template>
            </TsTable>
          </TabPane>
        </Tabs>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close">{{ $t('page.close') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue')
  },
  props: {
    policy: { type: Object, required: true }
  },
  data() {
    return {
      tabName: 'state',
      stateData: {},
      auditData: {},
      stateSearchParam: {
        currentPage: 1,
        pageSize: 10
      },
      auditSearchParam: {
        currentPage: 1,
        pageSize: 10
      },
      dialogConfig: {
        title: '熔断策略执行情况',
        type: 'modal',
        width: 'large',
        maskClose: false,
        isShow: true
      },
      stateTheadList: [
        { key: 'uniqueKey', title: '熔断对象' },
        { key: 'state', title: '状态' },
        { key: 'triggerCount', title: '窗口触发数' },
        { key: 'skipCount', title: '跳过数' },
        { key: 'windowTime', title: '统计窗口' },
        { key: 'openTime', title: '熔断时间' },
        { key: 'lastTriggerTime', title: '最后触发时间' }
      ],
      auditTheadList: [
        { key: 'alertId', title: '告警ID' },
        { key: 'stateId', title: '状态ID' },
        { key: 'status', title: '结果' },
        { key: 'startTime', title: '执行时间' },
        { key: 'timeCost', title: '耗时' },
        { key: 'error', title: '异常' }
      ]
    };
  },
  created() {
    this.searchState();
    this.searchAudit();
  },
  methods: {
    close() {
      this.$emit('close');
    },
    changeTab(name) {
      if (name === 'state') {
        this.searchState();
      } else if (name === 'audit') {
        this.searchAudit();
      }
    },
    searchState(currentPage) {
      if (currentPage) {
        this.stateSearchParam.currentPage = currentPage;
      }
      this.$api.alert.breaker.searchState({ ...this.stateSearchParam, policyId: this.policy.id }).then(res => {
        this.stateData = res.Return || {};
      });
    },
    searchAudit(currentPage) {
      if (currentPage) {
        this.auditSearchParam.currentPage = currentPage;
      }
      this.$api.alert.breaker.searchAudit({ ...this.auditSearchParam, policyId: this.policy.id }).then(res => {
        this.auditData = res.Return || {};
      });
    },
    changeStatePageSize(pageSize) {
      this.stateSearchParam.pageSize = pageSize;
      this.searchState(1);
    },
    changeAuditPageSize(pageSize) {
      this.auditSearchParam.pageSize = pageSize;
      this.searchAudit(1);
    },
    getStateText(state) {
      if (state === 'OPEN') {
        return '熔断中';
      } else if (state === 'CLOSED') {
        return '关闭';
      }
      return state || '-';
    },
    getStateClass(state) {
      if (state === 'OPEN') {
        return 'text-warning';
      } else if (state === 'CLOSED') {
        return 'text-success';
      }
      return 'text-grey';
    },
    getAuditStatusText(status) {
      if (status === 'OPEN') {
        return '已熔断';
      } else if (status === 'PASS') {
        return '通过';
      } else if (status === 'FAILED') {
        return '异常';
      }
      return status || '-';
    },
    getAuditStatusClass(status) {
      if (status === 'OPEN') {
        return 'text-warning';
      } else if (status === 'PASS') {
        return 'text-success';
      } else if (status === 'FAILED') {
        return 'text-error';
      }
      return 'text-grey';
    }
  }
};
</script>
