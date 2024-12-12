<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editAttrType()">{{ $t('page.attribute') }}</div>
        </div>
      </template>
      <template v-slot:content>
        <TsTable
          v-bind="attrTypeData"
          :theadList="theadList"
          @changeCurrent="searchAlertAttrType"
          @changePageSize="changePageSize"
        >
          <template v-slot:isActive="{ row }">
            <span v-if="row.isActive" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-grey">{{ $t('page.no') }}</span>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-edit" @click="editAttrType(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="delAttrType(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AttrTypeEdit v-if="isEditAttrType" :id="currentAttrTypeId" @close="closeAttrType"></AttrTypeEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AttrTypeEdit: () => import('@/commercial-module/alert/pages/attrtype/attrtype-edit-dialog.vue')
  },
  props: {},
  data() {
    return {
      isEditAttrType: false,
      searchParam: {},
      attrTypeData: {},
      currentAttrTypeId: null,
      theadList: [
        { key: 'name', title: this.$t('page.uniquekey') },
        { key: 'label', title: this.$t('page.name') },
        { key: 'typeName', title: this.$t('page.type') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'action', title: '' }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertAttrType();
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
    delAttrType(type) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.attrtype')}),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.attrtype.deleteAttrType(type.id).then(res => {
            if (res.Status === 'OK') {
              this.$Message.success(this.$t('message.deletesuccess'));
              vnode.isShow = false;
              this.searchAlertAttrType();
            }
          });
        }
      });
    },
    closeAttrType(needRefresh) {
      this.isEditAttrType = false;
      this.currentAttrTypeId = null;
      if (needRefresh) {
        this.searchAlertAttrType();
      }
    },
    editAttrType(type) {
      if (type) {
        this.currentAttrTypeId = type.id;
      }
      this.isEditAttrType = true;
    },
    changePageSize(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchAlertAttrType(1);
    },
    searchAlertAttrType(currentPage) {
      if (currentPage) {
        this.searchParam = currentPage;
      }
      this.$api.alert.attrtype.searchAttrType(this.searchParam).then(res => {
        this.attrTypeData = res.Return;
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
