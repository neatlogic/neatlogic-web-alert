<template>
  <div>
    <TsFormItem :label="$t('page.copywriting')" labelPosition="top">
      <TsFormInput
        v-model="text"
        border="border"
        @on-change="
          val => {
            if(edge.getAttrByPath('label/text')) {
              edge.setAttrByPath('label/text', val);
            } else {
              handleEdgeLabel(val, color);
            }
          }
        "
      ></TsFormInput>
    </TsFormItem>
    <TsFormItem :label="$t('term.diagram.edgetype')" labelPosition="top">
      <TsFormRadio
        v-model="edgeType"
        :dataList="edgeTypeList"
        @on-change="val=>{
          if(val==='dash'){
            edge.setAttrByPath('line/strokeDasharray', '10,6');
          }else{
            edge.setAttrByPath('line/strokeDasharray', null);
          }
        }"
      ></TsFormRadio>
    </TsFormItem>
    <TsFormItem :label="$t('page.color')" labelPosition="top">
      <ColorPicker
        v-model="color"
        :transfer="true"
        recommend
        alpha
        class="colorPicker"
        transfer-class-name="color-picker-transfer-class"
        @on-change="
          val => {
            if (val) {
              edge.setAttrByPath('line/class', null);
              edge.setAttrByPath('line/targetMarker/class', null);
              edge.setAttrByPath('line/sourceMarker/class', null);
              edge.setAttrByPath('line/stroke', val);
              edge.setAttrByPath('line/targetMarker/fill', val);
              edge.setAttrByPath('line/sourceMarker/fill', val);
              edge.setAttrByPath('label/style', 'fill:' + val);
              edge.setAttrByPath('line/data-default-class', null); // 修改值时，移除默认样式
            } else {
              edge.setAttrByPath('line/class', 'line');
              edge.setAttrByPath('line/targetMarker/class', 'marker');
              edge.setAttrByPath('line/sourceMarker/class', 'marker');
              edge.setAttrByPath('line/stroke', null);
              edge.setAttrByPath('line/targetMarker/fill', null);
              edge.setAttrByPath('line/sourceMarker/fill', null);
              edge.setAttrByPath('label/style', null);
            }
            handleEdgeLabel(text, val);
          }
        "
      />
    </TsFormItem>
    <TsFormItem :label="$t('page.width')" labelPosition="top">
      <Slider
        :value="width"
        :min="1"
        :max="10"
        @on-change="
          val => {
            edge.setAttrByPath('line/strokeWidth', val);
            if (arrowWidthRate && arrowHeightRate) {
              edge.setAttrByPath('line/targetMarker/width', val / arrowWidthRate);
              edge.setAttrByPath('line/targetMarker/height', val / arrowHeightRate);
              edge.setAttrByPath('line/sourceMarker/width', val / arrowWidthRate);
              edge.setAttrByPath('line/sourceMarker/height', val / arrowHeightRate);
            }
          }
        "
      ></Slider>
    </TsFormItem>
    <TsFormItem :label="$t('term.diagram.sourcemarker')" labelPosition="top">
      <TsFormSelect
        v-model="sourceMarker"
        :dataList="markerList"
        transfer
        border="border"
        @on-change="
          val => {
            edge.setAttrByPath('line/sourceMarker/name', val);
          }
        "
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem :label="$t('term.diagram.targetmarker')" labelPosition="top">
      <TsFormSelect
        v-model="targetMarker"
        :dataList="markerList"
        transfer
        border="border"
        @on-change="
          val => {
            edge.setAttrByPath('line/targetMarker/name', val);
          }
        "
      ></TsFormSelect>
    </TsFormItem>
    <TsFormItem :label="$t('page.type')" labelPosition="top">
      <TsFormRadio
        v-model="router"
        :vertical="true"
        :dataList="routerTypeList"
        @on-change="
          val => {
            if (val) {
              edge.setRouter(val);
            } else {
              edge.removeRouter();
            }
            resetVertices();
          }
        "
      ></TsFormRadio>
    </TsFormItem>
  </div>
