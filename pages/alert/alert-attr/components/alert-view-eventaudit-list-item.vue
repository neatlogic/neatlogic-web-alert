<template>
  <div>
    <div
      v-for="(audit, aindex) in auditList"
      :key="aindex"
      class="comment-grid radius-md padding-md"
      :style="{ 'margin-left': level * 10 + 'px' }"
      :class="{
        'bg-grey': level % 2 !== 0,
        'bg-op': level % 2 === 0,
        'mt-md': aindex > 0
      }"
    >
      <div>
        <span class="text-href cursor" :class="{ 'tsfont-drop-down': !hideChild[audit.id.toString()], 'tsfont-drop-right': hideChild[audit.id.toString()] }" @click="toggleChild(audit.id)"></span>
        <span class="mr-xs">
          <Badge :type="getBadgeType(audit)" :text="audit.statusName"></Badge>
        </span>
        <span class="text-grey"><b>{{ audit.handlerName }}</b></span>
        <span class="text-grey ml-xs">{{ audit.startTime | formatDate }}</span>
        <span v-if="audit.status !=='running'" class="text-grey">（{{ getTimeCost(audit.timeCost) }}）</span>
      </div>
      <div v-if="audit && !hideChild[audit.id.toString()]" class="mt-md" :style="{ 'padding-left': level * 10 + 'px' }">
        <AlertEventViewer
          :eventHandlerData="audit"
          :level="level"
          mode="audit"
          :alertData="alertData"
        ></AlertEventViewer>
      </div>
      <!-- <div v-if="audit.error && !hideChild[audit.id.toString()]" class="mt-md text-error" :style="{ 'padding-left': level * 10 + 'px' }">
        {{ audit.error }}
      </div> -->
      <div v-if="audit.childAuditList && audit.childAuditList.length > 0 && !hideChild[audit.id.toString()]" class="mt-md">
        <AuditItem :level="level + 1" :auditList="audit.childAuditList" :alertData="alertData"></AuditItem>
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
    auditList: { type: Array },
    alertData: { type: Object }
  },
  data() {
    return {
      hideChild: {}
    };
  },
  beforeCreate() {},
  created() {
    if (this.auditList && this.auditList.length > 0) {
      this.auditList.forEach(audit => {
        this.$set(this.hideChild, audit.id.toString(), true);
      });
    }
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
    getBadgeType(audit) {
      if (audit.status === 'succeed') {
        return 'success';
      } else if (audit.status === 'failed') {
        return 'error';
      } else if (audit.status === 'skipped') {
        return 'warning';
      } else {
        return 'primary';
      }
    },
    toggleChild(id) {
      this.$set(this.hideChild, id.toString(), !this.hideChild[id.toString()]);
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
</style>
