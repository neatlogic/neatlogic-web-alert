<template>
  <div v-if="mode !== 'audit'">
    <div v-if="visibleRowMarkList && visibleRowMarkList.length > 0">
      <span v-for="(mark, index) in visibleRowMarkList" :key="index" class="mr-xs">
        <Tag v-if="mark.style" :color="mark.style">{{ mark.name }}</Tag>
        <Tag v-else>{{ mark.name }}</Tag>
      </span>
    </div>
    <div v-else class="text-grey">-</div>
  </div>
  <div v-else-if="mode === 'audit' ">
    <div v-if="markList && markList.length > 0">
      <span v-for="(mark, index) in markList" :key="index" class="mr-xs">
        <Tag v-if="mark.style" :color="mark.style">{{ mark.name }}</Tag>
        <Tag v-else>{{ mark.name }}</Tag>
      </span>
    </div>
    <div v-else class="text-grey">-</div>
  </div>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';
export default {
  name: '',
  components: { },
  extends: AttrViewerBase,
  props: {},
  data() {
    return {
      markList: [],
      markRequestId: 0
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
    // 审计保留历史名称；翻页或清空后，旧请求不能覆盖当前记录的标签。
    getMarkByNameList() {
      const requestId = ++this.markRequestId;
      this.markList = [];
      if (this.mode !== 'audit' || !Array.isArray(this.value) || this.value.length === 0) {
        return;
      }
      // 兼容旧版手工修改审计保存的嵌套数组，前后端分开更新时也按标签名称显示。
      const nameList = this.value.flat(Infinity).filter(name => typeof name === 'string');
      if (nameList.length === 0) {
        return;
      }
      this.markList = nameList.map(name => ({ name }));
      return this.$api.alert.alertmark.getMarkByNameList(nameList).then(res => {
        if (requestId !== this.markRequestId) {
          return;
        }
        const markList = res.Return || [];
        // 标签已删除或设为隐藏时仍展示历史名称，只复用当前可找到的颜色等元数据。
        this.markList = nameList.map(name => markList.find(mark => mark.name === name) || { name });
      });
    }
  },
  filter: {},
  computed: {
    visibleRowMarkList() {
      if (!this.row || !this.row.markList) {
        return [];
      }
      return this.row.markList.filter(mark => mark.isShow !== 0);
    }
  },
  watch: {
    value: {
      handler() {
        this.getMarkByNameList();
      },
      immediate: true,
      deep: true
    },
    mode() {
      this.getMarkByNameList();
    }
  }
};
</script>
<style lang="less"></style>
