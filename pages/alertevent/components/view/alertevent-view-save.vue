<template>
  <div>
    <div class="text-grey">帮助：唯一属性值相同的告警将会收敛成一条告警</div>
    <Divider v-if="configLocal.uniqueAttrList && configLocal.uniqueAttrList.length > 0" orientation="left">已选属性</Divider>
    <Tag v-for="(attr, index) in configLocal.uniqueAttrList" :key="index">{{ attr.label }}</Tag>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
    };
  },
  beforeCreate() {},
  created() {
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
