<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <div>{{ $t('dialog.content.opencomfirm',{'target':$t('term.alert.alert')}) }}</div>
        <div class="mt-md"><Checkbox v-model="isCloseChildAlert" :true-value="1" :false-value="0">{{ $t('term.alert.opensubalert') }}</Checkbox></div>
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
        title: this.$t('term.alert.openconfirm'),
        isShow: true,
        maskClose: true,
        width: 'mini'
      },
      isCloseChildAlert: 1
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
  methods: {
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },
    confirm() {
      this.$api.alert.alert.openAlert({ id: this.id, idList: this.idList, isCloseChildAlert: this.isCloseChildAlert }).then(() => {
        this.$Message.success(this.$t('message.executesuccess'));
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
