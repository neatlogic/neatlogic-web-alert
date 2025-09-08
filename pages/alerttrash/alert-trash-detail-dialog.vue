<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div v-if="alertData">
        <div class="attr-main">
          <div
            v-for="(attr, index) in finalAttrList"
            :key="index"
            class="attr-item"
            :class="{ 'attr-item-row': attr.wholeRow }"
          >
            <div class="attr-title text-grey">{{ attr.label }}</div>
            <div class="attr-content">
              <span v-if="attr.kind === 'const'">
                <AlertAttrViewer
                  type="const"
                  :attr="attr"
                  :row="alertData"
                  mode="detail"
                  :value="alertData[attr.name.replace('const_', '')]"
                ></AlertAttrViewer>
              </span>
              <span v-else-if="attr.kind === 'attr' && alertData.attrObj">
                <AlertAttrViewer
                  v-if="alertData.attrObj.hasOwnProperty(attr.name.replace('attr_', ''))"
                  type="attr"
                  mode="detail"
                  :row="alertData"
                  :attr="attr"
                  :value="alertData.attrObj[attr.name.replace('attr_', '')]"
                ></AlertAttrViewer>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="warning" @click="rebuildIndex()">{{ $t('page.rebuildindex') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
export default {
  name: '',
  components: {
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      loading: true,
      currentTab: 'info',
      alertData: null,
      statusList: [],
      attrList: [],
      selectedStatus: null,
      comment: null,
      isCloseChildAlert: 1,
      isChangeChildAlertStatus: 1,
      commentData: null,
      applyType: [
        { value: 'append', text: this.$t('page.append') },
        { value: 'replace', text: this.$t('page.replace') }
      ],
      applyUserList: [],
      applyTeamList: [],
      applyUserType: 'replace',
      applyTeamType: 'replace',
      dialogConfig: {
        title: this.$t('term.alert.alertdetail'),
        type: 'slider',
        maskClose: true,
        isShow: true,
        width: 'large'
      }
    };
  },
  beforeCreate() {},
  async created() {
    this.listAllStatus();
    this.listAlertAttrList();
    await this.getAlertById();
    this.$emit('ready');
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
    rebuildIndex() {
      this.$api.alert.alerttrash.rebuildIndex(this.id).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('message.executesuccess'));
        }
      });
    },
    getChildAlertTabLabel() {
      return h => {
        const returnList = [h('span', { class: 'mr-xs' }, this.$t('term.alert.childalert'))];
        let eventCount = 0;
        if (this.alertData && this.alertData.childAlertCount) {
          returnList.push(
            h('Badge', {
              props: {
                type: 'info',
                count: this.alertData.childAlertCount
              }
            })
          );
        }
        return h('div', returnList);
      };
    },
    listAllStatus() {
      this.$api.alert.status.listAlertStatus().then(res => {
        this.statusList = res.Return;
      });
    },
    getAttr(name) {
      if (this.attrList) {
        return this.attrList.find(d => d.name === name);
      }
      return null;
    },
    init() {
      this.getAlertById();
      this.comment = null;
      this.applyUserList = [];
      this.applyTeamList = [];
      this.applyUserType = 'append';
      this.applyTeamType = 'append';
    },
    changeStatus(status) {
      this.selectedStatus = this.selectedStatus === status.name ? null : status.name;
    },
    listAlertAttrList() {
      const param = {};
      this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    },

    async getAlertById() {
      if (this.id) {
        await this.$api.alert.alerttrash
          .getAlertTrashById(this.id)
          .then(res => {
            this.alertData = res.Return;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    /*async getAlertTypeById(id) {
      if (id) {
        await this.$api.alert.alerttype.getAlertTypeById(id).then(res => {
          this.alertTypeData = res.Return;
        });
      }
    },*/
    async confirm() {
      const alertData = this.$utils.deepClone(this.alertData);
      if (this.selectedStatus) {
        alertData.status = this.selectedStatus;
      }
      if (this.comment) {
        alertData.comment = this.comment;
      }
      if (this.applyUserList && this.applyUserList.length > 0) {
        alertData.applyUserList = this.applyUserList.map(d => d.replace('user#', ''));
        alertData.applyUserType = this.applyUserType;
      }
      if (this.applyTeamList && this.applyTeamList.length > 0) {
        alertData.applyTeamList = this.applyTeamList.map(d => d.replace('team#', ''));
        alertData.applyTeamType = this.applyTeamType;
      }
      alertData.isChangeChildAlertStatus = this.isChangeChildAlertStatus;
      alertData.isCloseChildAlert = this.isCloseChildAlert;
      let result = false;
      await this.$api.alert.alert.handleAlert(alertData).then(res => {
        if (res.Status === 'OK') {
          this.$Message.success(this.$t('message.executesuccess'));
          result = true;
        }
      });
      return result;
    }
  },
  filter: {},
  computed: {
    finalStatusList() {
      return this.statusList.filter(d => d.name !== this.alertData.status);
    },
    hasRole() {
      if (this.alertData) {
        if (this.$AuthUtils.hasRole('ALERT_ADMIN')) {
          return true;
        }
        const userInfo = this.$AuthUtils.getCurrentUser();
        if (this.alertData.userList) {
          if (this.alertData.userList.find(d => d.userId === userInfo.uuid)) {
            return true;
          }
        }
        if (this.alertData.teamList && userInfo.teamUuidList) {
          for (let i = 0; i < this.alertData.teamList.length; i++) {
            const team = this.alertData.teamList[i];
            if (userInfo.teamUuidList.find(d => d === 'team#' + team.teamUuid)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    finalAttrList() {
      const attrList = [];
      if (this.attrList && this.attrList.length > 0 /*&& this.alertTypeData*/) {
        this.attrList.forEach(d => {
          if (d.kind === 'const') {
            attrList.push(d);
          } else if (this.alertData && this.alertData.attrObj && this.alertData.attrObj.hasOwnProperty(d.name.replace('attr_', ''))) {
            //没有值的扩展属性不显示
            attrList.push(d);
          }
        });
      }
      return attrList;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.audit-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid: 10px;
}
.attr-main {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
  .attr-item-row {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .attr-item {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 120px auto;
    .attr-title {
      text-align: left;
      padding: 3px;
    }
    .attr-content {
      padding: 3px;
    }
    .attr-content .content {
      word-break: break-all;
    }
  }
}
.comment-grid {
  display: grid;
  grid-template-columns: 80px auto;
}
.comment-content {
  overflow: hidden;
  width: 625px;
}
::v-deep(.comment-content img) {
  max-width: 100%;
  height: auto;
}
</style>
