<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <TsForm ref="form" v-model="statusData" :item-list="formConfig">
        <template v-slot:color>
          <ColorPicker
            :value="statusData.color"
            :transfer="true"
            alpha
            recommend
            class="colorPicker"
            transfer-class-name="color-picker-transfer-class"
            @on-change="
              val => {
                $set(statusData, 'color', val);
              }
            "
          />
        </template>
      </TsForm>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.close') }}</Button>
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
    status: { type: Object }
  },
  data() {
    return {
      statusData: {},
      dialogConfig: {
        title: this.status ? this.$t('dialog.title.edittarget', { target: this.$t('page.status') }) : this.$t('page.newtarget', { target: this.$t('page.status') }),
        isShow: true,
        width: 'small'
      },
      formConfig: {
        name: {
          type: 'text',
          maxlength: 50,
          label: this.$t('page.uniquekey'),
          validateList: ['required'],
          readonly: !!this.status
        },
        label: {
          type: 'text',
          maxlength: 50,
          label: this.$t('page.name'),
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
    if (this.status) {
      this.statusData = this.$utils.deepClone(this.status);
    }
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
        this.$api.alert.status.saveAlertStatus(this.statusData).then(res => {
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
