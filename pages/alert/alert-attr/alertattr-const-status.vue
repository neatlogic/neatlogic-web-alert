<template>
  <div v-if="hasStatus">
    <Badge
      v-if="statusName"
      class="status-badge"
      style="white-space: nowrap"
      :color="statusColor"
      :text="statusName"
    ></Badge>
  </div>
  <div v-else class="text-grey">-</div>
</template>
<script>
import { AttrViewerBase } from '@/community-module/alert/pages/alert/alert-attr/alertattr-base.js';

export default {
  name: '',
  components: {},
  extends: AttrViewerBase,
  props: {},
  data() {
    return {
      statusList: []
    };
  },
  beforeCreate() {},
  created() {
    if (this.mode === 'audit') {
      this.listAllStatus();
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
    listAllStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    }
  },
  filter: {},
  computed: {
    hasStatus() {
      if (this.mode !== 'audit') {
        return !!this.row.status;
      } else {
        if (this.value && this.value.length > 0 && this.value[0]) {
          return true;
        }
      }
      return false;
    },
    statusColor() {
      if (this.mode !== 'audit') {
        return this.row.statusColor;
      } else {
        if (this.value && this.value.length > 0 && this.value[0]) {
          const s = this.statusList.find(d => d.name === this.value[0]);
          if (s) {
            return s.color;
          }
        }
      }
      return null;
    },

    statusName() {
      if (this.mode !== 'audit') {
        return this.row.statusName;
      } else {
        if (this.value && this.value.length > 0 && this.value[0]) {
          const s = this.statusList.find(d => d.name === this.value[0]);
          if (s) {
            return s.label;
          }
        }
      }
      return null;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
@import (reference) '~@/resources/assets/css/variable.less';

.theme-dark {
  .status-badge {
    ::v-deep .ivu-badge-status-text {
      color: @dark-text;
    }
  }
}
</style>
