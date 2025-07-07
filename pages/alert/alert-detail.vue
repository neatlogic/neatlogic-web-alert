<template>
  <TsContain>
    <template v-slot:navigation>
      <span v-if="$hasBack()" class="tsfont-left text-action" @click="$back()">{{ $getFromPage() }}</span>
    </template>
    <template v-slot:topLeft>
      <div v-if="alertData" class="action-group">
        <div class="action-item overflow" style="max-width: 400px">
          <h3 class="text-grey">{{ alertData.title }}</h3>
        </div>
        <div class="action-item">
          <AlertAttrViewer
            v-if="alertData.level"
            type="const"
            :attr="getAttr('const_level')"
            :row="alertData"
            mode="detail"
            :value="alertData['level']"
          ></AlertAttrViewer>
        </div>
      </div>
    </template>
    <template v-slot:topRight>
      <div class="action-group">
        <div v-if="$AuthUtils.hasRole('ALERT_ADMIN')" class="action-item">
          <Button type="warning" @click="rebuildIndex()">{{ $t('page.rebuildindex') }}</Button>
        </div>
        <div v-if="hasRole" class="action-item">
          <Button type="primary" @click="confirm()">{{ $t('page.confirm') }}</Button>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="padding radius-md bg-op">
        <AlertDetailCore
          v-if="id && flag"
          :id="id"
          ref="alertDetailCore"
          @ready="isReady()"
        ></AlertDetailCore>
      </div>
    </template>
  </TsContain>
</template>
<script>
export default {
  name: '',
  components: {
    AlertDetailCore: () => import('@/community-module/alert/pages/alert/alert-detail-core.vue'),
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue')
  },
  props: {},
  data() {
    return {
      id: null,
      hasRole: false,
      alertData: null,
      flag: true
    };
  },
  beforeCreate() {},
  async created() {
    this.id = parseInt(this.$route.params.id);
    this.listAlertAttrList();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    getAttr(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
      return null;
    },
    init() {
      this.flag = false;
      this.$nextTick(() => {
        this.flag = true;
      });
    },
    listAlertAttrList() {
      const param = {};
      this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    async confirm() {
      if (this.$refs.alertDetailCore) {
        let result = await this.$refs.alertDetailCore.confirm();
        if (result) {
          this.init();
        }
      }
    },
    rebuildIndex() {
      this.$api.alert.alert.rebuildIndex(this.id).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('message.executesuccess'));
        }
      });
    },
    isReady() {
      this.hasRole = this.$refs.alertDetailCore && this.$refs.alertDetailCore.hasRole;
      this.alertData = this.$refs.alertDetailCore && this.$refs.alertDetailCore.alertData;
    }
  },
  filter: {},
  computed: {
  },
  watch: {}
};
</script>
<style lang="less" scoped>

</style>
