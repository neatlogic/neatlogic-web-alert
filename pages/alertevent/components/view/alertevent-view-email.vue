<template>
  <div>
    <TsFormItem label="邮件标题" labelPosition="left" :labelWidth="70">
      <div>{{ configLocal.title }}</div>
    </TsFormItem>
    <TsFormItem label="收件人" labelPosition="left" :labelWidth="70">
      <div><UserCard
        v-for="(user, index) in configLocal.toUserList"
        :key="index"
        :uuid="user"
        class="mr-sm"
      ></UserCard></div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.ccUserList && configLocal.ccUserList.length > 0"
      label="抄送"
      labelPosition="left"
      :labelWidth="70"
    >
      <div><UserCard
        v-for="(user, index) in configLocal.ccUserList"
        :key="index"
        :uuid="user"
        class="mr-sm"
      ></UserCard></div>
    </TsFormItem>
    <TsFormItem
      v-if="configLocal.interval"
      label="通知间隔"
      labelPosition="left"
      :labelWidth="70"
    >
      <span class="mr-xs text-grey">
        <b>{{ configLocal.interval }}</b>
      </span>
      <span class="text-grey">分钟</span>
    </TsFormItem>
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
    return {};
  },
  beforeCreate() {},
  async created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
