<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <TsForm ref="form" v-model="alertCatalogData" :item-list="formConfig">
      </TsForm>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" @click="saveCatalog()">{{ $t('page.confirm') }}</Button>
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
      isReady: false,
      alertCatalogData: { isActive: 1 }, //默认必须选择标题，而且不能调整位置
      attrList: [],
      dialogConfig: {
        title: this.id
          ? this.$t('dialog.title.edittarget', {
            target: this.$t('page.catalogue')
          })
          : this.$t('dialog.title.addtarget', { target: this.$t('page.catalogue') }),
        type: 'modal',
        isShow: true,
        width: 'medium'
      },
      formConfig: {
        name: {
          type: 'text',
          label: '名称',
          maxlength: 50,
          validateList: ['required']
        },
        isActive: {
          type: 'switch',
          label: '是否激活',
          trueValue: 1,
          falseValue: 0
        },
        authList: {
          type: 'userselect',
          label: '授权',
          groupList: ['common', 'user', 'role', 'team'],
          transfer: true
        }
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getCatalogById();
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
    getCatalogById() {
      if (this.id) {
        this.$api.alert.catalog.getAlertCatalogById(this.id).then(res => {
          this.alertCatalogData = res.Return;
          this.isReady = true;
        });
      } else {
        this.isReady = true;
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    saveCatalog() {
      const form = this.$refs.form;
      if (form && form.valid()) {
        console.log(JSON.stringify(this.alertCatalogData, null, 2));
        this.$api.alert.catalog.saveAlertCatalog(this.alertCatalogData).then(res => {
          if (res.Status === 'OK') {
            this.close(true);
          }
        });
      }
    }
  },
  filter: {},
  computed: {
  },
  watch: {}
};
</script>
<style lang="less"></style>
