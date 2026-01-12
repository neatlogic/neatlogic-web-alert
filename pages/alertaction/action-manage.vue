<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editAction()">{{ $t('page.action') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable :tbodyList="actionList" :theadList="theadList">
          <template v-slot:isActive="{ row }">
            <span v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-grey">{{ $t('page.no') }}</span>
          </template>
          <template v-slot:icon="{ row }">
            <span :class="row.icon"></span>
          </template>
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editAction(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="deleteAction(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <ActionEdit v-if="isShow" :id="currentId" @close="closeEdit"></ActionEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    ActionEdit: () => import('@/community-module/alert/pages/alertaction/action-edit-dialog.vue')
  },
  props: {},
  data() {
    return {
      actionList: [],
      isShow: false,
      currentId: null,
      theadList: [
        {
          key: 'name',
          title: this.$t('page.uniquekey')
        },
        { key: 'label', title: this.$t('page.name') },
        { key: 'icon', title: this.$t('page.icon') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'description', title: this.$t('page.explain') },
        { key: 'action' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertAction();
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
    closeEdit(needRefresh) {
      this.isShow = false;
      this.currentId = null;
      if (needRefresh) {
        this.searchAlertAction();
      }
    },
    searchAlertAction() {
      this.$api.alert.action.searchAction(this.searchParam).then(res => {
        this.actionList = res.Return;
      });
    },
    editAction(row) {
      if (row) {
        this.currentId = row.id;
      } else {
        this.currentId = null;
      }
      this.isShow = true;
    },
    deleteAction(row) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.actions')}),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.action.deleteActionById(row.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              this.searchAlertAction();
            }
          });
        }
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>
