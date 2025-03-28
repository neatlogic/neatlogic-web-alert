<template>
  <div>
    <Timeline>
      <TimelineItem v-for="(event, index) in finalAuditList" :key="index">
        <div class="time text-grey mb-md">
          <b>{{ getEventName(event.event) }}</b>
        </div>
        <div class="content">
          <AuditItem :auditList="event.auditList" :alertData="alertData"></AuditItem>
        </div>
      </TimelineItem>
    </Timeline>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    AuditItem: () => import('@/commercial-module/alert/pages/alert/alert-attr/components/alert-view-eventaudit-list-item.vue')
  },
  props: {
    alertData: { type: Object }
  },
  data() {
    return {
      auditList: [],
      eventList: []
      //currentPage: 1
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
    searchAlertEventAudit() {
      const param = { alertId: this.alertData.id };
      /*if (currentPage) {
        param.currentPage = currentPage;
      }*/
      this.$api.alert.alert.searchAlertEventAudit(param).then(res => {
        if (res.Return && res.Return.length > 0) {
          this.auditList = res.Return;
          //this.currentPage = currentPage;
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
