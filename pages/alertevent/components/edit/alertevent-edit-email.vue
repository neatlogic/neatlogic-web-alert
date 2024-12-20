<template>
  <div>
    <TsFormItem :labelPosition="isChild ? 'top' : 'right'" label="收件人">
      <UserSelect
        v-model="configLocal.toUserList"
        :multiple="true"
        :transfer="true"
        :groupList="['user']"
      ></UserSelect>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  extends: AlertEventBase,
  props: {
    config: { type: Object }
  },
  data() {
    return {
      configLocal: this.config || {}
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
  methods: {},
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
