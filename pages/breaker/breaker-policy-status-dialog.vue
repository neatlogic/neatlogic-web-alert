<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <div>
        <div class="mb-md">
          <span class="text-grey">{{ $t('term.alert.breakerpolicy') }}:</span>
          <span>{{ policy.name }}</span>
          <Tag v-if="policy.handlerLabel" class="ml-xs">{{ policy.handlerLabel }}</Tag>
        </div>
        <Tabs v-model="tabName" @on-click="changeTab">
          <TabPane :label="$t('term.alert.currentstatus')" name="state">
            <TsTable
              v-bind="stateData"
              :theadList="stateTheadList"
              :canExpand="true"
              @changeCurrent="searchState"
              @changePageSize="changeStatePageSize"
              @toggleExpand="toggleStateExpand"
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
              <template v-slot:expand="{ row }">
                <div v-if="row._expand" class="state-expand bg-op radius-md padding">
                  <div class="mb-md">
                    <div class="text-title mb-xs">{{ $t('term.alert.hitmanyalarms') }}</div>
                    <TsTable
                      v-bind="row.hitAuditData || {}"
                      :theadList="hitAuditTheadList"
                      height="auto"
                      @changeCurrent="currentPage => searchStateHitAudit(row, currentPage)"
                      @changePageSize="pageSize => changeStateHitAuditPageSize(row, pageSize)"
                    >
                      <template v-slot:status="{ row: auditRow }">
                        <span :class="getAuditStatusClass(auditRow.status)">{{ auditRow.statusText || auditRow.status || '-' }}</span>
                      </template>
                      <template v-slot:alertTitle="{ row: auditRow }">
                        <span v-if="auditRow.alertId" class="text-href" @click="toAlertDetail(auditRow)">{{ auditRow.alertTitle || ('#' + auditRow.alertId) }}</span>
                        <span v-else>-</span>
                      </template>
                      <template v-slot:startTime="{ row: auditRow }">
                        <span>{{ auditRow.startTime | formatDate }}</span>
                      </template>
                      <template v-slot:timeCost="{ row: auditRow }">
                        <span>{{ auditRow.timeCost || 0 }}ms</span>
                      </template>
                      <template v-slot:error="{ row: auditRow }">
                        <span class="text-error">{{ auditRow.error }}</span>
                      </template>
                    </TsTable>
                  </div>
                  <div>
                    <div class="text-title mb-xs">{{ $t('term.alert.actionrecord') }}</div>
                    <TsTable
                      v-bind="row.actionAuditData || {}"
                      :theadList="actionAuditTheadList"
                      height="auto"
                      @changeCurrent="currentPage => searchStateActionAudit(row, currentPage)"
                      @changePageSize="pageSize => changeStateActionAuditPageSize(row, pageSize)"
                    >
                      <template v-slot:trigger="{ row: actionRow }">
                        <span>{{ getTriggerText(actionRow.trigger) }}</span>
                      </template>
                      <template v-slot:status="{ row: actionRow }">
                        <span :class="actionRow.status === 'succeed' ? 'text-success' : 'text-error'">{{ actionRow.statusText || actionRow.status || '-' }}</span>
                      </template>
                      <template v-slot:startTime="{ row: actionRow }">
                        <span>{{ actionRow.startTime | formatDate }}</span>
                      </template>
                      <template v-slot:timeCost="{ row: actionRow }">
                        <span>{{ actionRow.timeCost || 0 }}ms</span>
                      </template>
                      <template v-slot:error="{ row: actionRow }">
                        <span class="text-error">{{ actionRow.error }}</span>
                      </template>
                    </TsTable>
                  </div>
                </div>
              </template>
            </TsTable>
          </TabPane>
          <TabPane :label="$t('term.alert.executionrecord')" name="audit">
            <TsTable
              v-bind="auditData"
              :theadList="auditTheadList"
              @changeCurrent="searchAudit"
              @changePageSize="changeAuditPageSize"
            >
              <template v-slot:status="{ row }">
                <span :class="getAuditStatusClass(row.status)">{{ row.statusText || row.status || '-' }}</span>
              </template>
              <template v-slot:alertTitle="{ row }">
                <span v-if="row.alertId" class="text-href" @click="toAlertDetail(row)">{{ row.alertTitle || ('#' + row.alertId) }}</span>
                <span v-else>-</span>
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
        title: this.$t('term.alert.breakerpolicystatus'),
        type: 'modal',
        width: 'large',
        maskClose: false,
        isShow: true
      },
      stateTheadList: [
        { key: 'expander', width: 40 },
        { key: 'uniqueKey', title: this.$t('term.alert.breakerobject') },
        { key: 'state', title: this.$t('page.status') },
        { key: 'triggerCount', title: this.$t('term.alert.triggercount') },
        { key: 'skipCount', title: this.$t('term.alert.skipcount') },
        { key: 'windowTime', title: this.$t('term.alert.statisticswindow') },
        { key: 'openTime', title: this.$t('term.alert.circuitbreakingtime') },
        { key: 'lastTriggerTime', title: this.$t('term.alert.lasttriggertime') }
      ],
      auditTheadList: [
        { key: 'alertId', title: this.$t('term.alert.alertid') },
        { key: 'alertTitle', title: this.$t('term.alert.alerttitle') },
        { key: 'status', title: this.$t('page.result') },
        { key: 'startTime', title: this.$t('term.alert.executiontime') },
        { key: 'timeCost', title: this.$t('term.alert.timecost') },
        { key: 'error', title: this.$t('page.exception') }
      ],
      hitAuditTheadList: [
        { key: 'alertId', title: this.$t('term.alert.alertid') },
        { key: 'alertTitle', title: this.$t('term.alert.alerttitle') },
        { key: 'status', title: this.$t('page.result') },
        { key: 'startTime', title: this.$t('term.alert.executiontime') },
        { key: 'timeCost', title: this.$t('term.alert.timecost') },
        { key: 'error', title: this.$t('page.exception') }
      ],
      actionAuditTheadList: [
        { key: 'trigger', title: this.$t('term.alert.triggerpoint') },
        { key: 'actionName', title: this.$t('page.actionname') },
        { key: 'actionHandler', title: this.$t('term.alert.actionplugin') },
        { key: 'status', title: this.$t('page.result') },
        { key: 'startTime', title: this.$t('term.alert.executiontime') },
        { key: 'timeCost', title: this.$t('term.alert.timecost') },
        { key: 'error', title: this.$t('page.exception') }
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
    toggleStateExpand(row, isExpand) {
      const nextExpand = typeof isExpand === 'boolean' ? isExpand : !row._expand;
      this.$set(row, '_expand', nextExpand);
      if (nextExpand) {
        if (!row.hitAuditSearchParam) {
          this.$set(row, 'hitAuditSearchParam', { currentPage: 1, pageSize: 10 });
        }
        if (!row.actionAuditSearchParam) {
          this.$set(row, 'actionAuditSearchParam', { currentPage: 1, pageSize: 10 });
        }
        this.searchStateHitAudit(row, row.hitAuditSearchParam.currentPage);
        this.searchStateActionAudit(row, row.actionAuditSearchParam.currentPage);
      }
    },
    searchStateHitAudit(row, currentPage) {
      if (!row || !row.id) {
        return;
      }
      if (currentPage) {
        row.hitAuditSearchParam.currentPage = currentPage;
      }
      this.$api.alert.breaker.searchAudit({ ...row.hitAuditSearchParam, policyId: this.policy.id, stateId: row.id }).then(res => {
        this.$set(row, 'hitAuditData', res.Return || {});
      });
    },
    changeStateHitAuditPageSize(row, pageSize) {
      row.hitAuditSearchParam.pageSize = pageSize;
      this.searchStateHitAudit(row, 1);
    },
    searchStateActionAudit(row, currentPage) {
      if (!row || !row.id) {
        return;
      }
      if (currentPage) {
        row.actionAuditSearchParam.currentPage = currentPage;
      }
      this.$api.alert.breaker.searchActionAudit({ ...row.actionAuditSearchParam, policyId: this.policy.id, stateId: row.id }).then(res => {
        this.$set(row, 'actionAuditData', res.Return || {});
      });
    },
    changeStateActionAuditPageSize(row, pageSize) {
      row.actionAuditSearchParam.pageSize = pageSize;
      this.searchStateActionAudit(row, 1);
    },
    toAlertDetail(row) {
      if (row && row.alertId) {
        window.open(HOME + '/alert.html#/alert-detail/' + row.alertId, '_blank');
      }
    },
    getStateText(state) {
      if (state === 'OPEN') {
        return this.$t('term.alert.breakeropen');
      } else if (state === 'COLLECTING') {
        return this.$t('term.alert.breakercollecting');
      } else if (state === 'FLUSHING') {
        return this.$t('term.alert.breakerflushing');
      } else if (state === 'CLOSED') {
        return this.$t('page.close');
      }
      return state || '-';
    },
    getStateClass(state) {
      if (state === 'OPEN') {
        return 'text-warning';
      } else if (state === 'COLLECTING') {
        return 'text-warning';
      } else if (state === 'FLUSHING') {
        return 'text-info';
      } else if (state === 'CLOSED') {
        return 'text-success';
      }
      return 'text-grey';
    },
    getAuditStatusClass(status) {
      if (status === 'open') {
        return 'text-warning';
      } else if (status === 'pass') {
        return 'text-success';
      } else if (status === 'failed') {
        return 'text-error';
      }
      return 'text-grey';
    },
    getTriggerText(trigger) {
      if (trigger === 'OPEN') {
        return this.$t('term.alert.breakeropenwhen');
      } else if (trigger === 'AGGREGATE') {
        return this.$t('term.alert.breakeraggregatewhen');
      } else if (trigger === 'RECOVER') {
        return this.$t('term.alert.breakerrecoverwhen');
      }
      return trigger || '-';
    }
  }
};
</script>
