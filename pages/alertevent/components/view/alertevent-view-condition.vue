<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <div v-for="(condition, index) in conditionList" :key="index">
      <ConditionGroup
        v-model="condition.rule"
        :readonly="true"
        :padding="false"
        :level="level"
        :resultMap="condition.resultMap"
        :attrList="attrList"
      ></ConditionGroup>
      <div v-if="mode === 'audit' && condition.hasOwnProperty('result')" class="mt-md">
        <span class="text-grey mr-sm"><b>{{ $t('term.alert.conditionresult') }}</b></span>
        <span v-if="condition.result === true" class="text-success">{{ $t('term.alert.conditionmatch') }}</span>
        <span v-else-if="condition.result === false" class="text-error">{{ $t('term.alert.conditionmotmatch') }}</span>
        <span v-else class="text-grey">{{ condition.result }}</span>
      </div>
      <div v-if="mode === 'audit' && condition.hasOwnProperty('error')" class="mt-md">
        <span class="text-grey mr-sm"><b>{{ $t('page.exception') }}</b></span>
        <span class="text-error">{{ condition.error }}</span>
      </div>
      <div v-if="mode !== 'audit' && selectedHandlerList(condition).length > 0" class="mt-md">
        <div class="text-success mb-md">{{ $t('term.alert.abeyrule') }}</div>
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
            <b class="text-grey">
              <span v-if="!selectedHandler.isActive">
                <Tag color="error">{{ $t('page.ban') }}</Tag>
              </span>
              <span>{{ hindex + 1 }}.{{ selectedHandler.name }}</span>
              <span v-if="selectedHandler.typeLabel">
                <Tag>{{ selectedHandler.typeLabel }}</Tag>
              </span>
              <span v-if="selectedHandler.isAsync">
                <Tag color="warning">{{ $t('term.alert.async') }}</Tag>
              </span>
            </b>
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
            :alertType="alertType"
            :alertData="alertData"
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
