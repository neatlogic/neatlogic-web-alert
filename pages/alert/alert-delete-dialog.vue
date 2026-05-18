<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div v-if="mode === 'select'">
        <div>{{ $t('dialog.content.deleteconfirm', { target: $t('term.alert.alert') }) }}</div>
        <div class="mt-md"><Checkbox v-model="isDeleteChildAlert" :true-value="1" :false-value="0">{{ $t('term.alert.deletesubalert') }}</Checkbox></div>
      </div>
      <div v-else-if="mode === 'match'">
        <div>当前高级搜索条件匹配到 <span class="text-danger">{{ matchCount }}</span> 条告警，确认后将提交后台删除。</div>
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
    mode: { type: String, default: 'select' },
    id: { type: Number },
    idList: { type: Array },
    searchParam: { type: Object }, //搜索参数
    matchCount: { type: Number, default: 0 }
  },
  data() {
    return {
      dialogConfig: {
        title: this.$t('dialog.title.deleteconfirm'),
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
      const param = {};
      if (this.mode === 'select') {
        param.id = this.id;
        param.idList = this.idList;
        param.isDeleteChildAlert = this.isDeleteChildAlert;
      } else if (this.mode === 'match') {
        param.searchParam = this.searchParam;
      }
      this.$api.alert.alert
        .deleteAlert(param)
        .then(() => {
          if (this.mode === 'select') {
            this.$Message.success(this.$t('message.deletesuccess'));
          } else if (this.mode === 'match') {
            this.$Message.success('已提交后台删除');
          }
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
