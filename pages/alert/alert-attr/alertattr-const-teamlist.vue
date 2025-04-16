<template>
  <div v-if="mode !== 'audit'">
    <div v-if="row.teamList && row.teamList.length > 0">
      <span v-for="(team, index) in row.teamList" :key="index" class="mr-xs">
        <Tag>{{ team.teamName }}</Tag>
      </span>
    </div>
    <div v-else class="text-grey">-</div>
  </div>
  <div v-else-if="mode === 'audit'">
    <div v-if="teamList && teamList.length > 0">
      <Tag v-for="(team, index) in teamList" :key="index">
        {{ team.name }}
      </Tag>
    </div>
    <div v-else class="text-grey">-</div>
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
      teamList: []
    };
  },
  beforeCreate() {},
  created() {
    this.getTeamByIdList();
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
    getTeamByIdList() {
      if (this.mode === 'audit' && this.value && this.value.length > 0) {
        this.$api.framework.team.getTeamListByUuid({ teamUuidList: this.value }).then(res => {
          this.teamList = res.Return.teamList;
        });
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
