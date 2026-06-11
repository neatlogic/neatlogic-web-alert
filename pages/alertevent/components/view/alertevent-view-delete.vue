<template>
  <div
    class="padding-md radius-md cc"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <div v-if="configLocal.isDeleteChildAlert">
      同时删除父告警和子告警
    </div>
    <div v-else>
      仅删除父告警，保留子告警
    </div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
    };
  },
  beforeCreate() {},
  created() {
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
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less">
</style>
