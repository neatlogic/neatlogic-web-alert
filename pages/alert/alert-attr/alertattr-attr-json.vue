<template>
  <div v-if="jsonValue">
    <div v-if="Array.isArray(jsonValue)">
      <TsTable :theadList="theadList" :tbodyList="jsonValue"></TsTable>
    </div>
    <div v-else-if="typeof jsonValue === 'object' && jsonValue !== null">
      <JsonViewer boxed copyable :value="jsonValue"></JsonViewer>
    </div>
    <div v-else>{{ jsonValue }}</div>
  </div>
  <div v-else class="text-grey">-</div>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  components: {
    TsTable: () => import('@/resources/components/TsTable/TsTable.vue'),
    JsonViewer: () => import('vue-json-viewer')
  },
  extends: AttrViewerBase,
  props: {},
  data() {
    return {
      error: ''
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
  computed: {
    theadList() {
      const theadList = [];
      if (Array.isArray(this.jsonValue) && this.jsonValue.length > 0) {
        for (let key in this.jsonValue[0]) {
          theadList.push({ key: key, title: key });
        }
      }
      return theadList;
    },
    jsonValue() {
      if (this.value) {
        try {
          return JSON.parse(this.value);
        } catch (e) {
          return this.value;
        }
      }
      return null;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
