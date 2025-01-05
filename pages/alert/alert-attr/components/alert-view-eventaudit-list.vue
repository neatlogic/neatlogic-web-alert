<template>
  <div>
    <Timeline>
      <TimelineItem v-for="(event, index) in finalAuditList" :key="index">
        <div class="time text-grey mb-md">
          <b>{{ getEventName(event.event) }}</b>
        </div>
        <div class="content">
          <div v-for="(audit, aindex) in event.auditList" :key="aindex" class="comment-grid mb-md">
            <TsRow>
              <Col span="1" class="item">
                <b class="text-grey">{{ aindex + 1 }}</b>
              </Col>
              <Col span="6" class="item">
                <div class="item-title text-grey">时间</div>
                <div class="item-content">{{ audit.startTime | formatDate }}</div>
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
              <Col span="6" class="item">
                <div class="item-title text-grey">耗时</div>
                <div class="item-content">{{ getTimeCost(audit.timeCost) }}</div>
              </Col>
            </TsRow>
          </div>
        </div>
      </TimelineItem>
    </Timeline>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    alertData: { type: Object }
  },
  data() {
    return {
      auditList: [],
      eventList: [],
      currentPage: 1
    };
  },
  beforeCreate() {},
  created() {
    this.getAllEventList();
    this.searchAlertEventAudit();
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
      if (ms > 0 || parts.length === 0) parts.push(`${ms}毫秒`); // 始终显示毫秒

      return parts.join(' ');
    },
    getEventName(event) {
      const ev = this.eventList.find(d => d.name === event);
      if (ev) {
        return ev.label;
      }
      return event;
    },
    getAllEventList() {
      this.$api.alert.alertevent.listAlertEvent().then(res => {
        this.eventList = res.Return;
      });
    },
    searchAlertEventAudit(currentPage) {
      const param = { alertId: this.alertData.id };
      if (currentPage) {
        param.currentPage = currentPage;
      }
      this.$api.alert.alert.searchAlertEventAudit(param).then(res => {
        if (res.Return && res.Return.length > 0) {
          this.auditList.push(...res.Return);
          this.currentPage = currentPage;
        }
      });
    }
  },
  filter: {},
  computed: {
    finalAuditList() {
      const eventList = [];
      if (this.auditList && this.auditList.length > 0) {
        for (let i = 0; i < this.auditList.length; i++) {
          const audit = this.auditList[i];
          let lastEvent = null;
          if (eventList.length === 0) {
            eventList.push({ event: audit.event, auditList: [] });
          }
          if (eventList[eventList.length - 1].event !== audit.event) {
            eventList.push({ event: audit.event, auditList: [] });
          }
          lastEvent = eventList[eventList.length - 1];
          lastEvent.auditList.push(audit);
        }
      }
      return eventList;
    }
  },
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
