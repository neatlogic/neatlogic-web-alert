<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler"></ViewBase>
    <TsFormItem :label="$t('page.tag')" labelPosition="left">
      <div>
        <Tag v-for="(mark,index) in markList" :key="index">
          {{ mark }}
        </Tag>
      </div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem')
  },
  extends: AlertEventBase,
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
  },
  filter: {},
  computed: {
    markList() {
      const markList = new Set();
      if (this.configLocal.markList && this.configLocal.markList.length > 0) {
        this.configLocal.markList.forEach(item => {
          if (typeof item === 'object') {
            markList.add(item.name);
          } else {
            markList.add(item);
          }
        });
      }
      return markList;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
