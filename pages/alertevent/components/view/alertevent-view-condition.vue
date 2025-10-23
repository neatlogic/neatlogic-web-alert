<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <div
      v-for="(condition, index) in conditionList"
      :key="index"
    >
      <ConditionGroup
        v-model="condition.rule"
        :readonly="true"
        :padding="false"
        :level="level"
        :attrList="attrList"
      ></ConditionGroup>
      <div v-if="condition.hasOwnProperty('result')" class="mt-md">
        <span class="text-grey mr-sm"><b>判定结果</b></span>
        <span v-if="condition.result === true" class="text-success">条件满足</span>
        <span v-else-if="condition.result === false" class="text-error">条件不满足</span>
        <span v-else class="text-grey">{{ condition.result }}</span>
      </div>
      <div v-if="selectedHandlerList(condition).length > 0" class="mt-md">
        <div class="text-success mb-md">满足以上条件则执行</div>
        <div
          v-for="(selectedHandler, hindex) in selectedHandlerList(condition)"
          :key="hindex"
          class="handler-container padding-md radius-md mb-md"
          :class="{
            'bg-grey': level % 2 === 0,
            'bg-op': level % 2 !== 0
          }"
        >
          <div>
            <span><b class="text-grey">{{ hindex+1 }}.{{ selectedHandler.name }}</b></span>
          </div>
          <component
            :is="handlers && handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            v-if="handlers[selectedHandler.handler.toLowerCase() + '_eventhandler']"
            :ref="'pluginConfig' + index"
            :handler="selectedHandler"
            :event="event"
            :mode="mode"
            :isChild="true"
            :level="level + 1"
          ></component>
        </div>
      </div>
    </div>
    <TsFormItem
      v-if="handler.error"
      style="margin: 0px !important"
      labelPosition="left"
      :labelWidth="90"
      label="异常"
    >
      <div class="text-error">{{ handler.error }}</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    ConditionGroup: () => import('@/resources/components/Condition/condition-group.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      attrList: [],
      handlers: []
    };
  },
  beforeCreate() {},
  async created() {
    const handlers = await import('@/community-module/alert/pages/alertevent/components/view/index.js');
    this.handlers = handlers.default;
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
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList({ isCondition: 1 }).then(res => {
        this.attrList = res.Return;
      });
    }
  },
  filter: {},
  computed: {
    conditionList() {
      if (this.mode === 'audit') {
        return this.handler?.result?.conditionList || [];
      } else {
        return this.configLocal.conditionList;
      }
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
