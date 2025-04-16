<template>
  <div v-if="mode === 'list' && row" :style="{ 'margin-left': (row['_index'] || 0) * 31 + 'px' }">
    <div :class="{ 'title-grid': row.childAlertCount }">
      <div
        v-if="row.childAlertCount"
        class="cursor text-href"
        :class="{ 'tsfont-drop-down': row['_expand'], 'tsfont-drop-right': !row['_expand'] }"
        @click="$emit('toggleChildren', row)"
      >
        <span v-if="row.childAlertCount >= 100" class="text-error superscript">99+</span>
        <span v-else class="text-error superscript">
          <b>{{ row.childAlertCount }}</b>
        </span>
      </div>
      <div class="overflow">
        <a :title="row.title" @click="getAlertDetail(row)">{{ row.title }}</a>
      </div>
    </div>
    <AlertView
      v-if="isShowAlert"
      :id="currentAlertId"
      :view="view"
      @close="close"
    ></AlertView>
  </div>
  <div v-else-if="mode === 'detail' && row">{{ row.title }}</div>
</template>
<script>
import { AttrViewerBase } from '@/commercial-module/alert/pages/alert/alert-attr/alertattr-base.js';

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
    close(needRefresh) {
      this.currentAlertId = null;
      this.isShowAlert = false;
      if (needRefresh) {
        this.$emit('refresh');
      }
    },
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
.title-grid {
  display: grid;
  grid-template-columns: 30px auto;
}
.superscript {
  font-size: 0.8em; /* 设置字体大小为原字体的70% */
  vertical-align: super; /* 设置为上标 */
}
</style>
