<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()" @on-ok="save()">
    <template v-slot>
      <TsForm ref="form" v-model="alertLevelData" :item-list="formConfig">
        <template v-slot:color>
          <ColorPicker
            :value="alertLevelData.color"
            :transfer="true"
            alpha
            recommend
            class="colorPicker"
            transfer-class-name="color-picker-transfer-class"
            @on-change="
              val => {
                $set(alertLevelData,'color', val);
              }
            "
          />
        </template>
      </TsForm>
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
      alertLevelData: {},
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('page.level') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.level') }),
        width: 'small',
        isShow: true
      },
      formConfig: {
        level: {
          type: 'number',
          readonly: !!this.id,
          label: this.$t('page.level'),
          min: 1,
          validateList: ['required'],
          desc: this.$t('message.cmdb.noedit')
        },
        name: {
          type: 'text',
          readonly: !!this.id,
          label: this.$t('page.uniquekey'),
          maxlength: 50,
          validateList: ['required', 'unique_ident'],
          desc: this.$t('message.cmdb.noedit')
        },
        label: {
          type: 'text',
          label: this.$t('page.name'),
          maxlength: 50,
          validateList: ['required']
        },
        color: {
          type: 'slot',
          label: this.$t('page.color')
        }
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getAlertLevelById();
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
    getAlertLevelById() {
      if (this.id) {
        this.$api.alert.alertlevel.getAlertLevelById(this.id).then(res => {
          this.alertLevelData = res.Return;
        });
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    save() {
      const form = this.$refs['form'];
      if (form && form.valid()) {
        this.$api.alert.alertlevel.saveAlertLevel(this.alertLevelData).then(res => {
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
