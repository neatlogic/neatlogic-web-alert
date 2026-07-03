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
    <component :is="isChild ? 'div' : 'TsFormItem'" :label="$t('page.condition')" labelPosition="left">
      <div>
        <div v-for="(condition, index) in configLocal.conditionList" :key="index">
          <ConditionGroup
            v-model="condition.rule"
            :padding="true"
            :level="level"
            :attrList="attrList"
          ></ConditionGroup>
          <div class="mt-md">
            <div class="text-success mb-md">{{ $t('term.alert.abeyrule') }}</div>
            <draggable
              v-if="selectedHandlerList(condition).length > 0"
              tag="div"
              :list="selectedHandlerList(condition)"
              handle=".tsfont-drag"
              group="root"
              @change="changeSort(condition)"
            >
              <div
                v-for="(selectedHandler, hindex) in selectedHandlerList(condition)"
                :key="hindex"
                class="handler-container padding-md radius-md mb-md"
                :class="{
                  'bg-grey': level % 2 === 0,
                  'bg-op': level % 2 !== 0
                }"
              >
                <div class="tsfont-close-s text-grey cursor del-handler" @click="removeHandler(condition, hindex)"></div>
                <div>
                  <span class="tsfont-drag" style="cursor: move"></span>
                  <span>
                    <b class="text-grey">{{ hindex + 1 }}.{{ selectedHandler.name }}</b>
                  </span>
                </div>
                <component
                  :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
                  v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
                  :ref="'pluginConfig_' + index + '_' + hindex"
                  :handler="selectedHandler"
                  :event="event"
                  :alertType="alertType"
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
                  <div slot="content" class="api" style="max-height: 300px; overflow: auto !important">
                    <div
                      v-for="(plugin, hindex) in pluginList"
                      :key="hindex"
                      class="cursor"
                      @click="addPlugin(condition, plugin)"
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
              <div v-else class="text-error">{{ $t('term.alert.noplugin') }}</div>
            </div>
          </div>
        </div>
        <Alert v-if="error" class="mt-md" type="error">{{ error }}</Alert>
      </div>
    </component>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
export default {
  name: '',
  components: {
    draggable,
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio')
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
      this.configLocal = { conditionList: [{ rule: null, handler: null }] };
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
    changeSort(condition) {},
    selectedHandlerList(condition) {
      if (condition.handler) {
        if (Array.isArray(condition.handler)) {
          return condition.handler;
        } else if (typeof condition.handler === 'object') {
          return [condition.handler];
        }
      }
      return [];
    },
    removeHandler(condition, index) {
      if (condition.handler) {
        if (Array.isArray(condition.handler)) {
          condition.handler.splice(index, 1);
        } else if (typeof condition.handler === 'object') {
          this.$set(condition, 'handler', []);
        }
      }
    },
    addCondition() {},
    addPlugin(condition, plugin) {
      const handlerData = {
        uuid: this.$utils.setUuid(),
        name: plugin.label,
        handler: plugin.name,
        icon: plugin.icon,
        isActive: 1
      };
      if (!condition.handler) {
        this.$set(condition, 'handler', [handlerData]);
      } else {
        if (!Array.isArray(condition.handler)) {
          //转换旧数据
          condition.handler = [condition.handler];
        }
        condition.handler.push(handlerData);
      }
      this.error = '';
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin({ eventName: this.event.name, parentPlugin: this.handler.handler }).then(res => {
        this.pluginList = res.Return;
      });
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList({ isCondition: 1 }).then(res => {
        this.attrList = res.Return;
      });
    },
    async valid() {
      let isValid = true;
      if (this.configLocal.conditionList && this.configLocal.conditionList.length > 0) {
        for (let i = 0; i < this.configLocal.conditionList.length; i++) {
          const condition = this.configLocal.conditionList[i];
          if (!condition.handler || condition.handler.length === 0) {
            isValid = false;
            this.error = this.$t('term.alert.selectplugin');
          } else {
            for (let hindex = 0; hindex < condition.handler.length; hindex++) {
              const pluginConfig = this.$refs[`pluginConfig_${i}_${hindex}`];
              if (pluginConfig && !(await pluginConfig[0].valid())) {
                isValid = false;
              }
            }
          }
        }
      }
      return isValid;
    },
    getConfig() {
      if (this.configLocal.conditionList && this.configLocal.conditionList.length > 0) {
        this.configLocal.conditionList.forEach((condition, index) => {
          if (condition.handler) {
            if (Array.isArray(condition.handler) && condition.handler.length > 0) {
              condition.handler.forEach((h, hindex) => {
                const pluginConfig = this.$refs[`pluginConfig_${index}_${hindex}`];
                this.$set(h, 'config', pluginConfig[0].getConfig());
              });
            } else if (typeof condition.handler === 'object') {
              //转换老数据
              const pluginConfig = this.$refs[`pluginConfig_${index}_0`];
              this.$set(condition.handler, 'config', pluginConfig[0].getConfig());
              condition.handler = [condition.handler];
            }
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
