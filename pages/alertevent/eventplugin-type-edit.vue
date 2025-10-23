<template>
  <div>
    <TsDialog v-bind="dialogConfig">
      <template v-slot>
        <div>
          <TsTable
            v-if="typeList && typeList.length > 0"
            keyName="uuid"
            class="mb-md"
            :theadList="theadList"
            :tbodyList="typeList"
          >
            <template v-slot:name="{ row, index }">
              <span v-if="!row._editing">{{ row.name }}</span>
              <TsFormInput
                v-else
                :ref="'txtName' + index"
                v-model="row.name"
                border="border"
                :maxlength="50"
                :validateList="['required', 'enchar']"
              ></TsFormInput>
            </template>
            <template v-slot:label="{ row, index }">
              <span v-if="!row._editing">{{ row.label }}</span>
              <TsFormInput
                v-else
                :ref="'txtLabel' + index"
                v-model="row.label"
                border="border"
                :maxlength="50"
                :validateList="['required']"
              ></TsFormInput>
            </template>
            <template v-slot:action="{ row, index }">
              <div class="tstable-action">
                <ul class="tstable-action-ul">
                  <li v-if="row._editing" class="tsfont-check-o" @click="saveType(row, index)">{{ $t('page.confirm') }}</li>
                  <li v-if="row._editing" class="tsfont-close-o" @click="cancelEdit(row, index)">{{ $t('page.cancel') }}</li>
                  <li v-if="!row._editing" class="tsfont-edit" @click="editType(row, index)">{{ $t('page.edit') }}</li>
                  <li v-if="!row._editing" class="tsfont-trash-o" @click="deleteType(row)">{{ $t('page.delete') }}</li>
                </ul>
              </div>
            </template>
          </TsTable>
          <div v-else style="text-align: center">
            <a class="tsfont-plus" @click="addType()">{{ $t('dialog.title.addtarget', { target: $t('page.type') }) }}</a>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <Button @click="close()">{{ $t('page.cancel') }}</Button>
        <Button
          v-if="typeList && typeList.length > 0"
          ghost
          type="primary"
          @click="addType()"
        >{{ $t('dialog.title.addtarget', { target: $t('page.type') }) }}</Button>
      </template>
    </TsDialog>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput')
  },
  props: {},
  data() {
    return {
      dialogConfig: {
        title: this.$t('dialog.title.edittarget', { target: this.$t('page.type') }),
        type: 'modal',
        maskClose: false,
        isShow: true,
        width: 'medium'
      },
      theadList: [{ key: 'name', title: this.$t('page.uniquekey') }, { key: 'label', title: this.$t('page.name') }, { key: 'action' }],
      typeList: [],
      oldData: {}
    };
  },
  beforeCreate() {},
  created() {
    this.searchAlertEventHandlerType();
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
    editType(row, index) {
      this.$set(this.oldData, row.id.toString(), this.$utils.deepClone(row));
      this.$set(row, '_editing', true);
    },
    cancelEdit(row, index) {
      if (row.id) {
        this.$set(row, '_editing', false);
        this.$set(this.typeList, index, this.oldData[row.id.toString()]);
        this.$delete(this.oldData, row.id.toString());
      } else {
        this.typeList.splice(index, 1);
      }
    },
    addType() {
      this.typeList.push({ uuid: this.$utils.setUuid(), name: '', label: '', _editing: true });
    },
    searchAlertEventHandlerType() {
      this.$api.alert.alerteventhandlertype.searchAlertEventHandlerType().then(res => {
        this.typeList = res.Return;
      });
    },
    saveType(row, index) {
      const name = this.$refs['txtName' + index];
      const label = this.$refs['txtLabel' + index];
      if (name && label && name.valid() && label.valid()) {
        this.$api.alert.alerteventhandlertype.saveAlertEventHandlerType(row).then(res => {
          if (res.Status === 'OK') {
            this.$Message.success(this.$t('message.savesuccess'));
            this.$set(row, '_editing', false);
            this.$set(row, 'id', res.Return);
          }
        });
      }
    },
    deleteType(row) {
      if (row.id) {
        this.$createDialog({
          title: this.$t('dialog.title.deleteconfirm'),
          content: this.$t('dialog.content.deleteconfirm', { target: this.$t('page.type') }),
          btnType: 'error',
          'on-ok': vnode => {
            this.$api.alert.alerteventhandlertype.deleteAlertEventHandlerType(row.id).then(res => {
              if (res.Status === 'OK') {
                this.$Message.success(this.$t('message.deletesuccess'));
                vnode.isShow = false;
                this.typeList.splice(this.typeList.indexOf(row), 1);
              }
            });
          }
        });
      } else {
        this.typeList.splice(this.typeList.indexOf(row), 1);
      }
    },
    close() {
      this.$emit('close');
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
