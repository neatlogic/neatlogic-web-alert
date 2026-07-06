<template>
  <TsDialog v-bind="dialogConfig" @on-close="close()">
    <template v-slot>
      <div class="exportItemContainer">
        <div
          v-for="(item, index) in attrList"
          :key="index"
          class="exportItem overflow padding-xs"
          @click="selectExportItem(item)"
        >
          <i v-if="item.selected" class="tsfont-check-s text-success selected"></i>
          <div>{{ item.label }}</div>
          <div class="text-grey">{{ item.name }}</div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <span class="text-grey mr-lg">{{ $t('term.alert.maxexport1000') }}</span>
      <Checkbox v-if="alertIdList && alertIdList.length > 0" v-model="isOnlyExportSelected">
        <span class="fz10 text-grey">{{ $t('term.cmdb.onlyexportselected') }}</span>
      </Checkbox>
      <Button @click="close()">{{ $t('page.cancel') }}</Button>
      <Button type="primary" ghost @click="selectAllExportItem()">{{ $t('page.selectall') }}</Button>
      <Button
        v-download="exportUrl()"
        :disabled="isExporting || attrList.find(d => d.selected) == null"
        type="primary"
        :loading="isExporting"
      >{{ $t('page.confirm') }}</Button>
    </template>
  </TsDialog>
</template>
<script>
import download from '@/resources/directives/download.js';
export default {
  name: '',
  components: {},
  directives: { download },
  props: {
    searchVal: {type: Object},
    searchParam: { type: Object },
    alertIdList: { type: Array }
  },
  data() {
    return {
      attrList: [],
      isOnlyExportSelected: false,
      dialogConfig: {
        title: this.$t('term.alert.exportsetting'),
        width: 'medium',
        isShow: true,
        maskClose: false
      },
      isExporting: false
    };
  },
  beforeCreate() {},
  created() {
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
    close() {
      this.$emit('close');
    },
    listAlertAttrList() {
      this.$api.alert.alert.listAlertAttrList(this?.searchParam?.viewName ? { viewName: this?.searchParam?.viewName, isColumn: 1 } : { isColumn: 1 }).then(res => {
        this.attrList = res.Return;
      });
    },
    selectAllExportItem() {
      this.attrList.forEach(element => {
        this.$set(element, 'selected', true);
      });
    },
    selectExportItem(item) {
      this.$set(item, 'selected', !item.selected);
    },
    exportUrl() {
      const searchParam = this.$utils.deepClone(this.searchParam);
      if (this.isOnlyExportSelected && this.alertIdList && this.alertIdList.length > 0) {
        searchParam.idList = this.alertIdList;
      }
      const selectedAttrList = [];
      this.attrList.forEach(element => {
        if (element.selected) {
          selectedAttrList.push(element.name);
        }
      });
      searchParam.showAttrList = selectedAttrList;
      //提取固定属性
      const { keyword, level, status, source, updateTimeHour, markNameList } = this.searchVal;
      const param = { keyword, level, status, source, updateTimeHour, markNameList };
      //提取扩展属性
      const attrFilterList = [];
      for (let key in this.searchVal) {
        if (key.startsWith('attr_')) {
          const val = this.searchVal[key];
          if (val !== null && val !== '') {
            let valueList = [];
            if (val instanceof Array) {
              valueList = val;
            } else {
              valueList = [val];
            }
            attrFilterList.push({ name: key.substring(5), valueList: valueList });
          }
        }
      }
      const finalParam = { ...searchParam, attrFilterList: attrFilterList, ...param };
      return {
        url: 'api/binary/alert/export',
        params: finalParam,
        changeStatus: status => {
          if (status == 'start') {
            this.isExporting = true;
          } else if (status == 'success' || status == 'error') {
            this.isExporting = false;
            this.close();
          }
        }
      };
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
@import '~@/resources/assets/css/variable.less';
.exportItemContainer {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  .exportItem {
    cursor: pointer;
    font-size: 12px;
    border-radius: 4px;
    position: relative;
    .selected {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
  .exportItem:hover {
    background: @default-table-hover-color;
  }
}
</style>
