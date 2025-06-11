<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="集成" labelPosition="left" :required="true">
      <TsFormSelect
        ref="integraionUuid"
        v-model="configLocal.integrationUuid"
        transfer
        dynamicUrl="/api/rest/integration/search"
        :params="{ isActive: 1 }"
        rootName="tbodyList"
        textName="name"
        valueName="uuid"
        border="border"
        :validateList="[{ name: 'required', message: ' ' }]"
        @on-change="
          val => {
            getIntegrationByUuid(val);
          }
        "
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem v-if="integrationData && paramList.length > 0" label="参数映射" labelPosition="left">
      <div>
        <div>
          <span class="mr-xs text-grey">点击复制属性</span>
          <Tag
            v-for="(attr, index) in attrList"
            :key="index"
            v-clipboard="attr.freemarkerSnippet || '${DATA.' + attr.name + '}'"
            v-clipboard:success="clipboardSuc"
            class="cursor"
            @click.stop
          >{{ attr.label }}</Tag>
        </div>
        <TsFormItem
          v-for="(param, index) in paramList"
          :key="index"
          labelPosition="top"
          :label="(param.description || param.name) + '(' + param.typeName + ')'"
        >
          <TsFormInput
            type="textarea"
            border="border"
            :value="getExpression(param.name)"
            @on-change="
              val => {
                const index = configLocal.paramMapping.findIndex(d => d.name === param.name);
                const data = { name: param.name, expression: val };
                if (index > -1) {
                  $set(configLocal.paramMapping, index, data);
                } else {
                  configLocal.paramMapping.push(data);
                }
              }
            "
          ></TsFormInput>
        </TsFormItem>
      </div>
    </TsFormItem>
    <TsFormItem label="调用间隔" labelPosition="left">
      <TsFormInput
        v-model="configLocal.interval"
        type="number"
        :min="1"
        :step="1"
        border="border"
      ></TsFormInput>
      <div class="text-grey">帮助：在调用间隔时间（?分钟）内只会调用一次</div>
    </TsFormItem>
    <TsFormItem label="成功动作" labelPosition="left">
      <div>
        <draggable
          v-if="configLocal.successCallbackList && configLocal.successCallbackList.length > 0"
          tag="div"
          :list="configLocal.successCallbackList"
          handle=".tsfont-drag"
          group="root"
        >
          <div
            v-for="(selectedHandler, hindex) in configLocal.successCallbackList"
            :key="hindex"
            class="handler-container padding-md radius-md mb-md"
            :class="{
              'bg-grey': level % 2 === 0,
              'bg-op': level % 2 !== 0
            }"
          >
            <div class="tsfont-close-s text-grey cursor del-handler" @click="configLocal.successCallbackList.splice(hindex, 1)"></div>
            <div>
              <span class="tsfont-drag" style="cursor: move"></span>
              <span>
                <b class="text-grey">{{ hindex + 1 }}.{{ selectedHandler.name }}</b>
              </span>
            </div>
            <component
              :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
              v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
              :ref="'successPluginConfig_' + hindex"
              :handler="selectedHandler"
              :event="event"
              :isChild="true"
              :level="level + 1"
            ></component>
          </div>
        </draggable>
        <div>
          <div v-if="pluginList && pluginList.length > 0">
            <Poptip
              transfer
              trigger="hover"
              word-wrap
              placement="top"
              width="400"
            >
              <a href="javascript:void(0)" class="tsfont-plus">{{ $t('dialog.title.addtarget', { target: $t('page.plugins') }) }}</a>
              <div slot="content" class="api">
                <div
                  v-for="(plugin, hindex) in pluginList"
                  :key="hindex"
                  class="cursor"
                  @click="addPlugin(configLocal.successCallbackList, plugin)"
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
      </div>
    </TsFormItem>
    <TsFormItem label="失败动作" labelPosition="left">
      <div>
        <draggable
          v-if="configLocal.failedCallbackList && configLocal.failedCallbackList.length > 0"
          tag="div"
          :list="configLocal.failedCallbackList"
          handle=".tsfont-drag"
          group="root"
        >
          <div
            v-for="(selectedHandler, hindex) in configLocal.failedCallbackList"
            :key="hindex"
            class="handler-container padding-md radius-md mb-md"
            :class="{
              'bg-grey': level % 2 === 0,
              'bg-op': level % 2 !== 0
            }"
          >
            <div class="tsfont-close-s text-grey cursor del-handler" @click="configLocal.failedCallbackList.splice(hindex, 1)"></div>
            <div>
              <span class="tsfont-drag" style="cursor: move"></span>
              <span>
                <b class="text-grey">{{ hindex + 1 }}.{{ selectedHandler.name }}</b>
              </span>
            </div>
            <component
              :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
              v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
              :ref="'failedPluginConfig_' + hindex"
              :handler="selectedHandler"
              :event="event"
              :isChild="true"
              :level="level + 1"
            ></component>
          </div>
        </draggable>
        <div>
          <div v-if="pluginList && pluginList.length > 0">
            <Poptip
              transfer
              trigger="hover"
              word-wrap
              placement="top"
              width="400"
            >
              <a href="javascript:void(0)" class="tsfont-plus">{{ $t('dialog.title.addtarget', { target: $t('page.plugins') }) }}</a>
              <div slot="content" class="api">
                <div
                  v-for="(plugin, hindex) in pluginList"
                  :key="hindex"
                  class="cursor"
                  @click="addPlugin(configLocal.failedCallbackList, plugin)"
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
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
import clipboard from '@/resources/directives/clipboard.js';
import draggable from 'vuedraggable';
export default {
  name: '',
  components: {
    draggable,
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput')
  },
  directives: { clipboard },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      integrationData: null,
      attrList: [],
      handlers: [],
      pluginList: []
    };
  },
  beforeCreate() {},
  async created() {
    const handlers = await import('@/community-module/alert/pages/alertevent/components/edit/index.js');
    this.handlers = handlers.default;
    if (!this.configLocal.paramMapping) {
      this.$set(this.configLocal, 'paramMapping', []);
    }
    if (!this.configLocal.successCallbackList) {
      this.$set(this.configLocal, 'successCallbackList', []);
    }
    if (!this.configLocal.failedCallbackList) {
      this.$set(this.configLocal, 'failedCallbackList', []);
    }
    if (this.configLocal.integrationUuid) {
      this.getIntegrationByUuid(this.configLocal.integrationUuid);
    }
    this.listAlertAttrList();
    this.listEventPlugin();
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
    addPlugin(list, plugin) {
      const handlerData = {
        uuid: this.$utils.setUuid(),
        name: plugin.label,
        handler: plugin.name,
        icon: plugin.icon,
        isActive: 1
      };
      list.push(handlerData);
    },
    removeHandler(index) {
      if (this.configLocal.successCallbackList) {
        this.configLocal.successCallbackList.splice(index, 1);
      }
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin({ eventName: this.event.name, parentPlugin: this.handler.handler }).then(res => {
        this.pluginList = res.Return;
      });
    },
    async valid() {
      let isValid = true;
      const integraionUuid = this.$refs.integraionUuid;
      if (!integraionUuid || !integraionUuid.valid()) {
        isValid = false;
      }

      if (this.configLocal.successCallbackList && this.configLocal.successCallbackList.length > 0) {
        for (let i = 0; i < this.configLocal.successCallbackList.length; i++) {
          const pluginConfig = this.$refs[`successPluginConfig_${i}`];
          if (pluginConfig && !(await pluginConfig[0].valid())) {
            isValid = false;
          }
        }
      }

      if (this.configLocal.failedCallbackList && this.configLocal.failedCallbackList.length > 0) {
        for (let i = 0; i < this.configLocal.failedCallbackList.length; i++) {
          const pluginConfig = this.$refs[`failedPluginConfig_${i}`];
          if (pluginConfig && !(await pluginConfig[0].valid())) {
            isValid = false;
          }
        }
      }

      return isValid;
    },
    clipboardSuc() {
      this.$Message.success(this.$t('message.copysuccess'));
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList({ isExpand: 1 }).then(res => {
        this.attrList = res.Return;
      });
    },
    getIntegrationByUuid(uuid) {
      this.integrationData = null;
      if (uuid) {
        this.$api.framework.integration.getIntegrationByUuid({ uuid: uuid }).then(res => {
          this.integrationData = res.Return;
        });
      }
    },
    getExpression(name) {
      const item = this.configLocal.paramMapping.find(d => d.name === name);
      return item ? item.expression : '';
    },
    getConfig() {
      if (this.configLocal.successCallbackList && this.configLocal.successCallbackList.length > 0) {
        this.configLocal.successCallbackList.forEach((handler, index) => {
          const pluginConfig = this.$refs[`successPluginConfig_${index}`];
          this.$set(handler, 'config', pluginConfig[0].getConfig());
        });
      }
      if (this.configLocal.failedCallbackList && this.configLocal.failedCallbackList.length > 0) {
        this.configLocal.failedCallbackList.forEach((handler, index) => {
          const pluginConfig = this.$refs[`failedPluginConfig_${index}`];
          this.$set(handler, 'config', pluginConfig[0].getConfig());
        });
      }
      return this.configLocal;
    }
  },
  filter: {},
  computed: {
    paramList() {
      return (this.integrationData && this.integrationData?.config?.param?.paramList) || [];
    }
  },
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
