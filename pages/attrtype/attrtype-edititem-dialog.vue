<template>
  <div>
    <TsDialog v-bind="dialogConfig" @on-close="close()" @on-ok="save()">
      <template v-slot>
        <div class="mb-sm">
          <InputSearcher
            v-model="searchParam.keyword"
            :width="400"
            @change="searchAttrTypeEnum(1)"
          ></InputSearcher>
        </div>
        <TsTable
          :theadList="theadList"
          v-bind="enumData"
          @changeCurrent="changeCurrent"
          @changePageSize="changePageSize"
        >
          <template v-slot:action="{ row }">
            <div class="tstable-action">
              <ul class="tstable-action-ul">
                <li class="tsfont-trash-o" @click="editRow(row)">{{ $t('page.edit') }}</li>
                <li class="tsfont-trash-o" @click="delRow(row)">{{ $t('page.delete') }}</li>
              </ul>
            </div>
          </template>
        </TsTable>
      </template>
      <template v-slot:footer>
        <Button @click="close()">{{ $t('page.cancel') }}</Button>
        <Button type="success" @click="add()">{{ $t('page.add') }}</Button>
      </template>
    </TsDialog>
    <TsDialog
      v-if="isEdit"
      width="small"
      v-bind="dialogConfig"
      @on-ok="saveEnum()"
      @on-close="closeEdit()"
    >
      <template v-slot>
        <div>
          <TsForm ref="form" v-model="currentEnumData" :item-list="formConfig"></TsForm>
        </div>
      </template>
    </TsDialog>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    InputSearcher: () => import('@/resources/components/InputSearcher/InputSearcher.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      currentEnumData: null,
      isEdit: false,
      dialogConfig: {
        title: this.$t('dialog.title.edittarget', { target: this.$t('page.member') }),
        width: 'medium',
        isShow: true
      },
      theadList: [
        {
          key: 'value',
          title: this.$t('page.value')
        },
        { key: 'text', title: this.$t('page.text') },
        { key: 'action' }
      ],
      enumData: {},
      formConfig: {
        value: {
          type: 'text',
          maxlength: 50,
          validateList: ['required'],
          label: this.$t('page.value')
        },
        text: {
          type: 'text',
          maxlength: 100,
          validateList: ['required'],
          label: this.$t('page.text')
        }
      },
      searchParam: { attrType: this.id, pageSize: 10 }
    };
  },
  beforeCreate() {},
  created() {
    this.searchAttrTypeEnum();
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
    add() {
      this.isEdit = true;
      this.currentEnumData = { attrType: this.id };
    },
    saveEnum() {
      if (this.$refs.form && this.$refs.form.valid()) {
        this.$api.alert.attrtype.saveAlertAttrEnum(this.currentEnumData).then(res => {
          if (res.Status === 'OK') {
            this.$Message.success(this.$t('message.savesuccess'));
            this.closeEdit(true);
          }
        });
      }
    },
    closeEdit(needRefresh) {
      this.isEdit = false;
      this.currentEnumData = null;
      if (needRefresh) {
        this.searchAttrTypeEnum();
      }
    },
    editRow(row) {
      this.currentEnumData = this.$utils.deepClone(row);
      //修正attrtype
      this.currentEnumData.attrType = this.id;
      this.isEdit = true;
    },
    changeCurrent(currentPage) {
      this.searchParam.currentPage = currentPage;
      this.searchAttrTypeEnum();
    },
    changePageSize(pageSize) {
      this.searchParam.pageSize = pageSize;
      this.searchParam.currentPage = 1;
      this.searchAttrTypeEnum();
    },
    searchAttrTypeEnum(currentPage) {
      if (currentPage) {
        this.searchParam.currentPage = currentPage;
      }
      this.$api.alert.attrtype.searchAttrTypeEnum(this.searchParam).then(res => {
        this.enumData = res.Return;
      });
    },
    delRow(row) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', {'target': this.$t('page.member')}),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.attrtype.deleteAttrTypeEnum(row.id).then(res => {
            this.$Message.success(this.$t('message.deletesuccess'));
            vnode.isShow = false;
            this.closeEdit(true);
          });
        }
      });
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    save() {}
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
