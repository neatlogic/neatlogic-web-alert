<template>
  <TsDialog v-bind="dialogConfig" @on-ok="save()" @on-close="close()">
    <template v-slot>
      <TsForm ref="form" v-model="alertTypeData" :item-list="formConfig">
        <!--<template v-slot:attrTypeList>
          <div>
            <TsFormSelect
              v-model="alertTypeData.attrTypeIdList"
              dynamicUrl="/api/rest/alert/attrtype/search"
              :params="{ isActive: 1 }"
              rootName="tbodyList"
              valueName="id"
              textName="label"
              :multiple="true"
              transfer
              border="border"
            ></TsFormSelect>
          </div>
        </template>-->
        <template v-slot:fileId>
          <div>
            <div class="text-grey">
              <div>帮助：不提供插件代表不转换告警内容，如果告警内容不符合标准规范，会被直接抛弃。每个告警类型都可以使用多个转换插件来满足不同的接入来源，每个接入来源都需要上传对应的转换插件。</div>
              <div>
                转换插件的接口定义请到
                <a href="https://gitee.com/neat-logic/neatlogic-alert-plugin-base" target="_blank">这里</a>
                下载
              </div>
            </div>
            <div v-if="fileError" class="text-error">{{ fileError }}</div>
            <div>
              <a class="tsfont-plus" @click="addAdaptor()">{{ $t('dialog.title.addtarget', { target: $t('page.plugins') }) }}</a>
            </div>
            <div>
              <TsTable :theadList="theadList" :tbodyList="alertTypeData.adaptorList">
                <template v-slot:name="{ row, index }">
                  <TsFormInput
                    :ref="'txtName' + index"
                    v-model="row.name"
                    :maxlength="50"
                    :validateList="[{ name: 'required', message: ' ' }, { name: 'key-special' }]"
                    border="border"
                  ></TsFormInput>
                </template>
                <template v-slot:label="{ row, index }">
                  <TsFormInput
                    :ref="'txtLabel' + index"
                    v-model="row.label"
                    :maxlength="50"
                    :validateList="[{ name: 'required', message: ' ' }]"
                    border="border"
                  ></TsFormInput>
                </template>
                <template v-slot:fileId="{ row }">
                  <TsUpLoad
                    dataType="alerttype"
                    type="drag"
                    :uploadCount="1"
                    :multiple="false"
                    :defaultList="row.fileId && [row.fileId]"
                    @remove="
                      fileList => {
                        setFile(row, fileList);
                      }
                    "
                    @getFileList="
                      fileList => {
                        setFile(row, fileList);
                      }
                    "
                  ></TsUpLoad>
                  <div v-if="row._error" class="text-error">{{ row._error }}</div>
                </template>
                <template v-slot:delete="{ row }">
                  <span class="tsfont-trash-o cursor" @click="deleteAdaptor(row)"></span>
                </template>
              </TsTable>
            </div>
          </div>
        </template>
      </TsForm>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    //TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    TsUpLoad: () => import('@/resources/components/UpLoad/UpLoad.vue'),
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('term.alert.alerttype') }) : this.$t('dialog.title.addtarget', { target: this.$t('term.alert.alerttype') }),
        type: 'modal',
        maskClose: false,
        isShow: true,
        width: 'medium'
      },
      fileList: [],
      fileError: null,
      alertTypeData: { isActive: 1 },
      theadList: [
        {
          key: 'name',
          title: '唯一标识'
        },
        { key: 'label', title: '名称' },
        { key: 'fileId', title: '附件', width: 300 },
        { key: 'delete' }
      ],
      formConfig: {
        name: {
          label: this.$t('page.uniquekey'),
          type: 'text',
          maxlength: 50,
          validateList: ['required', 'enchar']
        },
        label: {
          label: this.$t('page.name'),
          type: 'text',
          maxlength: 50,
          validateList: ['required']
        },
        isActive: {
          label: this.$t('term.report.isactive'),
          type: 'switch',
          trueValue: 1,
          falseValue: 0
        },
        // attrTypeList: {
        //   label: '扩展属性',
        //   type: 'slot'
        // },
        fileId: {
          label: '接入转换插件',
          type: 'slot'
        }
      }
    };
  },
  beforeCreate() {},
  async created() {
    await this.getAlertTypeById();
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
    deleteAdaptor(row) {
      const index = this.alertTypeData.adaptorList.findIndex(d => d === row);
      if (index > -1) {
        this.alertTypeData.adaptorList.splice(index, 1);
      }
    },
    addAdaptor() {
      if (!this.alertTypeData.adaptorList) {
        this.$set(this.alertTypeData, 'adaptorList', []);
      }
      this.alertTypeData.adaptorList.push({ name: '', label: '', fileId: null });
    },
    save() {
      if (this.$refs.form && this.$refs.form.valid()) {
        let isValid = true;
        if (this.alertTypeData.adaptorList && this.alertTypeData.adaptorList.length > 0) {
          this.alertTypeData.adaptorList.forEach((d, index) => {
            if (this.$refs['txtName' + index] && !this.$refs['txtName' + index].valid()) {
              isValid = false;
            }
            if (this.$refs['txtLabel' + index] && !this.$refs['txtLabel' + index].valid()) {
              isValid = false;
            }
            if (!d.fileId) {
              isValid = false;
              this.$set(d, '_error', '请上传插件');
            }
          });
        }
        if (isValid) {
          this.$api.alert.alerttype.saveAlertType(this.alertTypeData).then(() => {
            this.$Message.success(this.$t('message.savesuccess'));
            this.close(true);
          });
        }
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    setFile(row, fileList) {
      if (fileList && fileList.length > 0) {
        this.fileList = fileList;
        this.$set(row, 'fileId', fileList[0].id);
      } else {
        this.$delete(row, 'fileId');
      }
    },
    async getAlertTypeById() {
      if (this.id) {
        await this.$api.alert.alerttype.getAlertTypeById(this.id).then(res => {
          this.alertTypeData = res.Return;
        });
      }
    },
    isAttrSelected(attr) {
      return this.alertTypeData.attrTypeList.some(item => item.id === attr.id);
    },
    toggleAttr(attr) {
      if (this.isAttrSelected(attr)) {
        this.alertTypeData.attrTypeList = this.alertTypeData.attrTypeList.filter(item => item.id !== attr.id);
      } else {
        this.alertTypeData.attrTypeList = [...this.alertTypeData.attrTypeList, attr];
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
