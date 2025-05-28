<template>
  <div>
    <TsDialog v-bind="dialogConfig" @on-close="close" @on-ok="save">
      <template v-slot>
        <div>
          <TsForm ref="form" :item-list="formConfig" :labelWidth="100">
            <template v-slot:config>
              <div v-if="currentElement">
                <ElementConfig
                  :id="currentElement.id"
                  mode="widget"
                  :element="currentElement"
                  :cell="currentCell"
                  @data:update="updateWidgetData"
                  @attr:update="updateWidgetAttr"
                ></ElementConfig>
              </div>
            </template>
            <template v-slot:icon>
              <div class="logo bg-block border-color text-primary radius-sm" @click="isIconDialogShow = true">
                <i class="logo-icon" :class="widgetData.icon"></i>
              </div>
            </template>
          </TsForm>
          <div class="mt-md">
            <TsFormItem label="预览" :labelWidth="100">
              <TopoEditor
                ref="graphEditor"
                :readonly="true"
                :resizable="true"
                height="200px"
                width="830px"
                @ready="ready"
              ></TopoEditor>
            </TsFormItem>
          </div>
        </div>
      </template>
    </TsDialog>
    <IconDialog
      v-if="isIconDialogShow"
      :typeList="['nocmdb']"
      :currentIcon="widgetData.icon"
      @cancel="isIconDialogShow = false"
      @confirm="selectIcon"
    ></IconDialog>
  </div>
