<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div>
        <div>{{ $t('term.alert.isconfirmclosecurrentalert') }}</div>
        <div class="mt-md"><Checkbox v-model="isCloseChildAlert" :true-value="1" :false-value="0">{{ $t('term.alert.closesubalert') }}</Checkbox></div>
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
        title: this.$t('dialog.title.closecomfirm'),
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
      this.$api.alert.alert.closeAlert({ id: this.id, idList: this.idList, isCloseChildAlert: this.isCloseChildAlert }).then((res) => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('term.alert.closesuccess'));
          this.close(true);
        }
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
