<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <div>是否确认关闭当前告警？</div>
        <div class="mt-md"><Checkbox v-model="isCloseChildAlert" :true-value="1" :false-value="0">同时关闭子告警</Checkbox></div>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="error" @click="confirm()">{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    id: { type: Number }
  },
  data() {
    return {
      dialogConfig: {
        title: '删除确认',
        isShow: true,
        maskClose: true,
        width: 'mini'
      },
      isCloseChildAlert: 0
    };
  },
  beforeCreate() {},
  async created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    confirm() {
      this.$api.alert.alert.closeAlert({ id: this.id, isCloseChildAlert: this.isCloseChildAlert }).then(() => {
        this.$Message.success(this.$t('term.alert.closesuccess'));
        this.close(true);
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
