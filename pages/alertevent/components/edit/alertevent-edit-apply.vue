<template>
  <div>
    <TsFormItem :required="true" label="分配给" :labelPosition="isChild ? 'left' : 'right'">
      <UserSelect
        :value="userTeamList"
        :multiple="true"
        :transfer="true"
        :groupList="['user', 'team']"
        @on-change="setUserTeam"
      ></UserSelect>
      <div class="text-grey mt-md">帮助：可以同时分配给多个用户或分组，分配到的用户或分组下的用户均可以对告警进行处理</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/commercial-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    UserSelect: () => import('@/resources/components/UserSelect/UserSelect.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {};
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
  methods: {
    setUserTeam(val) {
      this.configLocal.userIdList = [];
      this.configLocal.teamIdList = [];
      if (val && val.length > 0) {
        val.forEach(d => {
          if (d.startsWith('user#')) {
            this.configLocal.userIdList.push(d.replace('user#', ''));
          } else if (d.startsWith('team#')) {
            this.configLocal.teamIdList.push(d.replace('team#', ''));
          }
        });
      }
    }
  },
  filter: {},
  computed: {
    userTeamList() {
      const list = [];
      if (this.configLocal.userIdList) {
        this.configLocal.userIdList.forEach(u => {
          list.push('user#' + u);
        });
      }
      if (this.configLocal.teamIdList) {
        this.configLocal.teamIdList.forEach(u => {
          list.push('team#' + u);
        });
      }
      return list;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
