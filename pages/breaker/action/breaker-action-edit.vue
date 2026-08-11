<template>
  <div>
    <TsFormItem
      v-for="trigger in triggerList"
      :key="trigger.value"
      :label="trigger.text"
      labelPosition="right"
    >
      <div class="action-form-content">
        <draggable
          v-if="configLocal[trigger.key] && configLocal[trigger.key].length > 0"
          tag="div"
          :list="configLocal[trigger.key]"
          handle=".tsfont-drag"
        >
          <div v-for="(action, index) in configLocal[trigger.key]" :key="action.uuid" class="action-container padding-md radius-md bg-op mb-md">
            <div class="tsfont-close-s text-grey cursor del-action" @click="configLocal[trigger.key].splice(index, 1)"></div>
            <div class="mb-sm">
              <span class="tsfont-drag cursor"></span>
              <span class="ml-xs text-grey">{{ index + 1 }}.</span>
              <Tag v-if="action.handlerLabel" class="ml-xs">{{ action.handlerLabel }}</Tag>
            </div>
            <TsForm v-model="configLocal[trigger.key][index]" :item-list="getActionFormConfig(configLocal[trigger.key][index])"></TsForm>
            <component
              :is="actionComponentMap[action.handler && action.handler.toLowerCase()]"
              v-if="action.handler && actionComponentMap[action.handler.toLowerCase()]"
              :ref="getActionRef(trigger.key, index)"
              v-model="configLocal[trigger.key][index].config"
              :trigger="trigger.value"
            ></component>
          </div>
        </draggable>
        <Poptip
          transfer
          trigger="hover"
          word-wrap
          placement="top"
          width="400"
        >
          <a href="javascript:void(0)" class="tsfont-plus">{{ $t('term.alert.addbreakeraction') }}</a>
          <div slot="content" style="max-height: 300px; overflow: auto !important">
            <div
              v-for="(handler, index) in getHandlerList(trigger.value)"
              :key="handler.name"
              class="cursor padding-sm radius-sm action-item"
              @click="addAction(trigger.key, handler)"
            >
              <b>{{ handler.label }}</b>
              <div class="text-grey">{{ handler.description }}</div>
              <Divider v-if="index < getHandlerList(trigger.value).length - 1" style="margin: 8px 0"></Divider>
            </div>
          </div>
        </Poptip>
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import actionComponentMap from './components/edit/index.js';
export default {
  name: '',
  components: {
    draggable,
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    value: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      configLocal: {},
      isSyncing: false,
      actionHandlerList: [],
      actionComponentMap,
      triggerList: [
        { value: 'OPEN', key: 'openActionList', text: this.$t('term.alert.breakeropenactiontrigger') },
        { value: 'AGGREGATE', key: 'aggregateActionList', text: this.$t('term.alert.breakeraggregateactiontrigger') },
        { value: 'RECOVER', key: 'recoverActionList', text: this.$t('term.alert.breakerrecoveractiontrigger') }
      ]
    };
  },
  created() {
    this.initConfig(this.value);
    this.listActionHandler();
  },
  methods: {
    initConfig(config) {
      this.isSyncing = true;
      const configLocal = { ...(config || {}) };
      this.triggerList.forEach(trigger => {
        if (!Array.isArray(configLocal[trigger.key])) {
          configLocal[trigger.key] = [];
        }
      });
      this.configLocal = configLocal;
      this.$nextTick(() => {
        this.isSyncing = false;
      });
    },
    listActionHandler() {
      this.$api.alert.breaker.listActionHandler().then(res => {
        this.actionHandlerList = res.Return || [];
      });
    },
    getHandlerList(trigger) {
      return this.actionHandlerList.filter(handler => !handler.supportTriggerList || handler.supportTriggerList.includes(trigger));
    },
    addAction(key, handler) {
      this.configLocal[key].push({
        uuid: this.$utils.setUuid(),
        name: handler.label,
        handler: handler.name,
        handlerLabel: handler.label,
        isActive: 1,
        config: {}
      });
    },
    getActionRef(key, index) {
      return `${key}_${index}`;
    },
    getActionFormConfig(action) {
      return {
        name: {
          type: 'text',
          label: this.$t('page.actionname'),
          value: action && action.name,
          validateList: ['required']
        },
        isActive: {
          type: 'radio',
          label: this.$t('page.isactive'),
          value: action && action.isActive,
          dataList: [
            { value: 1, text: this.$t('page.yes') },
            { value: 0, text: this.$t('page.no') }
          ]
        }
      };
    },
    async valid() {
      let isValid = true;
      for (const trigger of this.triggerList) {
        const list = this.configLocal[trigger.key] || [];
        for (let i = 0; i < list.length; i++) {
          const ref = this.$refs[this.getActionRef(trigger.key, i)];
          if (ref && ref[0] && ref[0].valid && !(await ref[0].valid())) {
            isValid = false;
          }
        }
      }
      return isValid;
    },
    getConfig() {
      for (const trigger of this.triggerList) {
        const list = this.configLocal[trigger.key] || [];
        for (let i = 0; i < list.length; i++) {
          const ref = this.$refs[this.getActionRef(trigger.key, i)];
          if (ref && ref[0] && ref[0].getConfig) {
            this.$set(list[i], 'config', ref[0].getConfig());
          }
        }
      }
      return this.configLocal;
    }
  },
  watch: {
    value: {
      handler(val) {
        this.initConfig(val);
      },
      deep: true
    },
    configLocal: {
      handler(val) {
        if (this.isSyncing) {
          return;
        }
        this.$emit('input', val);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.action-form-content {
  width: 100%;
}
.action-container {
  position: relative;
  .del-action {
    display: none;
    position: absolute;
    top: 8px;
    right: 8px;
  }
  &:hover {
    .del-action {
      display: block;
    }
  }
}
</style>
