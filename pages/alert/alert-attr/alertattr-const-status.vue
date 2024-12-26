<template>
  <div v-if="hasStatus">
    <Badge :color="statusColor" :status="statusStatus" :text="statusName"></Badge>
  </div>
</template>
<script>
import { AttrViewerBase } from '@/commercial-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  components: {},
  extends: AttrViewerBase,
  props: {},
  data() {
    return {
      statusList: [
        { value: 'new', text: '新告警', color: 'green', status: null },
        { value: 'confirmed', text: '已确认', color: 'lime', status: null },
        { value: 'processing', text: '处理中', color: null, status: 'processing' },
        { value: 'resolved', text: '已处理', color: '#2db7f5', status: null },
        { value: 'closed', text: '已关闭', color: null, status: 'default' }
      ]
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
  methods: {},
  filter: {},
  computed: {
    hasStatus() {
      if (this.mode !== 'audit') {
        return !!this.row.status;
      } else {
        if (this.value && this.value.length > 0) {
          return true;
        }
      }
      return false;
    },
    statusColor() {
      if (this.mode !== 'audit') {
        return this.row.statusColor;
      } else {
        if (this.value && this.value.length > 0) {
          const s = this.statusList.find(d => d.value === this.value[0]);
          if (s) {
            return s.color;
          }
        }
      }
      return null;
    },
    statusStatus() {
      if (this.mode !== 'audit') {
        return this.row.statusStatus;
      } else {
        if (this.value && this.value.length > 0) {
          const s = this.statusList.find(d => d.value === this.value[0]);
          if (s) {
            return s.status;
          }
        }
      }
      return null;
    },
    statusName() {
      if (this.mode !== 'audit') {
        return this.row.statusName;
      } else {
        if (this.value && this.value.length > 0) {
          const s = this.statusList.find(d => d.value === this.value[0]);
          if (s) {
            return s.text;
          }
        }
      }
      return null;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped></style>
