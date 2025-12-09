<template>
  <div v-if="mode === 'list' && row" :style="{ 'margin-left': (row['_index'] || 0) * 31 + 'px' }">
    <div :class="{ 'title-grid': row.childAlertCount }">
      <div
        v-if="row.childAlertCount"
        class="cursor text-href"
        :class="{ 'tsfont-drop-down': row['_hasChild'], 'tsfont-drop-right': !row['_hasChild'] }"
        @click="$emit('toggleChildren', row)"
      >
        <span v-if="row.childAlertCount >= 100" class="text-error superscript mr-xs"><b>99+</b></span>
        <span v-else class="text-error superscript mr-xs">
          <b>{{ row.childAlertCount }}</b>
        </span>
      </div>
      <div class="overflow">
        <a :title="row.title" :style="row.isDelete ? 'text-decoration:line-through' : ''" @click="getAlertDetail(row)">
          <span v-for="(mark, index) in row.markList" :key="index">
            <Tag v-if="mark.style" style="font-size: 0.8em; margin: 0px 3px 0px 0px; padding: 0px 6px" :color="mark.style">{{ mark.name }}</Tag>
            <Tag v-else style="font-size: 0.8em">{{ mark.name }}</Tag>
          </span>
          <span>{{ row.title }}</span>
        </a>
      </div>
    </div>
    <AlertView
      v-if="isShowAlert"
      :id="currentAlertId"
      :view="view"
      @close="close"
    ></AlertView>
  </div>
  <div v-else-if="mode === 'detail' && row">
    <span v-for="(mark, index) in row.markList" :key="index">
      <Tag v-if="mark.style" style="font-size: 0.8em; margin: 0px 3px 0px 0px; padding: 0px 6px" :color="mark.style">{{ mark.name }}</Tag>
      <Tag v-else style="font-size: 0.8em">{{ mark.name }}</Tag>
    </span>
    <span>{{ row.title }}</span>
  </div>
  <div v-else-if="mode === 'audit' && value && value.length > 0">{{ value[0] }}</div>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  components: {
    AlertView: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-dialog.vue')
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
  computed: {
    shortText() {
      if (this.row.title.length > 300) {
        return this.row.title.substring(0, 300) + '...';
      }
      return this.row.title;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.title-grid {
  display: grid;
  grid-template-columns: auto 99%;
}
.superscript {
  font-size: 0.8em; /* 设置字体大小为原字体的70% */
  vertical-align: super; /* 设置为上标 */
}
</style>
