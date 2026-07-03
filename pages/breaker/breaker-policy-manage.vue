<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div v-auth="['ALERT_BREAKER_MODIFY']" class="action-item tsfont-plus" @click="editPolicy()">{{ $t('term.alert.breakerpolicy') }}</div>
        </div>
      </template>
      <template v-slot:topRight>
        <CombineSearcher
          v-model="searchVal"
          v-bind="searchConfig"
          @change="searchPolicy(1)"
        ></CombineSearcher>
      </template>
      <template v-slot:content>
        <TsTable
          v-bind="policyData"
          :theadList="theadList"
          @changeCurrent="searchPolicy"
          @changePageSize="changePageSize"
        >
          <template v-slot:handler="{ row }">
            <span>{{ row.handlerLabel || row.handler }}</span>
          </template>
          <template v-slot:isActive="{ row }">
            <span v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-grey">{{ $t('page.no') }}</span>
          </template>
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-eye" @click="viewPolicyStatus(row)">{{ $t('term.alert.executionstatus') }}</li>
                <li v-auth="['ALERT_BREAKER_MODIFY']" class="tsfont-edit" @click="editPolicy(row)">{{ $t('page.edit') }}</li>
                <li v-auth="['ALERT_BREAKER_MODIFY']" class="tsfont-trash-o" @click="deletePolicy(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <BreakerPolicyEdit v-if="isEdit" :id="currentId" @close="closeEdit"></BreakerPolicyEdit>
    <BreakerPolicyStatusDialog v-if="isStatusDialogShow" :policy="currentPolicy" @close="closeStatusDialog"></BreakerPolicyStatusDialog>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    BreakerPolicyEdit: () => import('@/community-module/alert/pages/breaker/breaker-policy-edit.vue'),
    BreakerPolicyStatusDialog: () => import('@/community-module/alert/pages/breaker/breaker-policy-status-dialog.vue')
  },
  data() {
    return {
      isEdit: false,
      isStatusDialogShow: false,
      currentId: null,
      currentPolicy: null,
      searchParam: {
        currentPage: 1,
        pageSize: 20
      },
      searchVal: {},
      handlerList: [],
      policyData: {},
      theadList: [
        { key: 'name', title: this.$t('page.name') },
        { key: 'handler', title: this.$t('term.alert.breakerplugin') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'description', title: this.$t('page.description') },
        { key: 'action' }
      ]
    };
  },
  created() {
    this.listHandler();
    this.searchPolicy();
  },
  methods: {
    listHandler() {
      this.$api.alert.breaker.listHandler().then(res => {
        this.handlerList = res.Return || [];
      });
    },
    searchPolicy(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      this.$api.alert.breaker.searchPolicy({ ...this.searchParam, ...this.searchVal }).then(res => {
        this.policyData = res.Return;
      });
    },
    changePageSize(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchPolicy(1);
    },
    editPolicy(row) {
      this.currentId = row ? row.id : null;
      this.isEdit = true;
    },
    viewPolicyStatus(row) {
      this.currentPolicy = row;
      this.isStatusDialogShow = true;
    },
    closeStatusDialog() {
      this.currentPolicy = null;
      this.isStatusDialogShow = false;
    },
    closeEdit(needRefresh) {
      this.isEdit = false;
      this.currentId = null;
      if (needRefresh) {
        this.searchPolicy(1);
      }
    },
    deletePolicy(row) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('term.alert.breakerpolicy') }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.breaker.deletePolicy(row.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.searchPolicy(1);
            }
          });
        }
      });
    }
  },
  computed: {
    searchConfig() {
      return {
        labelPosition: 'left',
        searchMode: 'click',
        searchList: [
          {
            type: 'select',
            name: 'handler',
            label: this.$t('term.alert.breakerplugin'),
            valueName: 'name',
            textName: 'label',
            dataList: this.handlerList,
            transfer: true
          },
          {
            type: 'radio',
            name: 'isActive',
            label: this.$t('term.report.isactive'),
            dataList: [
              { value: 1, text: this.$t('page.yes') },
              { value: 0, text: this.$t('page.no') }
            ]
          }
        ]
      };
    }
  }
};
</script>
<style lang="less"></style>