</template>
<script>
import { ElementFactory } from '@/community-module/alert/pages/alerttopo/elements/core/ElementFactory.js';
import { NodeFactory } from '@/community-module/alert/pages/alerttopo/elements/core/NodeFactory.js';
import elements from '@/community-module/alert/pages/alerttopo/elements/view/shape/index.js';
import elementtypes from '@/community-module/alert/pages/alerttopo/elements/view/shape_type/index.js';
export default {
  name: 'WidgetEdit',
  components: {
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TopoEditor: () => import('@/community-module/alert/pages/alerttopo/alerttopo-editor.vue'),
    ElementConfig: () => import('@/community-module/alert/pages/alerttopo/elements/config/element-config.vue'),
    TsForm: () => import('@/resources/plugins/TsForm/TsForm'),
    IconDialog: () => import('@/views/pages/common/icon-dialog.vue')
  },
  props: {
    id: { type: Number }
  },
  data() {
    return {
      graph: null,
      dnd: null,
      isIconDialogShow: false,
      widgetData: { config: {}, isActive: 1 },
      currentElement: null,
      currentCell: null,
      attrList: [],
      editableAttrList: [],
      handerList: [
        { value: 'text', text: this.$t('page.text') },
        { value: 'number', text: this.$t('page.number') },
        { value: 'radio', text: this.$t('page.singleoption') },
        { value: 'checkbox', text: this.$t('page.multipleselection') },
        { value: 'matrix', text: this.$t('page.matrix') }
      ],
      customDataHeaderList: [
        {
          key: 'name',
          title: this.$t('page.uniquekey'),
          width: 150
        },
        { key: 'label', title: this.$t('term.autoexec.displayname'), width: 150 },
        { key: 'handler', title: this.$t('term.report.control'), width: 150 },
        { key: 'config', title: this.$t('page.config') },
        { key: '_action' }
      ],
      constAttrList: [
        { id: '_ciId', label: this.$t('term.cmdb.ciid'), type: '_ciid' },
        { id: '_id', label: this.$t('term.cmdb.cientityid'), type: '_id' },
        { id: '_name', label: this.$t('term.cmdb.cientityname'), type: '_name' },
        { id: '_ciIcon', label: this.$t('term.cmdb.cientityicon'), type: '_icon' }
      ],
      dialogConfig: {
        title: this.id ? this.$t('dialog.title.edittarget', { target: this.$t('term.diagram.widget') }) : this.$t('dialog.title.addtarget', { target: this.$t('term.diagram.widget') }),
        type: 'modal',
        maskClose: false,
        isShow: true,
        width: 'large'
      },
      formConfig: {
        shape: {
          type: 'select',
          mode: 'group',
          transfer: true,
          label: this.$t('term.report.shape'),
          desc: this.$t('message.cmdb.noedit'),
          validateList: ['required'],
          onChange: val => {
            this.changeShape(val);
          }
        },
        name: {
          type: 'text',
          label: this.$t('page.uniquekey'),
          desc: this.$t('message.cmdb.noedit'),
          validateList: ['required', 'parameter'],
          onChange: val => {
            this.widgetData.name = val;
          }
        },
        label: {
          type: 'text',
          label: this.$t('page.name'),
          validateList: ['required'],
          onChange: val => {
            this.widgetData.label = val;
          }
        },
        isActive: {
          type: 'switch',
          label: this.$t('page.enable'),
          trueValue: 1,
          falseValue: 0,
          onChange: val => {
            this.widgetData.isActive = val;
          }
        },
        config: {
          type: 'slot',
          label: this.$t('page.config'),
          isHidden: true
        }
      },
      mappingDataList: {} //矩阵字段列表
    };
  },
  beforeCreate() {},
  created() {
    this.init();
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
    confirm(p) {
      this.$delete(p, '_isShow');
      this.$delete(p, '_attrList');
      this.$delete(p, '_targetIsShow');
      this.$delete(p, '_targetAttrList');
    },
    getAttrList(p, ciId, propName) {
      this.$api.cmdb.ci.getAttrByCiId(ciId, { isSimple: true, isNeedTargetCi: false }).then(res => {
        this.$set(p, propName, res.Return);
      });
    },
    selectNode(nodes) {
      if (nodes.length > 0) {
        if (!this.widgetData.config) {
          this.$set(this.widgetData, 'config', {});
        }
        this.$set(this.widgetData.config, 'startCiPath', this.$utils.deepClone(nodes[0].path));
      } else {
        this.$delete(this.widgetData.config, 'startCiPath');
      }
    },
    getMatrixDataList(matrixUuid) {
      if (matrixUuid && !this.mappingDataList[matrixUuid]) {
        this.$api.framework.matrix.getMatrixAttributeByUuid({ matrixUuid: matrixUuid }).then(res => {
          if (res.Status === 'OK') {
            this.$set(this.mappingDataList, matrixUuid, res.Return.tbodyList);
          }
        });
      } else if (!matrixUuid) {
        this.$delete(this.mappingDataList, matrixUuid);
      }
    },
    addData(customDataItem, index) {
      if (!customDataItem.dataList) {
        this.$set(customDataItem, 'dataList', []);
      }
      if (index >= 0) {
        customDataItem.dataList.splice(index + 1, 0, '');
      } else {
        customDataItem.dataList.push('');
      }
    },
    removeData(customDataItem, index) {
      if (index >= 0) {
        customDataItem.dataList.splice(index, 1);
      }
    },
    removeCustomData(index) {
      if (index >= 0) {
        this.widgetData.config.customDataSetting.splice(index, 1);
      }
    },
    addCustomData(index) {
      if (!this.widgetData.config.customDataSetting) {
        this.$set(this.widgetData.config, 'customDataSetting', []);
      }
      const d = {
        name: '',
        label: '',
        handler: '',
        config: {}
      };
      if (index >= 0) {
        this.widgetData.config.customDataSetting.splice(index + 1, 0, d);
      } else {
        this.widgetData.config.customDataSetting.push(d);
      }
    },
    selectIcon(icon) {
      this.isIconDialogShow = false;
      this.$set(this.widgetData, 'icon', icon);
    },
    getAttrByTypeList(type) {
      if (type && type.length) {
        return this.attrList.filter(d => type.includes(d.type));
      }
      return this.attrList;
    },
    changeMapping(mapping, attrId) {
      if (!this.widgetData.config.mapping) {
        this.widgetData.config.mapping = {};
      }
      this.widgetData.config.mapping[mapping.name] = attrId;
    },
    async getWidgetById() {
      if (this.id) {
        await this.$api.alert.topo.getWidgetById(this.id).then(res => {
          this.widgetData = res.Return;
          for (let key in this.formConfig) {
            if (this.widgetData[key] && this.formConfig[key]) {
              this.formConfig[key].value = this.widgetData[key];
            }
          }
          if (this.widgetData.ciId) {
            this.changeCi(this.widgetData.ciId);
          }
          this.formConfig.config.isHidden = false;
          this.formConfig.name.readonly = true;
          this.formConfig.shape.readonly = true;
          const element = this.getElement(this.widgetData.shape);
          if (element) {
            element.data = this.widgetData.config.data;
            const node = NodeFactory.createNode(this.graph, this.widgetData.shape, this.widgetData.config);
            this.graph.addNode(node);
            element.id = node.id;
            this.currentElement = element;
            this.currentCell = node;
            setTimeout(() => {
              this.graph.zoomToFit({ maxScale: 1, padding: 10 });
              this.graph.centerContent();
            }, 100);
          }
          if (this.widgetData?.config?.customDataSetting && this.widgetData.config.customDataSetting.length > 0) {
            this.widgetData.config.customDataSetting.forEach(element => {
              if (element?.config?.matrixUuid) {
                this.getMatrixDataList(element.config.matrixUuid);
              }
            });
          }
        });
      } else {
        for (let key in this.formConfig) {
          if (this.widgetData[key] && this.formConfig[key]) {
            this.formConfig[key].value = this.widgetData[key];
          }
        }
      }
    },
    async ready(graph, dnd) {
      this.graph = graph;
      this.dnd = dnd;
      //由于回显需要依赖graph初始化完毕，所以获取回显数据要放这里。
      await this.getWidgetById();
      this.graph.on('node:resized', ({ node }) => {
        this.widgetData.config.prop = {
          width: node.size().width,
          height: node.size().height
        };
      });
    },
    init() {
      this.formConfig.shape.dataList = this.shapeList;
    },
    updateWidgetData(widgetId, data) {
      const node = this.graph.getCellById(widgetId);
      if (node) {
        node.replaceData(data);
      }
    },
    updateWidgetConfig(widgetId, data) {
      Object.assign(this.widgetData.config, data);
      //console.log(JSON.stringify(this.widgetData, null, 2));
    },
    updateWidgetAttr(widgetId, data) {},
    changeCi(ciId) {
      this.attrList = [];
      this.editableAttrList = [];
      if (ciId) {
        this.$api.cmdb.ci.getAttrByCiId(ciId).then(res => {
          this.attrList = [...this.constAttrList, ...res.Return];
          this.editableAttrList = res.Return;
        });
      } else {
        this.attrList = [...this.constAttrList];
      }
    },
    getElement(shape) {
      const element = ElementFactory.getElement(shape);
      if (element) {
        //CMDB图元的专用属性
        //if (element.type === 'cmdb') {
        for (let key in this.formConfig) {
          if (this.formConfig[key]['_belong'] && this.formConfig[key]['_belong'] === element.type) {
            this.formConfig[key].isHidden = false;
          } else if (this.formConfig[key]['_belong'] && this.formConfig[key]['_belong'] !== element.type) {
            this.formConfig[key].isHidden = true;
          }
        }
      }
      return element;
    },
    changeShape(shape) {
      if (shape && shape !== this.widgetData.shape) {
        this.graph.clearCells();
        const element = this.getElement(shape);
        this.formConfig.config.isHidden = false;
        if (element) {
          const node = NodeFactory.createNode(this.graph, shape);
          this.graph.addNode(node);
          element.id = node.id;
          this.currentElement = null;
          this.graph.centerContent();
          this.widgetData.shape = shape;
          this.widgetData.type = element.type;
          this.$nextTick(() => {
            this.currentElement = element;
            this.currentCell = node;
          });
        }
      } else if (!shape) {
        this.formConfig.config.isHidden = true;
        this.widgetData.shape = null;
      }
    },
    save() {
      const graphData = this.graph.toJSON();
      const form = this.$refs['form'];
      const v1 = form.valid();
      if (v1 && graphData.cells && graphData.cells.length > 0) {
        this.widgetData.config.data = graphData.cells[0].data;
        this.$api.alert.topo.saveWidget(this.widgetData).then(res => {
          this.$Message.success(this.$t('message.savesuccess'));
          this.close(true);
        });
      }
    },
    close(needRefresh) {
      this.$emit('close', needRefresh);
    }
  },
  filter: {},
  computed: {
    shapeList() {
      const shapeList = [];
      elementtypes.forEach(type => {
        const shapeType = { value: type.name, text: type.label, children: [] };
        elements
          .filter(d => d.type === type.name)
          .forEach(element => {
            shapeType['children'].push({ value: element.name, text: element.label });
          });
        shapeList.push(shapeType);
      });
      return shapeList;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.grid {
  width: 100%;
  display: grid;
  grid-template-columns: 120px auto;
}
.grid-mapping {
  width: 100%;
  display: grid;
  row-gap: 10px;
  grid-template-columns: auto 50px 300px;
}
.data-grid {
  width: 100%;
  display: grid;
  column-gap: 10px;
  grid-template-columns: auto 50px;
}
.logo {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: inline-block;
  position: relative;
  border: 1px solid;
  top: -5px;
  text-align: center;
  line-height: 40px;
  .logo-icon {
    font-size: 20px;
  }
  &::after {
    left: 44px;
    width: 40px;
    position: absolute;
    top: 2px;
  }
}
</style>
