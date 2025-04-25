<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <div>{{ $t('dialog.content.deleteconfirm', { target: $t('term.alert.alert') }) }}</div>
        <div class="mt-md"><Checkbox v-model="isDeleteChildAlert" :true-value="1" :false-value="0">同时删除子告警</Checkbox></div>
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
    id: { type: Number },
    idList: { type: Array }
  },
  data() {
    return {
      dialogConfig: {
        title: '删除确认',
        isShow: true,
        maskClose: true,
        width: 'mini'
      },
      isDeleteChildAlert: 0
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
      this.$api.alert.alert.deleteAlert({ id: this.id, idList: this.idList, isDeleteChildAlert: this.isDeleteChildAlert }).then(() => {
        this.$Message.success(this.$t('message.deletesuccess'));
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
