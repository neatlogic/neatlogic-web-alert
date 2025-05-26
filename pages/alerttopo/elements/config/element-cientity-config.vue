<template>
  <div>
    <div v-if="ciEntityList.length > 0" class="mb-xs">
      <span v-for="(cientity, index) in ciEntityList" :key="index">
        <Tag type="border" :color="cell.getData()['ciEntityId'] === cientity.id ? 'primary' : 'success'">
          <span v-if="cell.getData()['ciEntityId'] === cientity.id">{{ $t('term.cmdb.editcientity') }}</span>
          <span v-else>{{ $t('term.cmdb.newcientity') }}</span>
          <span class="ml-xs text-grey">({{ cientity.ciLabel }})</span>
        </Tag>
      </span>
    </div>
    <Button size="small" type="primary" @click="isEditCiEntityShow = true">{{ $t('dialog.title.edittarget', { target: $t('term.cmdb.cientity') }) }}</Button>
    <Button
      v-if="ciEntityList.length > 0"
      class="ml-xs"
      size="small"
      type="error"
      @click="cancelEditCiEntity()"
    >取消修改</Button>
    <Divider v-if="cell.getData()['ciId'] && cell.getData()['ciEntityId']"></Divider>
    <div v-if="cell.getData()['ciId'] && cell.getData()['ciEntityId']"><a @click="toCiEntityDetail(cell.getData()['ciId'], cell.getData()['ciEntityId'])">{{ $t('term.cmdb.viewcientity') }}</a></div>
    <EditCiEntityDialog
      v-if="isReady && isEditCiEntityShow"
      :ciId="cell.getData()['ciId']"
      :ciEntityId="ciEntityList.length === 0 && cell.getData()['ciEntityId']"
      :ciEntityList="ciEntityList"
      @close="closeEditCiEntity"
    ></EditCiEntityDialog>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    EditCiEntityDialog: () => import('@/commercial-module/diagram/pages/elements/config/cientity-edit-dialog.vue')
  },
  props: {
    cell: { type: Object }
  },
  data() {
    return {
      isEditCiEntityShow: false,
      isReady: true //由于cientity计算变量有缓存，需要用一个变量去刷新数据
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
    toCiEntityDetail(ciId, ciEntityId) {
      window.open(HOME + '/cmdb.html#/ci/' + ciId + '/cientity-view/' + ciEntityId, '_blank');
    },
    cancelEditCiEntity() {
      this.isReady = false;
      const data = this.cell.getData();
      this.$delete(data, 'saveData');
      this.cell.replaceData(data);
      this.$nextTick(() => {
        this.isReady = true;
      });
    },
    closeEditCiEntity(ciEntityList) {
      this.isEditCiEntityShow = false;
      if (ciEntityList) {
        this.cell.setData(
          {
            saveData: {
              ciEntityList: ciEntityList
            }
          },
          {
            deep: false
          }
        );
        this.isReady = false;
        this.$nextTick(() => {
          this.isReady = true;
        });
      }
    }
  },
  filter: {},
  computed: {
    ciEntityList() {
      let cientityList = [];
      if (this.isReady && this.cell.getData()['saveData'] && this.cell.getData()['saveData']['ciEntityList']) {
        cientityList = this.cell.getData()['saveData']['ciEntityList'];
      }
      return cientityList;
    }
  },
  watch: {}
};
</script>
<style lang="less"></style>
