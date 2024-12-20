<template>
  <div>
    <TsFormItem label="收件人" labelPosition="left" :labelWidth="60">
      <UserCard
        v-for="(user,index) in configLocal.toUserList"
        :key="index"
        :uuid="user"
      ></UserCard>
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
    return {
    };
  },
  beforeCreate() {},
  async created() {
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
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less">
</style>
