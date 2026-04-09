<template>
  <div
    class="radius-md"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <EditBase :handler="handler"></EditBase>
    <component :is="isChild ? 'div' : 'TsFormItem'" label="调度设置" labelPosition="left">
      <div
        v-for="(interval, index) in configLocal.intervalList"
        :key="index"
        class="mb-md padding-md radius-md"
        :class="{
          'bg-grey': level % 2 === 0,
          'bg-op': level % 2 !== 0
        }"
      >
        <div class="action-group">
          <div class="action-item">当前步骤开始</div>
          <div class="action-item">
            <TsFormInput
              ref="txtDelay"
              v-model="interval.delayMinute"
              :min="0"
              type="number"
              :width="100"
              :validateList="[{ name: 'required', message: ' ' }]"
            ></TsFormInput>
          </div>
          <div class="action-item">分钟后执行</div>
          <div class="action-item">重复</div>
          <div class="action-item"><TsFormInput
            v-model="interval.repeatCount"
            :min="0"
            type="number"
            :width="100"
          ></TsFormInput></div>
          <div class="action-item">次</div>
          <div class="action-item">每次间隔</div>
          <div class="action-item"><TsFormInput
            v-model="interval.intervalMinute"
            type="number"
            :min="0"
            :width="100"
          ></TsFormInput></div>
          <div class="action-item">分钟</div>
        </div>
        <div v-if="!interval.handler">
          <div v-if="pluginList && pluginList.length > 0" class="mt-md padding-xs bg-info-grey radius-md" style="text-align: center">
            <Poptip
              transfer
              trigger="hover"
              word-wrap
              placement="top"
              width="400"
            >
              <a href="javascript:void(0)" class="tsfont-plus">{{ $t('dialog.title.addtarget', { target: $t('page.plugins') }) }}</a>
              <div slot="content" class="api" style="max-height: 300px; overflow: auto !important">
                <div
                  v-for="(plugin, hindex) in pluginList"
                  :key="hindex"
                  class="cursor"
                  @click="addPlugin(interval, plugin)"
                >
                  <div class="plugin-grid cursor padding-sm radius-sm plugin-item">
                    <div><i class="fz20 text-primary" :class="plugin.icon"></i></div>
                    <div>
                      <span class="mr-sm">
                        <b>{{ plugin.label }}</b>
                      </span>
                      <span class="text-grey">{{ plugin.description }}</span>
                    </div>
                  </div>
                  <Divider v-if="hindex < pluginList.length - 1" style="margin: 0px"></Divider>
                </div>
              </div>
            </Poptip>
          </div>
          <div v-else class="text-error">没有可用插件</div>
        </div>
        <div v-else class="handler-container">
          <div class="tsfont-close-s text-grey cursor del-handler" @click="$set(interval, 'handler', null)"></div>
          <component
            :is="handlers && handlers[interval.handler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[interval.handler.handler.toLowerCase() + '_eventhandler']"
            :ref="'pluginConfig' + index"
            :handler="interval.handler"
            :event="event"
            :alertType="alertType"
            :isChild="true"
            :level="level + 1"
          ></component>
        </div>
      </div>
      <div v-if="configLocal.intervalList.length === 0">
        <!--只允许添加一个调度，否则后台要改-->
        <span class="tsfont-plus cursor text-href" @click="addInterval()">添加调度</span>
      </div>
      <Alert v-if="error" type="error">{{ error }}</Alert>
    </component>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
export default {
  name: '',
  components: {
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
      pluginList: [],
      error: '',
      handlers: []
    };
  },
  beforeCreate() {},
  async created() {
    if (this.$utils.isEmpty(this.configLocal)) {
      this.configLocal = { intervalList: [] };
    }
    const handlers = await import('@/community-module/alert/pages/alertevent/components/edit/index.js');
    this.handlers = handlers.default;
    this.listEventPlugin();
    this.listAlertAttrList();
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
    addInterval() {
      this.configLocal.intervalList.push({
        delayMinute: 0,
        repeatCount: 0
      });
      this.error = '';
    },
    addPlugin(interval, plugin) {
      const handlerData = {
        uuid: this.$utils.setUuid(),
        name: plugin.label,
        handler: plugin.name,
        icon: plugin.icon,
        isActive: 1
      };
      this.$set(interval, 'handler', handlerData);
      this.error = '';
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin({ eventName: this.event.name, parentPlugin: this.handler.handler }).then(res => {
        this.pluginList = res.Return;
      });
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.attrList = res.Return;
      });
    },
    async valid() {
      let isValid = true;
      const txtDelays = this.$refs.txtDelay;
      if (txtDelays && txtDelays.length > 0) {
        for (let i = 0; i < txtDelays.length; i++) {
          if (!txtDelays[i].valid()) {
            isValid = false;
          }
        }
      }
      if (this.configLocal.intervalList && this.configLocal.intervalList.length > 0) {
        for (let i = 0; i < this.configLocal.intervalList.length; i++) {
          const interval = this.configLocal.intervalList[i];
          if (!interval.handler) {
            isValid = false;
            this.error = '请选择插件';
          }
          const pluginConfig = this.$refs[`pluginConfig${i}`];
          if (pluginConfig && !(await pluginConfig[0].valid())) {
            isValid = false;
          }
        }
      } else {
        this.error = '至少添加一个调度配置';
        isValid = false;
      }
      return isValid;
    },
    getConfig() {
      if (this.configLocal.intervalList && this.configLocal.intervalList.length > 0) {
        this.configLocal.intervalList.forEach((interval, index) => {
          const pluginConfig = this.$refs[`pluginConfig${index}`];
          if (pluginConfig) {
            this.$set(interval.handler, 'config', pluginConfig[0].getConfig());
          }
        });
      }
      return this.configLocal;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
@import '~@/resources/assets/css/variable.less';

.handler-container {
  position: relative;
  width: 100%;

  &:hover {
    .del-handler {
      display: block;
    }
  }

  .del-handler {
    display: none;
    z-index: 10;
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
  }
}
.plugin-grid {
  display: grid;
  grid-template-columns: 40px auto;
}

.theme(@hover-color) {
  .plugin-item:hover {
    background-color: @hover-color;
  }
}
html {
  .theme(@default-info-bg-color);

  &.theme-dark {
    .theme(@dark-info-bg-color);
  }
}
</style>
