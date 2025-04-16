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
      attrTypeData: { isActive: 1, isNormal: 0, isTop: 0 },
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('page.attribute') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.attribute') }),
        width: 'small',
        isShow: true
      },
      formConfig: {
        name: {
          type: 'text',
          readonly: !!this.id,
          label: this.$t('page.uniquekey'),
          maxlength: 50,
          validateList: ['required', 'unique_ident'],
          desc: '保存后不能修改'
        },
        label: {
          type: 'text',
          label: this.$t('page.name'),
          maxlength: 50,
          validateList: ['required']
        },
        isActive: {
          type: 'switch',
          label: this.$t('term.report.isactive'),
          trueValue: 1,
          falseValue: 0
        },
        isTop: {
          type: 'switch',
          label: this.$t('term.alert.istop'),
          trueValue: 1,
          falseValue: 0,
          desc: '置顶属性可以作为顶层搜索条件出现在告警列表页面里'
        },
        isNormal: {
          label: this.$t('term.alert.isnormalattr'),
          type: 'switch',
          trueValue: 1,
          falseValue: 0
        },
        type: {
          type: 'select',
          label: this.$t('page.type'),
          validateList: ['required'],
          url: '/api/rest/universal/enum/get',
          transfer: true,
          desc: '枚举类型会自动保存枚举值',
          params: {
            enumClass: 'neatlogic.framework.alert.enums.AlertAttrType'
          }
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
          if (!this.attrTypeData.isTop) {
            this.attrTypeData.isTop = 0;
          }
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
          this.$Message.success(this.$t('message.savesuccess'));
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
