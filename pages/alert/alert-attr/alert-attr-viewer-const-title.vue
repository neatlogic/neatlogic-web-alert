<template>
  <div v-if="row" :style="{ 'margin-left': (row['_index'] || 0) * 18 + 'px' }">
    <span
      v-if="row.childAlertCount"
      class="cursor text-href"
      :class="{ 'tsfont-drop-down': row['_expand'], 'tsfont-drop-right': !row['_expand'] }"
      @click="$emit('toggleChildren', row)"
    >
      <span v-if="row.childAlertCount >= 100" class="text-error mr-xs superscript">99+</span>
      <span v-else class="text-error mr-xs superscript">{{ row.childAlertCount }}</span>
    </span>
    <span>
      <a @click="getAlertDetail(row)">{{ row.title }}</a>
    </span>
    <AlertView
      v-if="isShowAlert"
      :id="currentAlertId"
      @close="
        currentAlertId = null;
        isShowAlert = false;
      "
    ></AlertView>
  </div>
</template>
<script>
import { AttrViewerBase } from '@/commercial-module/alert/pages/alert/alert-attr/alert-attr-viewer-base.js';

export default {
  name: '',
  components: {
    AlertView: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-dialog.vue')
  },
  extends: AttrViewerBase,
  props: {},
  data() {
    return {
      isShowAlert: false
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
    getAlertDetail(row) {
      this.isShowAlert = true;
      this.currentAlertId = row.id;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.superscript {
  font-size: 0.7em; /* 设置字体大小为原字体的70% */
  vertical-align: super; /* 设置为上标 */
}
</style>
