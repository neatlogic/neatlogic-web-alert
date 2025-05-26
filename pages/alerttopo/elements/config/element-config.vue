<template>
  <div>
    <Tabs v-if="['template', 'graph'].includes(mode)" :animated="false">
      <TabPane :label="$t('page.component')">
        <component
          :is="element.name"
          v-if="element && elementConfig[element.name]"
          :form="element.form"
          :formData="element.data"
          :formAttr="element.attr"
          :mode="mode"
          :cell="cell"
          @data:update="updateData"
        ></component>
        <TsForm
          v-else
          v-model="data"
          labelPosition="top"
          :item-list="element.form"
        ></TsForm>
        <div v-if="element.config && element.config.allowCustomData">
          <Divider orientation="left">
            <span class="text-grey fz10">
              <span>{{ $t('page.customdata') }}</span>
              <span class="tsfont-refresh cursor" title="清空不存的属性" @click="removeNotExistsCustomData()"></span>
            </span>
          </Divider>
          <CustomDataEdit
            :mode="mode"
            :cell="cell"
            :customData="element.data.customData || []"
            :settings="element.config.customDataSetting"
            @data:update="updateCustomData"
          ></CustomDataEdit>
        </div>
        <div v-else-if="element.data.customData && element.data.customData.length > 0">
          <Divider orientation="left">
            <span class="text-grey fz10">{{ $t('page.customdata') }}</span>
          </Divider>
          <a @click="clearCustomData()">{{ $t('page.cleardata') }}</a>
        </div>
      </TabPane>
      <TabPane v-if="['template', 'graph'].includes(mode) && setting.autofill" :label="$t('term.diagram.autofill')">
        <ElementAutofillSetting :setting="setting"></ElementAutofillSetting>
      </TabPane>
      <TabPane v-if="['template', 'graph'].includes(mode) && setting.alertbind" label="告警绑定">
        <ElementAlertBindSetting :setting="setting"></ElementAlertBindSetting>
      </TabPane>
      <!--
      无需开放交互配置功能
      <TabPane v-if="mode === 'template' || isShowInteractTabPane" :label="$t('page.eachother')">
        <TsForm v-model="setting" :item-list="settingForm" labelPosition="top"></TsForm>
      </TabPane>
      -->
    </Tabs>
    <div v-else>
      <component
        :is="element.name"
        v-if="element && elementConfig[element.name]"
        :form="element.form"
        :formData="element.data"
        :formAttr="element.attr"
        :mode="mode"
        :cell="cell"
        @data:update="updateData"
      ></component>
      <TsForm
        v-else
        v-model="data"
        labelPosition="top"
        :item-list="element.form"
      ></TsForm>
    </div>
  </div>
</template>
<script>
import components from '@/commercial-module/diagram/pages/elements/config/index.js';
import { Cell, Graph } from '@antv/x6';

export default {
  name: '',
  components: {
    ...components,
    ElementAutofillSetting: () => import('./element-autofill-config.vue'),
    ElementAlertBindSetting: () => import('./element-alertbind-config.vue'),
    TsFormTree: () => import('@/resources/plugins/TsForm/TsFormTree'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio'),
    CustomDataEdit: () => import('@/commercial-module/alert/pages/alerttopo/elements/config/customdata-config.vue')
  },
  props: {
    mode: { type: String, default: 'widget' }, //graph|widget|template三种模式
    id: { type: String },
    element: { type: Object },
    cell: { type: Cell },
    ciId: { type: Number },
    graph: { type: Graph },
    isShowInteractTabPane: { type: Boolean, default: false }
  },
  data() {
    return {
      currentWidgetId: null,
      isShowWidgetEdit: false,
      data: {},
      setting: this.$utils.deepClone(this.element.setting) || {},
      elementConfig: components,
      isLoading: false,
      settingForm: [
        {
          name: 'selectable',
          label: this.$t('term.diagram.allowselect'),
          type: 'switch',
          isHidden: !this.element.setting.hasOwnProperty('selectable'),
          trueValue: true,
          falseValue: false
        },
        {
          name: 'linkout',
          label: this.$t('term.diagram.allowlinkout'),
          type: 'switch',
          isHidden: !this.element.setting.hasOwnProperty('linkout'),
          trueValue: true,
          falseValue: false
        },
        {
          name: 'linkin',
          label: this.$t('term.diagram.allowlinkin'),
          type: 'switch',
          isHidden: !this.element.setting.hasOwnProperty('linkin'),
          trueValue: true,
          falseValue: false
        },
        {
          name: 'resizable',
          label: this.$t('term.diagram.allowresize'),
          type: 'switch',
          isHidden: !this.element.setting.hasOwnProperty('resizable'),
          trueValue: true,
          falseValue: false,
          onChange: (resizable) => {
            // 当允许改变大小时，视图将更新，无需手动点击节点触发刷新。
            if (this.isShowInteractTabPane) {
              if (!resizable) {
                this.graph.clearTransformWidgets();
              } else {
                const node = this.graph.getCellById(this.id);
                if (node) {
                  const setting = node.getProp('setting') || {};
                  node.setProp('setting', {
                    ...setting,
                    resizable: true
                  });
                  this.graph.createTransformWidget(node);
                }
              }
            }
          }
        },
        {
          name: 'deleteable',
          label: this.$t('term.diagram.allowdelete'),
          type: 'switch',
          isHidden: !this.element.setting.hasOwnProperty('deleteable'),
          trueValue: true,
          falseValue: false
        },
        {
          name: 'draggable',
          label: this.$t('term.diagram.allowmove'),
          type: 'switch',
          isHidden: !this.element.setting.hasOwnProperty('draggable'),
          trueValue: true,
          falseValue: false
        }
      ]
    };
  },
  beforeCreate() {},
  created() {
    this.data = this.$utils.deepClone(this.element.data) || {};
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
    editWidget(widgetId) {
      this.isShowWidgetEdit = true;
      this.currentWidgetId = widgetId;
    },
    //删除不存在的自定义数据
    removeNotExistsCustomData() {
      if (this.element.data.customData && this.element.data.customData.length > 0) {
        this.updateCustomData(this.element.data.customData.filter(d => this.element.config.customDataSetting && this.element.config.customDataSetting.find(s => s.name === d.name)));
      }
    },
    //更新customData
    updateCustomData(val) {
      //customdata位于节点数据的customData数组下，只需要更新这里的数据
      const data = this.cell.getData();
      data.customData = val;
      this.updateData(data);
    },
    //清空自定义数据
    clearCustomData() {
      const data = this.cell.getData();
      this.$delete(data, 'customData');
      this.updateData(data);
    },
    //更新节点data
    updateData(val) {
      if (this.id) {
        //必须重新复制数据，否则不能触发x6的change:data事件
        const data = val ? this.$utils.deepClone(val) : {};
        if (this.element && this.cell) {
          if (this.element.rendered && typeof this.element.rendered === 'function') {
            this.element.rendered(this.cell, data);
          }
        }
        this.$emit('data:update', this.id, data);
      }
    },
    updateSetting(val) {
      if (this.id) {
        const setting = val ? this.$utils.deepClone(val) : {};
        this.$emit('setting:update', this.id, setting);
      }
    }
  },
  filter: {},
  computed: {},
  watch: {
    data: {
      handler(val) {
        this.updateData(val);
      },
      deep: true
    },
    setting: {
      handler(val) {
        this.updateSetting(val);
      },
      deep: true
    }
  }
};
</script>
<style lang="less"></style>
