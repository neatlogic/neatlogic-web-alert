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
    id: { type: Number },
    parentId: { type: Number, default: null }
  },
  data() {
    return {
      isReady: false,
      alertCatalogData: { isActive: 1 }, //默认必须选择标题，而且不能调整位置
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
          label: this.$t('page.name'),
          maxlength: 50,
          validateList: ['required']
        },
        parentId: {
          type: 'tree',
          name: 'parentId',
          label: this.$t('term.alert.parentcatalog'),
          value: null,
          url: 'api/rest/alert/catalog/listtree',
          valueName: 'id',
          textName: 'name',
          transfer: true,
          clearable: true,
          showPath: true
        },
        isActive: {
          type: 'switch',
          label: this.$t('page.isactive'),
          trueValue: 1,
          falseValue: 0
        },
        authList: {
          type: 'userselect',
          label: this.$t('page.auth'),
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
        return this.$api.alert.catalog.getAlertCatalogById(this.id).then(res => {
          this.alertCatalogData = res.Return;
          this.$set(this.alertCatalogData, 'parentId', res.Return.parentId || null);
          this.isReady = true;
        });
      } else {
        this.$set(this.alertCatalogData, 'parentId', this.parentId || null);
        this.isReady = true;
        return Promise.resolve();
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    saveCatalog() {
      const form = this.$refs.form;
      if (form && form.valid()) {
        this.$api.alert.catalog.saveAlertCatalog(this.alertCatalogData).then(res => {
          if (res.Status === 'OK') {
            this.$store.commit('leftMenu/setAlertViewCount', 'add');
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
