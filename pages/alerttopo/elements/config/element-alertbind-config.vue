<template>
  <div>
    <TsFormItem label="过滤条件" labelPosition="top">
      <div v-for="(filter, index) in setting.alertbind.filterList" :key="index" class="padding-md radius-md bg-op mb-md">
        <div class="text-grey" style="position: relative">
          属性
          <span style="position: absolute; right: 0px; top: 0px" class="cursor tsfont-trash-o" @click="removeAttr(index)"></span>
        </div>
        <div><TsFormSelect
          v-model="filter.attr"
          :dataList="alertAttrList"
          transfer
          valueName="name"
          textName="label"
          border="border"
        ></TsFormSelect></div>
        <div v-if="filter.attr" class="text-grey">值</div>
        <div v-if="filter.attr">
          <ConditionItem
            v-if="isReady"
            :value="filter.value"
            :conditionItem="getAttrByName(filter.attr)"
            @change="
              val => {
                if (val != null && val != '' && val != undefined) {
                  if (val instanceof Array) {
                    filter.value = val;
                  } else {
                    filter.value = [val];
                  }
                } else {
                  filter.value = [];
                }
              }
            "
          ></ConditionItem>
        </div>
      </div>
      <div><a class="tsfont-plus" @click="addFilter()">条件</a></div>
    </TsFormItem>
    <TsFormItem v-if="setting.alertbind.filterList && setting.alertbind.filterList.length > 0" label="显示信息" labelPosition="top">
      <TsFormRadio
        v-model="setting.alertbind.displayType"
        :dataList="[
          { value: 'detail', text: '告警详情' },
          { value: 'summary', text: '级别统计' }
        ]"
      ></TsFormRadio>
    </TsFormItem>
    <!--<TsFormItem label="显示属性" labelPosition="top">
      <TsFormSelect
        v-model="setting.alertbind.displayAttr"
        :dataList="alertAttrList"
        transfer
        valueName="name"
        textName="label"
        border="border"
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem
      v-if="setting.alertbind.filterList && setting.alertbind.filterList.length > 0"
      :required="true"
      :label="$t('term.diagram.widget')"
      labelPosition="top"
      :buttonList="[
        {
          icon: 'tsfont-plus',
          title: $t('dialog.title.addtarget', { target: '图元' }),
          click: () => {
            addWidget();
          }
        }
      ]"
    >
      <div v-if="widgetList && widgetList.length > 0">
        <TsFormRadio
          v-model="setting.alertbind.widgetId"
          :dataList="widgetList"
          valueName="id"
          textName="label"
        ></TsFormRadio>
      </div>
    </TsFormItem>
    <WidgetEdit v-if="isShowWidgetEdit" :id="currentWidgetId" @close="closeWidgetEdit"></WidgetEdit>-->
  </div>
</template>
<script>
import * as elements from '@/community-module/alert/pages/alerttopo/elements/view/shape/index.js';
export default {
  name: '',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    ConditionItem: () => import('@/resources/components/Condition/condition-item.vue')
    //WidgetEdit: () => import('@/community-module/alert/pages/alerttopo/alerttopo-widget-edit.vue')
  },
  props: {
    setting: { type: Object }
  },
  data() {
    return {
      isReady: false,
      alertAttrList: [],
      currentWidgetId: null,
      isShowWidgetEdit: false,
      widgetList: [],
      elements: elements.default,
      suggestList: [] //dsl搜索模式的提示词列表
    };
  },
  beforeCreate() {},
  async created() {
    await this.getAlertAttrList();
    this.getAllCommonWidget();
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
    removeAttr(index) {
      this.setting.alertbind.filterList.splice(index, 1);
    },
    getAttrByName(name) {
      return this.alertAttrList.find(item => item.name === name);
    },
    async getAlertAttrList() {
      this.isReady = false;
      await this.$api.alert.alert
        .listAlertAttrList({ kind: 'attr' })
        .then(res => {
          this.alertAttrList = res.Return;
        })
        .finally(() => {
          this.isReady = true;
        });
    },
    addFilter() {
      if (!this.setting.alertbind.filterList) {
        this.$set(this.setting.alertbind, 'filterList', []);
      }
      this.setting.alertbind.filterList.push({
        attr: null,
        value: null
      });
      if (!this.setting.alertbind.displayType) {
        this.$set(this.setting.alertbind, 'displayType', 'detail');
      }
    },
    getAllCommonWidget() {
      this.$api.alert.topo.getWidgetListByType('common').then(res => {
        this.widgetList = res.Return.filter(item => {
          const element = this.elements.find(d => d.name === item.shape);
          if (element && element.allowAutoFill) {
            return true;
          }
          return false;
        });
      });
    },
    addWidget() {
      this.currentWidgetId = null;
      this.isShowWidgetEdit = true;
    },
    closeWidgetEdit(needRefresh) {
      this.isShowWidgetEdit = false;
      this.currentWidgetId = null;
      if (needRefresh) {
        this.getAllCommonWidget();
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
