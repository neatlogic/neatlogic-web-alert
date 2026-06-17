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
      markList: []
    };
  },
  beforeCreate() {},
  created() {
    this.getMarkByNameList();
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
    getMarkByNameList() {
      if (this.mode === 'audit' && this.value && this.value.length > 0) {
        this.$api.alert.alertmark.getMarkByNameList(this.value).then(res => {
          this.markList = res.Return;
        });
      }
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
  watch: {}
};
</script>
<style lang="less"></style>
