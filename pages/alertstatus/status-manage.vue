<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editStatus()">{{ $t('page.status') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable :tbodyList="statusList" :theadList="theadList">
          <template v-slot:color="{ row }">
            <div class="color-item radius-sm" :style="{ background: row.color }"></div>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editStatus(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="deleteStatus(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <StatusEdit v-if="isEditShow" :status="currentStatus" @close="closeEdit"></StatusEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    StatusEdit: () => import('@/commercial-module/alert/pages/alertstatus/status-edit.vue')
  },
  props: {},
  data() {
    return {
      theadList: [
        {
          key: 'name',
          title: '唯一标识'
        },
        { key: 'label', title: '名称' },
        { key: 'color', title: '颜色' },
        { key: 'action' }
      ],
      statusList: [],
      isEditShow: false,
      currentStatus: null
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertStatus();
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
    editStatus(status) {
      this.currentStatus = status;
      this.isEditShow = true;
    },
    closeEdit(needRefresh) {
      if (needRefresh) {
        this.listAlertStatus();
      }
      this.isEditShow = false;
    },
    deleteStatus(status) {
      if (status) {
        this.$createDialog({
          title: this.$t('dialog.title.deleteconfirm'),
          content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.status')}),
          btnType: 'error',
          'on-ok': vnode => {
            this.$api.alert.status.deleteAlertStatus(status.name).then(res => {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.listAlertStatus();
            });
          }
        });
      }
    },
    listAlertStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.color-item {
  display: inline-block;
  width: 20px;
  height: 20px;
}
</style>
