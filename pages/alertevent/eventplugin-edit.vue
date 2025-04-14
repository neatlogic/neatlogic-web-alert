<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <TsForm v-model="pluginData" :item-list="formConfig">
          <template v-slot:config>
            <PluginConfig v-if="pluginData" ref="pluginConfig" :pluginData="pluginData"></PluginConfig>
          </template>
        </TsForm>
      </div>
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
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    PluginConfig: () => import('@/commercial-module/alert/pages/alertevent/components/config/alertevent-configer.vue')
  },
  props: {
    name: { type: String }
  },
  data() {
    return {
      pluginData: { isActive: 1, config: {} },
      dialogConfig: {
        title: this.$t('dialog.title.edittarget', { target: this.$t('page.config') }),
        width: 'small',
        isShow: true,
        maskClose: false
      },
      formConfig: {
        isActive: {
          type: 'radio',
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ],
          label: this.$t('term.report.isactive'),
          trueValue: 1,
          falseValue: 0
        },
        config: {
          type: 'slot',
          label: this.$t('page.config')
        }
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getPluginConfigByName();
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
    getPluginConfigByName() {
      if (this.name) {
        this.$api.alert.alertevent.getAlertEventPluginByName(this.name).then(res => {
          this.pluginData = res.Return;
        });
      }
    },
    save() {
      if (this.$refs.pluginConfig && this.$refs.pluginConfig.valid()) {
        const config = this.$refs.pluginConfig.getConfig();
        this.pluginData.config = config;
        this.$api.alert.alertevent
          .saveAlertEventPluginConfig(this.pluginData)
          .then(res => {
            this.$Message.success(this.$t('message.savesuccess'));
            this.close(true);
          });
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
