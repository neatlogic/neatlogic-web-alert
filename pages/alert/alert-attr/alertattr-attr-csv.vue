<template>
  <div v-if="hasValue">
    <span class="tsfont-mm-xls text-href" @click="downloadCsv">data.csv</span>
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
  methods: {
    downloadCsv() {
      const blob = new Blob(['\ufeff' + this.csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.csv';
      link.click();
      URL.revokeObjectURL(url);
    }
  },
  filter: {},
  computed: {
    hasValue() {
      return this.value !== null && this.value !== undefined && this.value !== '';
    },
    csvContent() {
      if (typeof this.value === 'string') {
        return this.value;
      }
      return JSON.stringify(this.value);
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
