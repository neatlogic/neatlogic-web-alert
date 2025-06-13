<template>
  <TsDialog v-bind="dialogConfig" @on-close="close">
    <template v-slot>
      <TsForm ref="form" v-model="alertSourceData" :item-list="formConfig"></TsForm>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" @click="save()">{{ $t('page.confirm') }}</Button>
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
    name: { type: String }
  },
  data() {
    return {
      alertSourceData: {},
      dialogConfig: {
        title: this.name ? this.$t('dialog.title.edittarget', { target: this.$t('page.source') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.source') }),
        type: 'modal',
        maskClose: false,
        isShow: true,
        width: 'small'
      },
      formConfig: [
        {
          type: 'text',
          name: 'name',
          maxlength: 50,
          readonly: !!this.name,
          label: this.$t('page.uniquekey'),
          validateList: ['required', 'enchar'],
          desc: this.$t('message.cmdb.noedit')
        },
        {
          type: 'text',
          name: 'label',
          maxlength: 50,
          label: this.$t('page.name'),
          validateList: ['required']
        }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.getAlertSourceById();
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
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    save() {
      if (this.$refs.form && this.$refs.form.valid()) {
        this.$api.alert.source.saveAlertSource(this.alertSourceData).then(res => {
          if (res.Status === 'OK') {
            this.$Message.success(this.$t('message.updatesuccess'));
            this.close(true);
          }
        });
      }
    },
    getAlertSourceById() {
      if (this.name) {
        this.$api.alert.source.getAlertSourceByName(this.name).then(res => {
          this.alertSourceData = res.Return;
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
