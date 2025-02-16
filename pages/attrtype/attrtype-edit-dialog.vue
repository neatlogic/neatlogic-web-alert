<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()" @on-ok="save()">
    <template v-slot>
      <TsForm ref="form" v-model="attrTypeData" :item-list="formConfig"></TsForm>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    TsForm: () => import('@/resources/plugins/TsForm/TsForm')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      attrTypeData: { isActive: 1 },
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('page.attribute') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.attribute') }),
        width: 'small',
        isShow: true
      },
      formConfig: {
        name: {
          type: 'text',
          readonly: !!this.id,
          label: '唯一标识',
          maxlength: 50,
          validateList: ['required', 'unique_ident'],
          desc: '保存后不能修改'
        },
        label: {
          type: 'text',
          label: '名称',
          maxlength: 50,
          validateList: ['required']
        },
        isActive: {
          type: 'switch',
          label: '是否激活'
        },
        type: {
          type: 'radio',
          label: '类型',
          validateList: ['required'],
          dataList: [
            { value: 'number', text: '数字' },
            { value: 'text', text: '字符串' },
            { value: 'datetime', text: '日期时间' }
            /*{ value: 'jsonobj', text: 'json对象' },
            { value: 'jsonlist', text: 'json数组' }*/
          ]
        }
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getAttrTypeById();
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
    getAttrTypeById() {
      if (this.id) {
        this.$api.alert.attrtype.getAttrTypeById(this.id).then(res => {
          this.attrTypeData = res.Return;
        });
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    save() {
      const form = this.$refs['form'];
      if (form && form.valid()) {
        this.$api.alert.attrtype.saveAttrType(this.attrTypeData).then(res => {
          this.$Message.success('保存成功');
          this.close(true);
        });
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
