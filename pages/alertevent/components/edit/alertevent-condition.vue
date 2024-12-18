<template>
  <div>
    <component :is="isChild ? 'div' : 'TsFormItem'" label="条件">
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
        <ConditionGroup v-model="condition.rule" :level="level + 1" :attrList="attrList"></ConditionGroup>
        <div class="mt-md">
          <Dropdown v-if="!condition.handler" placement="bottom-start" :transfer="true">
            <a href="javascript:void(0)" class="tsfont-plus">添加插件</a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(plugin, hindex) in pluginList" :key="hindex" @click.native="addPlugin(condition, plugin)">{{ plugin.label }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div v-else class="handler-container">
            <div class="tsfont-close-s text-grey cursor del-handler" @click="$set(condition, 'handler', null)"></div>
            <component
              :is="handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
              v-if="handlers[condition.handler.handler.toLowerCase() + '_eventhandler']"
              :ref="'pluginConfig' + index"
              :config="condition.handler.config"
              :isChild="true"
              :level="level + 1"
            ></component>
          </div>
        </div>
      </div>
    </component>
    <div @click="getConfig()">test</div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-base.js';
//import * as plugins from '@/commercial-module/alert/pages/alertevent/components/edit/index.js';
export default {
  name: '',
  components: {
    //...plugins,
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      configLocal: this.$utils.deepClone(this.config) || { conditionList: [{ rule: null, handler: null }] },
      attrList: [],
      pluginList: []
    };
  },
  beforeCreate() {},
  async created() {
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
        isActive: 1
      };
      this.$set(condition, 'handler', handlerData);
    },
    listEventPlugin() {
      this.$api.alert.alertevent.listEventPlugin().then(res => {
        this.pluginList = res.Return;
      });
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList().then(res => {
        this.attrList = res.Return;
      });
    },
    getConfig() {
      if (this.configLocal.conditionList && this.configLocal.conditionList.length > 0) {
        this.configLocal.conditionList.forEach((condition, index) => {
          const pluginConfig = this.$refs[`pluginConfig${index}`];
          if (pluginConfig) {
            this.$set(condition, 'handler', pluginConfig[0].getConfig());
          }
        });
      }
      if (!this.isChild) {
        console.log(JSON.stringify(this.configLocal, null, 2));
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
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
  }
}
</style>
