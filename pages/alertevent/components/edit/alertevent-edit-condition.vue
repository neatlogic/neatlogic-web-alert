<template>
  <div>
    <component :is="isChild ? 'div' : 'TsFormItem'" label="条件" labelPosition="left">
      <div>
        <div
          v-for="(condition, index) in configLocal.conditionList"
          :key="index"
          class="radius-md"
          :class="{
            padding: isChild,
            'bg-op': level % 2 === 0,
            'bg-grey': level % 2 !== 0
          }"
        >
          <ConditionGroup
            v-model="condition.rule"
            :padding="false"
            :level="level"
            :attrList="attrList"
          ></ConditionGroup>
          <div class="mt-md">
            <div v-if="!condition.handler">
              <Dropdown placement="bottom-start" :transfer="true">
                <a href="javascript:void(0)" class="tsfont-plus">添加插件</a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="(plugin, hindex) in pluginList" :key="hindex" @click.native="addPlugin(condition, plugin)">
                    <span :class="plugin.icon">{{ plugin.label }}</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div v-else class="handler-container">
              <div class="tsfont-close-s text-grey cursor del-handler" @click="$set(condition, 'handler', null)"></div>
              <component
                :is="handlers && handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
                v-if="handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
                :ref="'pluginConfig' + index"
                :handler="condition.handler"
                :event="event"
                :isChild="true"
                :level="level + 1"
              ></component>
            </div>
          </div>
        </div>
        <Alert v-if="error" class="mt-md" type="error">{{ error }}</Alert>
      </div>
    </component>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';
export default {
  name: '',
  components: {
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue'),
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
      this.configLocal = { conditionList: [{ rule: null, handler: null }] };
    }
    this.handlers = await import('@/commercial-module/alert/pages/alertevent/components/edit/index.js');
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
    addCondition() {},
    addPlugin(condition, plugin) {
      const handlerData = {
        uuid: this.$utils.setUuid(),
        name: plugin.label,
        handler: plugin.name,
        icon: plugin.icon,
        isActive: 1
      };
      this.$set(condition, 'handler', handlerData);
      this.error = '';
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin({ eventName: this.event.name }).then(res => {
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
      if (this.configLocal.conditionList && this.configLocal.conditionList.length > 0) {
        for (let i = 0; i < this.configLocal.conditionList.length; i++) {
          const condition = this.configLocal.conditionList[i];
          if (!condition.handler) {
            isValid = false;
            this.error = '请选择插件';
          }
          const pluginConfig = this.$refs[`pluginConfig${i}`];
          if (pluginConfig && !(await pluginConfig[0].valid())) {
            isValid = false;
          }
        }
      }
      return isValid;
    },
    getConfig() {
      if (this.configLocal.conditionList && this.configLocal.conditionList.length > 0) {
        this.configLocal.conditionList.forEach((condition, index) => {
          const pluginConfig = this.$refs[`pluginConfig${index}`];
          if (pluginConfig) {
            this.$set(condition.handler, 'config', pluginConfig[0].getConfig());
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
</style>
