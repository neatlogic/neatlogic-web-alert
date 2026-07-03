<template>
  <div
    class="padding-md radius-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <ViewBase :mode="mode" :handler="handler" :level="level"></ViewBase>
    <div v-if="handler.config && handler.config.userIdList && handler.config.userIdList.length > 0">
      <Divider orientation="start">{{ $t('term.alert.worker') }}</Divider>
      <div>
        <span v-for="(user, index) in handler.config.userIdList" :key="index" class="mr-xs"><UserCard :uuid="user" :hideAvatar="false"></UserCard></span>
      </div>
    </div>
    <div v-if="teamList && teamList.length > 0">
      <Divider orientation="start">{{ $t('term.alert.workerteam') }}</Divider>
      <div>
        <Tag v-for="(team, index) in teamList" :key="index">{{ team.name }}</Tag>
      </div>
    </div>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    ViewBase: () => import('@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.vue'),
    UserCard: () => import('@/resources/components/UserCard/UserCard.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      teamList: []
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getTeamByIdList();
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    getTeamByIdList() {
      if (this.handler.config && this.handler.config.teamIdList && this.handler.config.teamIdList.length > 0) {
        this.$api.framework.team.getTeamListByUuid({ teamUuidList: this.handler.config.teamIdList }).then(res => {
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
