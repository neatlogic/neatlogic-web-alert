<template>
  <div class="mb-lg">
    <TsFormItem :label="$t('page.type')" labelPosition="left">
      <TsFormSelect
        v-model="handler.typeId"
        dynamicUrl="/api/rest/alert/event/handler/type/search"
        transfer
        valueName="id"
        textName="label"
        border="border"
        @on-change="changeType"
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem :label="$t('term.alert.async')" labelPosition="left">
      <TsFormRadio
        v-model="handler.isAsync"
        :dataList="[
          { value: 1, text: '异步动作' },
          { value: 0, text: '同步动作' }
        ]"
      ></TsFormRadio>
    </TsFormItem>
    <TsFormItem :label="$t('term.report.isactive')" labelPosition="left">
      <TsFormSwitch v-model="handler.isActive" :trueValue="1" :falseValue="0"></TsFormSwitch>
    </TsFormItem>
    <TsFormItem label="熔断策略" labelPosition="left">
      <TsFormSelect
        v-model="breakerPolicyIdList"
        dynamicUrl="/api/rest/alert/breaker/policy/search"
        :params="{ isActive: 1 }"
        rootName="tbodyList"
        valueName="id"
        textName="name"
        transfer
        multiple
        border="border"
        @on-change="changeBreakerPolicy"
      ></TsFormSelect>
      <div v-if="handler.breakerPolicyList && handler.breakerPolicyList.length > 0" class="mt-sm">
        <draggable
          v-model="handler.breakerPolicyList"
          handle=".tsfont-bar"
          tag="div"
        >
          <div
            v-for="policy in handler.breakerPolicyList"
            :key="policy.policyId"
            class="breaker-policy-item bg-op radius-sm padding-sm mb-xs"
          >
            <span class="tsfont-bar move text-grey"></span>
            <span class="ml-xs">{{ policy.policyName }}</span>
          </div>
        </draggable>
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
export default {
  name: '',
  components: {
    draggable,
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch')
  },
  props: {
    handler: { type: Object }
  },
  data() {
    return {
      breakerPolicyIdList: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    changeType(val, option, item) {
      //保存类型名称到子插件的配置中，避免反查
      if (option) {
        this.$set(this.handler, 'typeLabel', option.text);
      } else {
        this.$delete(this.handler, 'typeLabel');
      }
    },
    changeBreakerPolicy(policyIdList, valueObject, selectItemList) {
      const oldPolicyList = this.handler.breakerPolicyList || [];
      const newPolicyList = [];
      (policyIdList || []).forEach(policyId => {
        const oldPolicy = oldPolicyList.find(d => d.policyId === policyId);
        if (oldPolicy) {
          newPolicyList.push(oldPolicy);
        } else {
          const policy = (selectItemList || []).find(d => d.id === policyId);
          if (policy) {
            newPolicyList.push({
              policyId: policy.id,
              policyName: policy.name
            });
          }
        }
      });
      this.$set(this.handler, 'breakerPolicyList', newPolicyList);
    }
  },
  filter: {},
  computed: {},
  watch: {
    'handler.breakerPolicyList': {
      handler(list) {
        this.breakerPolicyIdList = (list || []).map(d => d.policyId);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.breaker-policy-item {
  display: flex;
  align-items: center;
}
</style>
