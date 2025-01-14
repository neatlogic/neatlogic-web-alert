<template>
  <div>
    <div
      v-for="(audit, aindex) in auditList"
      :key="aindex"
      class="comment-grid"
      :class="{ 'mt-md': aindex > 0 }"
    >
      <TsRow>
        <Col span="8" :style="{ 'padding-left': level * 10 + 'px' }">
          <span
            v-if="audit.childAuditList && audit.childAuditList.length > 0"
            class="text-grey cursor"
            :class="{ 'tsfont-drop-down': !hideChild[audit.id], 'tsfont-drop-right': hideChild[audit.id] }"
            @click="toggleChild(audit.id.toString())"
          ></span>
          <span v-else class="text-grey tsfont-dot"></span>
          <span class="text-grey">{{ audit.startTime | formatDate }}</span>
        </Col>
        <Col span="6" class="item">
          <div class="item-title text-grey">插件</div>
          <div class="item-content">{{ audit.handlerName }}</div>
        </Col>
        <Col span="5" class="item">
          <div class="item-title text-grey">状态</div>
          <div class="item-content">
            <span
              :class="{
                'text-success': audit.status === 'succeed',
                'text-error': audit.status === 'failed',
                'text-primary': audit.status === 'running'
              }"
            >
              {{ audit.statusName }}
            </span>
          </div>
        </Col>
        <Col span="5" class="item">
          <div class="item-title text-grey">耗时</div>
          <div class="item-content">{{ getTimeCost(audit.timeCost) }}</div>
        </Col>
      </TsRow>
      <div v-if="audit.result && !hideChild[audit.id.toString()]" class="mt-md" :style="{ 'padding-left': level * 10 + 'px' }">
        <AlertEventViewer :eventHandlerData="audit" :level="level" mode="audit"></AlertEventViewer>
      </div>
      <div v-if="audit.childAuditList && audit.childAuditList.length > 0 && !hideChild[audit.id.toString()]" class="mt-md">
        <AuditItem :level="level + 1" :auditList="audit.childAuditList"></AuditItem>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    AuditItem: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-eventaudit-list-item.vue'),
    AlertEventViewer: () => import('@/commercial-module/alert/pages/alertevent/components/view/alertevent-viewer.vue')
  },
  props: {
    level: { type: Number, default: 0 },
    auditList: { type: Array }
  },
  data() {
    return {
      hideChild: {}
    };
  },
  beforeCreate() {},
  async created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    toggleChild(id) {
      this.$set(this.hideChild, id, !this.hideChild[id]);
    },
    getTimeCost(ms) {
      const hours = Math.floor(ms / (1000 * 60 * 60));
      ms %= 1000 * 60 * 60;

      const minutes = Math.floor(ms / (1000 * 60));
      ms %= 1000 * 60;

      const seconds = Math.floor(ms / 1000);
      ms %= 1000;

      const parts = [];
      if (hours > 0) parts.push(`${hours}小时`);
      if (minutes > 0) parts.push(`${minutes}分`);
      if (seconds > 0) parts.push(`${seconds}秒`);
      if (parts.length === 0) parts.push(`${ms}毫秒`); // 始终显示毫秒

      return parts.join(' ');
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.item {
  display: grid;
  grid-template-columns: 50px auto;
}
.item-title {
}
.item-content {
}
</style>
