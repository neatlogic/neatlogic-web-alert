<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <TsFormItem :required="true" label="名称" labelPosition="left">
          <TsFormInput
            ref="txtName"
            v-model="eventHandlerData.name"
            border="border"
            :maxlength="50"
            :validateList="[{ name: 'required', message: ' ' }]"
          ></TsFormInput>
        </TsFormItem>
        <TsFormItem label="事件" labelPosition="left">
          <span>{{ event.label }}·{{ event.name }}</span>
        </TsFormItem>
        <TsFormItem label="插件" labelPosition="left">
          <span v-if="plugin">{{ plugin.label }}·{{ plugin.name }}</span>
          <span v-else-if="eventHandlerData">{{ eventHandlerData.handlerName }}·{{ eventHandlerData.handler }}</span>
        </TsFormItem>
        <TsFormItem label="是否激活" labelPosition="left">
          <TsFormSwitch v-model="eventHandlerData.isActive" :trueValue="1" :falseValue="0"></TsFormSwitch>
        </TsFormItem>
        <component
          :is="handlers[handlerName.toLowerCase() + '_eventhandler']"
          v-if="handlerName && handlers[handlerName.toLowerCase() + '_eventhandler']"
          ref="pluginConfig"
          :level="1"
          :event="event"
          :handler="eventHandlerData"
        ></component>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" @click="save()">{{ $t('page.confirm') }}</Button>
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
          isActive: 1,
          config: null
        };
      }
    },
    async save() {
      let isValid = true;
      const txtName = this.$refs.txtName;
      const pluginConfig = this.$refs.pluginConfig;
      if (txtName && !txtName.valid()) {
        isValid = false;
      }
      if (pluginConfig && !(await pluginConfig.valid())) {
        isValid = false;
      }
      if (isValid) {
        if (pluginConfig) {
          this.eventHandlerData.config = pluginConfig.getConfig();
        }
        this.$api.alert.alertevent.saveAlertEventHandler(this.eventHandlerData).then(() => {
          this.$Message.success(this.$t('message.savesuccess'));
          this.close(true);
        });
      }
    }
  },
  filter: {},
  computed: {
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
