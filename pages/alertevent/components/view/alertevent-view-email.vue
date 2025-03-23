<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem
      style="margin: 0px !important"
      label="标题"
      labelPosition="left"
      :labelWidth="70"
    >
      <span>{{ configLocal.title }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.content"
      style="margin: 0px !important"
      label="内容"
      labelPosition="left"
      :labelWidth="70"
    >
      <span class="text-grey">{{ configLocal.content }}</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.toUserList && configLocal.toUserList.length > 0"
      style="margin: 0px !important"
      label="收件人"
      labelPosition="left"
      :labelWidth="70"
    >
      <div><UserCard
        v-for="(user, index) in configLocal.toUserList"
        :key="index"
        :uuid="user"
        :initType="user.split('#')[0]"
        class="mr-sm"
      ></UserCard></div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.ccUserList && configLocal.ccUserList.length > 0"
      style="margin: 0px !important"
      label="抄送"
      labelPosition="left"
      :labelWidth="70"
    >
      <span><UserCard
        v-for="(user, index) in configLocal.ccUserList"
        :key="index"
        :uuid="user"
        :initType="user.split('#')[0]"
        class="mr-sm"
      ></UserCard></span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.interval"
      style="margin: 0px !important"
      label="通知间隔"
      labelPosition="left"
      :labelWidth="70"
    >
      <span>
        <span class="mr-xs">
          <b>{{ configLocal.interval }}</b>
        </span>
        <span class="text-grey">分钟</span>
      </span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.hasOwnProperty('result')"
      style="margin: 0px !important"
      labelPosition="left"
      :labelWidth="70"
      label="结果"
    >
      <span v-if="configLocal.result === 'succeed'" class="text-success">发送成功</span>
      <span v-else-if="configLocal.result === 'failed'" class="text-error">发送失败</span>
      <span v-else-if="configLocal.result === 'skipped'" class="text-warning">跳过发送</span>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.error"
      style="margin: 0px !important"
      labelPosition="left"
      :labelWidth="70"
      label="异常"
    >  <span class="text-error">{{ configLocal.error }}</span></TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      statusList: [
        {
          value: 'new',
          text: '新告警'
        },
        { value: 'confirmed', text: '已确认' },
        { value: 'proceessing', text: '处理中' },
        { value: 'resolved', text: '已处理' },
        { value: 'closed', text: '已关闭' }
      ]
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
    getStatusName(status) {
      const s = this.statusList.find(d => d.value === status);
      if (s) {
        return s.text;
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less">
.grid {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
}
</style>
