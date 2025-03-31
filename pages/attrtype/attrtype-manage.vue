<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editAttrType()">{{ $t('page.attribute') }}</div>
        </div>
      </template>
      <template v-slot:topRight>
        <div><CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="searchAlertAttrType(1)"></CombineSearcher></div>
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
          <template v-slot:isNormal="{ row }">
            <span v-if="row.isNormal" class="text-success">{{ $t('page.yes') }}</span>
            <span v-else class="text-grey">{{ $t('page.no') }}</span>
          </template>
          <template v-slot:enumCount="{ row }">
            <Badge v-if="row.type === 'enum'" :count="row.enumCount" type="primary"></Badge>
            <div v-else></div>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li v-if="row.type === 'enum'" class="tsfont-formdynamiclist" @click="editItem(row)">{{ $t('dialog.title.edittarget', { target: $t('page.member') }) }}</li>
                <li class="tsfont-edit" @click="editAttrType(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="delAttrType(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
    </TsContain>
    <AttrTypeEdit v-if="isEditAttrType" :id="currentAttrTypeId" @close="closeAttrType"></AttrTypeEdit>
    <AttrTypeItemEdit v-if="isEditAttrTypeItem" :id="currentAttrTypeId" @close="closeAttrTypeItem"></AttrTypeItemEdit>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    AttrTypeEdit: () => import('@/commercial-module/alert/pages/attrtype/attrtype-edit-dialog.vue'),
    AttrTypeItemEdit: () => import('@/commercial-module/alert/pages/attrtype/attrtype-edititem-dialog.vue'),
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue')
  },
  props: {},
  data() {
    return {
      isEditAttrType: false,
      isEditAttrTypeItem: false,
      searchParam: {},
      attrTypeData: {},
      currentAttrTypeId: null,
      theadList: [
        { key: 'name', title: this.$t('page.uniquekey') },
        { key: 'label', title: this.$t('page.name') },
        { key: 'typeName', title: this.$t('page.type') },
        { key: 'enumCount', title: this.$t('term.knowledge.member') },
        { key: 'isActive', title: this.$t('term.report.isactive') },
        { key: 'isNormal', title: this.$t('term.alert.isnormalattr') },
        { key: 'action', title: '' }
      ],
      searchConfig: {
        search: true,
        labelPosition: 'left',
        labelWidth: 70,
        searchList: [
          {
            type: 'select',
            name: 'type',
            label: this.$t('page.type'),
            url: '/api/rest/universal/enum/get',
            transfer: true,
            params: {
              enumClass: 'neatlogic.framework.alert.enums.AlertAttrType'
            }
          },
          {
            type: 'radio',
            dataList: [
              { value: 1, text: this.$t('page.yes') },
              { value: 0, text: this.$t('page.no') }
            ],
            name: 'isActive',
            label: '是否激活'
          },
          {
            type: 'radio',
            dataList: [
              { value: 1, text: this.$t('page.yes') },
              { value: 0, text: this.$t('page.no') }
            ],
            name: 'isNormal',
            label: '作为普通属性展示'
          }
        ]
      },
      searchVal: {}
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
    closeAttrTypeItem() {
      this.isEditAttrTypeItem = false;
      this.currentAttrTypeId = null;
    },
    editItem(row) {
      this.isEditAttrTypeItem = true;
      this.currentAttrTypeId = row.id;
    },
    delAttrType(type) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('page.attrtype') }),
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
        this.searchParam.currentPage = currentPage;
      }

      this.$api.alert.attrtype.searchAttrType({ ...this.searchVal, ...this.searchParam }).then(res => {
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
