<template>
  <div v-if="mode !== 'audit' && row.source" class="overflow">
    {{ row.source }}
  </div>
  <div v-else-if="mode === 'audit' && value && value.length > 0 && value[0]">
    {{ value[0] }}
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
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
