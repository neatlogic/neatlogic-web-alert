<template>
  <div class="text-grey">
    <div v-if="configLocal.isDeleteChildAlert">
      同时删除父告警和子告警
    </div>
    <div v-else>
      仅删除父告警，保留子告警
    </div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
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
