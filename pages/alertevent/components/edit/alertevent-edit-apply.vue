<template>
  <div
    class="radius-md cc"
    :class="{
      'padding-md': isChild,
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <EditBase :handler="handler"></EditBase>
    <TsFormItem :required="true" :label="$t('term.alert.assignto')" labelPosition="left">
      <UserSelect
        ref="userSelect"
        :value="userTeamList"
        :multiple="true"
        :transfer="true"
        :groupList="['user', 'team']"
        :validateList="[{ name: 'required', message: ' ' }]"
        @on-change="setUserTeam"
      ></UserSelect>
      <div class="text-grey mt-md">{{ $t('term.alert.assignhelp') }}</div>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.js';

export default {
  name: '',
  components: {
    EditBase: () => import('@/community-module/alert/pages/alertevent/components/edit/alertevent-edit-base.vue'),
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
    async valid() {
      const isValid = this.$refs.userSelect.valid();
      return isValid;
    },
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
