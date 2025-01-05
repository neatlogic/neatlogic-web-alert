<template>
  <div v-if="mode !== 'audit' && row.userList && row.userList.length > 0">
    <span v-for="(user, index) in row.userList" :key="index" class="mr-xs">
      <UserCard :uuid="user.userId" :hideAvatar="false"></UserCard>
    </span>
  </div>
  <div v-else-if="mode === 'audit' && value && value.length > 0">
    <span v-for="(user, index) in value" :key="index" class="mr-xs">
      <UserCard :uuid="user" :hideAvatar="false"></UserCard>
    </span>
  </div>
</template>
<script>
import { AttrViewerBase } from '@/commercial-module/alert/pages/alert/alert-attr/alertattr-base.js';
export default {
  name: '',
  components: { UserCard: () => import('@/resources/components/UserCard/UserCard.vue') },
  extends: AttrViewerBase,
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
  methods: {},
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
