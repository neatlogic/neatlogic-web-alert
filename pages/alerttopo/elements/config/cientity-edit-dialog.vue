<template>
  <TsDialog v-bind="setting" :isShow="true" @on-close="close">
    <div>
      <Loading
        v-if="isLoading"
        :text="$t('page.datasaving')"
        :loadingShow="isLoading"
        type="fix"
      ></Loading>
      <EditCiEntity
        ref="editContainer"
        mode="dialog"
        :propCiId="ciId"
        :propCiEntityId="ciEntityId"
        :propCiEntityData="ciEntityData"
        :propCiEntityList="ciEntityList"
        saveMode="emit"
        :hideHeader="true"
        @save="save"
        @cancel="close"
      ></EditCiEntity>
    </div>
  </TsDialog>
</template>
<script>
import EditCiEntity from '@/views/pages/cmdb/cientity/cientity-edit.vue';
export default {
  name: '',
  components: {
    EditCiEntity
  },
  filters: {},
  props: {
    ciId: {
      type: Number
    },
    ciEntityId: { type: Number },
    ciEntityList: {
      type: Number
    },
    ciEntityData: {
      type: Object
    }
  },
  data() {
    return {
      isLoading: false,
      setting: {
        title: this.ciEntityId ? this.$t('dialog.title.edittarget', { target: this.$t('page.relation') }) : this.$t('dialog.title.addtarget', { target: this.$t('page.relation') }),
        maskClose: false,
        width: 'large',
        hasFooter: false
      }
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
    close() {
      this.$emit('close');
    },
    save(ciEntityList) {
      this.$emit('close', ciEntityList);
    }
  },
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped></style>
