<template>
  <div v-if="value != null && value !== ''">
    <template v-if="timestamp">{{ timestamp | formatDate }}</template>
    <template v-else>{{ value }}</template>
  </div>
  <div v-else class="text-grey">-</div>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  components: {},
  extends: AttrViewerBase,
  props: {},
  data() {
    return {};
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
  computed: {
    // 毫秒时间戳沿用告警时间的展示格式，已有日期文本原样展示。
    timestamp() {
      if (typeof this.value === 'number' || (typeof this.value === 'string' && /^-?\d+$/.test(this.value))) {
        const date = new Date(Number(this.value));
        if (!Number.isNaN(date.getTime())) return date;
      }
      return null;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
