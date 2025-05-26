<template>
  <div v-if="isReady && customDataList && customDataList.length > 0">
    <TsFormItem
      v-for="d in customDataList"
      :key="d.name"
      labelPosition="top"
      :label="d.label"
      :buttonList="[
        {
          title: '清空选择',
          icon: 'tsfont-refresh',
          click: () => {
            setData(d.name, null);
          }
        }
      ]"
    >
      <TsFormHandler
        v-if="d.handler !== 'matrix'"
        :type="d.handler"
        :value="getDataByName(d.name)"
        :config="{ dataList: convertDataList(d.dataList) }"
        @on-change="
          (val, opt) => {
            if (opt) {
              setData(d.name, opt);
            } else if (val) {
              setData(d.name, { value: val, text: val });
            } else {
              setData(d.name, null);
            }
          }
        "
      ></TsFormHandler>
      <TsFormSelect
        v-else
        :multiple="d.config.isMultiple"
        :value="getDataByName(d.name)"
        dynamicUrl="/api/rest/matrix/column/data/search/forselect"
        rootName="dataList"
        :params="{ matrixUuid: d.config.matrixUuid, valueField: d.config.valueField, textField: d.config.textField }"
        transfer
        border="border"
        @on-change="
          (val, opt) => {
            if (opt) {
              setData(d.name, opt);
            } else {
              setData(d.name, null);
            }
          }
        "
      ></TsFormSelect>
    </TsFormItem>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormHandler: () => import('@/resources/plugins/TsForm/TsFormHandler.vue'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect')
  },
  props: {
    settings: { type: Array },
    mode: { type: String },
    cell: { type: Object },
    customData: { type: Array }
  },
  data() {
    return {
      isReady: true,
      data: {}
    };
  },
  beforeCreate() {},
  created() {
    if (this.customData) {
      this.data = this.$utils.deepClone(this.customData);
    }
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
    convertDataList(dataList) {
      const newList = [];
      if (dataList && dataList.length > 0) {
        dataList.forEach(d => {
          if (d && d.trim()) {
            newList.push({ value: d, text: d });
          }
        });
      }
      return newList;
    },
    setData(name, value) {
      const data = this.data.find(d => d.name === name);
      const dataIndex = this.data.findIndex(d => d.name === name);
      const item = this.settings.find(d => d.name === name);
      const { dataList = [] } = item || {};
      let valueIndex = -1;
      this.data && this.data.length > 0 && this.data.some((d, index) => {
        if (d && d.value && d.value.length > 0) {
          return d.value.some((subItem) => {
            if (subItem && !this.$utils.isEmpty(subItem.value) && dataList.includes(subItem.value)) {
              valueIndex = index;
              return true;
            }
            return false;
          });
        }
        return false;
      });
      const valueList = [];
      if (value) {
        if (value instanceof Array) {
          valueList.push(...value);
        } else if (!this.$utils.isEmpty(value)) {
          valueList.push(value);
        }
      }
      if (item) {
        if (valueList.length > 0) {
          if (data) {
            data.value = valueList;
            data.label = item.label;
          } else {
            if (valueIndex > -1) {
              this.$delete(this.data, valueIndex);
            }
            this.data.push({ name: name, label: item.label, value: valueList });
          }
        } else {
          if (dataIndex > -1) {
            this.$delete(this.data, dataIndex);
          } else if (valueIndex > -1) {
            // 清空旧数据，name名称不同，但是value还是有值的问题
            this.$delete(this.data, valueIndex);
          }
        }
        this.$emit('data:update', this.data);
      }
    },
    getDataByName(name) {
      const data = this.data.find(d => d.name === name);
      if (data && data.value && data.value.length > 0) {
        return data.value.map(d => d.value);
      }
      return null;
    }
  },
  filter: {},
  computed: {
    customDataList() {
      const dataList = [];
      if (this.settings && this.settings.length > 0) {
        this.settings.forEach(d => {
          if (d.name && d.name.trim() && d.label && d.label.trim() && d.handler) {
            dataList.push(d);
          }
        });
      }
      return dataList;
    }
  },
  watch: {
    customData: {
      handler(val) {
        if (val) {
          this.data = this.$utils.deepClone(val);
          this.isReady = false;
          this.$nextTick(() => {
            this.isReady = true;
          });
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less"></style>
