<template>
  <div v-if="isShow" class="mb-md">
    <TsFormItem v-if="mode === 'edit' && breakerPolicyList.length > 0" label="熔断策略" labelPosition="left">
      <div class="breaker-sequence">
        <div
          v-for="(policy, index) in breakerPolicyList"
          :key="policy.policyId || index"
          class="breaker-sequence-item"
          :class="{ 'is-last': index === breakerPolicyList.length - 1 }"
        >
          <div class="breaker-sequence-axis">
            <span class="breaker-sequence-dot text-primary border-primary">{{ index + 1 }}</span>
            <span class="breaker-sequence-line border-color"></span>
          </div>
          <div class="breaker-sequence-content">
            <div class="breaker-sequence-title">
              <Tag>
                {{ policy.policyName || '-' }}
              </Tag>
            </div>
            <div v-if="policy.policyConfig" class="mt-xs">
              <component
                :is="getBreakerViewComponent(policy.policyHandler)"
                v-if="getBreakerViewComponent(policy.policyHandler)"
                :policy="policy"
                mode="edit"
              ></component>
            </div>
          </div>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem v-if="mode === 'audit' && triggeredBreakerAuditList.length > 0" label="熔断结果" labelPosition="left">
      <div class="breaker-sequence">
        <div
          v-for="(audit, index) in triggeredBreakerAuditList"
          :key="audit.id || index"
          class="breaker-sequence-item"
          :class="{ 'is-last': index === triggeredBreakerAuditList.length - 1 }"
        >
          <div class="breaker-sequence-axis">
            <span class="breaker-sequence-dot" :class="getAuditDotClass(audit.status)">
              <i v-if="audit.status === 'failed'" class="tsfont-close"></i>
              <span v-else>{{ index + 1 }}</span>
            </span>
            <span class="breaker-sequence-line border-color" :class="getAuditLineClass(audit.status)"></span>
          </div>
          <div class="breaker-sequence-content">
            <div class="breaker-sequence-title">
              <Tag>
                {{ audit.policyName || '-' }}
              </Tag>
              <span class="ml-xs" :class="getStatusClass(audit.status)">{{ audit.statusText || audit.status || '-' }}</span>
              <span v-if="audit.timeCost || audit.timeCost === 0" class="text-grey ml-xs">{{ audit.timeCost }}ms</span>
            </div>
            <div v-if="audit.policyConfig" class="mt-xs">
              <component
                :is="getBreakerViewComponent(audit.policyHandler)"
                v-if="getBreakerViewComponent(audit.policyHandler)"
                :policy="audit"
                mode="audit"
              ></component>
            </div>
            <div v-if="audit.error" class="text-error mt-xs">{{ audit.error }}</div>
          </div>
        </div>
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import breakerViewComponent from '@/community-module/alert/pages/breaker/components/view/index.js';

export default {
  name: '',
  components: {
    ...breakerViewComponent,
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  props: {
    mode: { type: String, default: 'edit' },
    handler: { type: Object }
  },
  methods: {
    getStatusClass(status) {
      if (status === 'open') {
        return 'text-warning';
      } else if (status === 'failed') {
        return 'text-error';
      }
      return 'text-grey';
    },
    getAuditDotClass(status) {
      if (status === 'open') {
        return 'bg-warning border-warning text-white';
      } else if (status === 'failed') {
        return 'bg-error border-error text-white';
      }
      return 'text-grey border-color';
    },
    getAuditLineClass(status) {
      if (status === 'open') {
        return 'border-color-warning';
      } else if (status === 'failed') {
        return 'border-color-error';
      }
      return '';
    },
    getBreakerViewComponent(handler) {
      return handler ? breakerViewComponent[handler.toLowerCase()] : null;
    }
  },
  computed: {
    breakerPolicyList() {
      return this.handler && this.handler.breakerPolicyList ? this.handler.breakerPolicyList : [];
    },
    breakerAuditList() {
      return this.handler && this.handler.breakerAuditList ? this.handler.breakerAuditList : [];
    },
    triggeredBreakerAuditList() {
      return this.breakerAuditList.filter(audit => audit.status === 'open' || audit.status === 'failed');
    },
    isShow() {
      return (this.mode === 'edit' && this.breakerPolicyList.length > 0) || (this.mode === 'audit' && this.triggeredBreakerAuditList.length > 0);
    }
  }
};
</script>
<style lang="less" scoped>
.breaker-sequence {
  padding-top: 2px;
}
.breaker-sequence-item {
  display: flex;
  min-height: 58px;
  position: relative;

  &.is-last {
    min-height: auto;

    .breaker-sequence-line {
      display: none;
    }
  }
}
.breaker-sequence-axis {
  position: relative;
  flex: 0 0 40px;
  display: flex;
  justify-content: center;
}
.breaker-sequence-dot {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-radius: 50%;
  line-height: 1;
  background-color: var(--block-bg-color, #fff);
}
.breaker-sequence-line {
  position: absolute;
  top: 24px;
  bottom: -2px;
  left: 50%;
  border-left-width: 1px;
  border-left-style: solid;
  transform: translateX(-50%);
}
.breaker-sequence-content {
  flex: 1;
  min-width: 0;
  padding-bottom: 16px;
}
.breaker-sequence-title {
  min-height: 22px;
  line-height: 22px;
  font-weight: bold;
}
</style>