</template>
<script>
import { Graph, Edge } from '@antv/x6';
export default {
  name: '',
  components: {
    TsFormSelect: () => import('@/resources/plugins/TsForm/TsFormSelect'),
    TsFormInput: () => import('@/resources/plugins/TsForm/TsFormInput'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    TsFormRadio: () => import('@/resources/plugins/TsForm/TsFormRadio')
  },
  props: {
    edge: { type: Edge },
    graph: { type: Graph }
  },
  data() {
    return {
      edgeTypeList: [
        { value: 'solid', text: this.$t('page.solid') },
        { value: 'dash', text: this.$t('page.dashed') }
      ],
      routerTypeList: [
        { value: 'normal', text: this.$t('term.diagram.line') },
        { value: 'orth', text: this.$t('term.diagram.orth') },
        { value: 'er', text: this.$t('page.relation') },
        { value: 'metro', text: this.$t('term.diagram.metro') },
        { value: 'manhattan', text: this.$t('term.diagram.manhattan') },
        { value: '', text: this.$t('page.custom') }
      ],
      arrowWidthRate: 0,
      arrowHeightRate: 0,
      sourceMarker: null,
      targetMarker: null,
      color: null,
      edgeType: 'solid',
      router: null,
      text: null,
      markerList: [
        { value: null, text: this.$t('page.nothave') },
        { value: 'classic', text: this.$t('term.diagram.classic') },
        { value: 'block', text: this.$t('term.diagram.block') },
        { value: 'cross', text: this.$t('term.diagram.cross') },
        { value: 'circle', text: this.$t('term.report.dot') }
      ]
    };
  },
  beforeCreate() {},
  created() {
    if (this.edge) {
      if (this.arrowWidth) {
        this.arrowWidthRate = this.width / this.arrowWidth;
      }
      if (this.arrowHeight) {
        this.arrowHeightRate = this.width / this.arrowHeight;
      }
      this.sourceMarker = this.edge.getAttrByPath('line/sourceMarker/name');
      this.targetMarker = this.edge.getAttrByPath('line/targetMarker/name');
      this.color = this.edge.getAttrByPath('line/stroke');
      this.router = this.edge.getRouter() && this.edge.getRouter().name;
      this.text = this.edge.getAttrByPath('label/text');
      const labelList = this.edge.getLabels();
      if (labelList.length > 0) {
        let { attrs } = labelList[0] || {};
        let { label } = attrs || {};
        let { text } = label || {};
        if (text) {
          this.text = text;
        }
      }
      if (this.edge.getAttrByPath('line/strokeDasharray')) {
        this.edgeType = 'dash';
      } else {
        this.edgeType = 'solid';
      }
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
    resetVertices() {
      this.edge.setVertices([]);
      if (this.edge.hasTool('vertices')) {
        this.edge.removeTools('vertices');
      }
      if (this.edge.hasTool('button')) {
        this.edge.removeTools('button');
      }
      this.edge.addTools({
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              className: 'custom-edge-button',
              attrs: {
                r: 6,
                stroke: '#fe854f',
                strokeWidth: 2,
                fill: 'white',
                opacity: 0.4,
                cursor: 'crosshair',
                'pointer-events': 'auto'
              }
            }
          ],
          distance: 0.5,
          onClick({ e, cell }) {
            console.log('自定义边点击', e, cell);
            cell.addTools({
              name: 'vertices',
              args: {
                attrs: {
                  pointerEvents: 'auto', // 允许事件穿透到线
                  cursor: 'crosshair',
                  class: 'custom-vertices'
                },
                stopPropagation: false,
                addable: false
              }
            });
            const p = this.graph.clientToLocal({ x: e.clientX, y: e.clientY });
            cell.setVertices([
              {
                x: p.x,
                y: p.y
              }
            ]);
            cell.removeTools('button');
          }
        }
      });
    },
    handleEdgeLabel(text, color) {
      this.edge.setLabels([{
        attrs: {
          label: {
            text: text || '',
            style: {
              fill: color
            },
            fontSize: 12
          }
        },
        position: {
          distance: 0.5,
          offset: 10
        }
      }]); 
    }
  },
  filter: {},
  computed: {
    arrowWidth() {
      if (this.edge) {
        return this.edge.getAttrByPath('line/targetMarker/width');
      }
      return 0;
    },
    arrowHeight() {
      if (this.edge) {
        return this.edge.getAttrByPath('line/targetMarker/height');
      }
      return 0;
    },
    width() {
      if (this.edge) {
        return this.edge.getAttrByPath('line/strokeWidth');
      }
      return null;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped></style>
