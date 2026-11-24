<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <TsFormItem :required="true" :label="$t('page.name')" labelPosition="left">
          <TsFormInput
            ref="txtName"
            v-model="eventHandlerData.name"
            border="border"
            :maxlength="50"
            :validateList="[{ name: 'required', message: ' ' }]"
          ></TsFormInput>
        </TsFormItem>
        <TsFormItem :label="$t('page.event')" labelPosition="left">
          <span>{{ event.label }}·{{ event.name }}</span>
        </TsFormItem>
        <TsFormItem :label="$t('page.plugins')" labelPosition="left">
          <span v-if="plugin">{{ plugin.label }}·{{ plugin.name }}</span>
          <span v-else-if="eventHandlerData">{{ eventHandlerData.handlerName }}·{{ eventHandlerData.handler }}</span>
        </TsFormItem>
        <component
          :is="pluginComponent"
          v-if="pluginComponent"
          ref="pluginConfig"
          :level="1"
          :event="event"
          :alertType="alertType"
          :handler="eventHandlerData"
        ></component>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" :loading="saving" @click="save()">{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
import handlers from '@/community-module/alert/pages/alertevent/components/edit/index.js';
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    ...handlers
  },
  props: {
    id: { type: Number },
    plugin: { type: Object },
    event: { type: Object },
    alertType: { type: Object }
  },
  data() {
    return {
      saving: false,
      handlers: handlers,
      eventHandlerData: {},
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('page.plugins') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.plugins') }),
        width: 'large',
        isShow: true,
        maskClose: false
      }
    };
  },
  beforeCreate() {},
  created() {
    this.getEventHandlerById();
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
    getEventHandlerById() {
      if (this.id) {
        this.$api.alert.alertevent.getAlertEventHandlerById(this.id).then(res => {
          this.eventHandlerData = res.Return;
        });
      } else {
        this.eventHandlerData = {
          uuid: this.$utils.setUuid(),
          name: this.plugin.label,
          event: this.event.name,
          alertType: this.alertType.id,
          handler: this.plugin.name,
          isAsync: this.plugin.isAsync,
          isActive: 1,
          config: null
        };
      }
    },
    // 配置校验和保存共用等待状态，阻止重复提交。
    async save() {
      const { txtName, pluginConfig } = this.$refs;
      // 插件详情和异步配置组件就绪后才能校验并提交。
      if (this.saving || !this.handlerName || (this.pluginComponent && !pluginConfig)) return;
      this.saving = true;
      try {
        if (txtName && !txtName.valid()) return;
        if (pluginConfig && !(await pluginConfig.valid())) return;
        if (pluginConfig) this.eventHandlerData.config = pluginConfig.getConfig();
        await this.$api.alert.alertevent.saveAlertEventHandler(this.eventHandlerData);
        this.$Message.success(this.$t('message.savesuccess'));
        this.close(true);
      } finally {
        this.saving = false;
      }
    }
  },
  filter: {},
  computed: {
    compactLayout() { return this.handlerName === 'REPORT_TASK'; },
    // 根据事件插件标识查找已注册的配置组件。
    pluginComponent() {
      return this.handlerName && this.handlers[this.handlerName.toLowerCase() + '_eventhandler'];
    },
    handlerName() {
      if (this.plugin) {
        return this.plugin.name;
      } else if (this.eventHandlerData) {
        return this.eventHandlerData.handler;
      }
      return '';
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
