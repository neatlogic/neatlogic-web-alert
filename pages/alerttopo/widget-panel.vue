<template>
  <div class="widgetitem-container">
    <div v-if="widgetData.tbodyList && widgetData.tbodyList.length > 0">
      <div
        v-for="(widget, windex) in widgetData.tbodyList"
        :key="windex"
        class="mt-sm"
        style="cursor: move"
        draggable="true"
        @dragstart="drag($event, widget)"
      >
        <div style="position: relative">
          <div class="mask"></div>
          <DiagramEditor
            :readonly="true"
            :grid="false"
            :panning="false"
            height="80px"
            width="100%"
            :muted="true"
            :resizable="false"
            :transition="true"
            @ready="
              (graph, dnd) => {
                ready(graph, dnd, widget);
              }
            "
          ></DiagramEditor>
          <div class="widget-text mt-xs text-grey">{{ widget.label || widget.name }}</div>
        </div>
      </div>
    </div>
    <div v-else class="text-grey">暂无数据</div>
  </div>
</template>
<script>
import { Graph } from '@antv/x6';
import { NodeFactory } from '@/commercial-module/alert/pages/alerttopo/elements/core/NodeFactory.js';
export default {
  name: '',
  components: {
    DiagramEditor: () => import('@/commercial-module/diagram/pages/editor/diagram-editor.vue')
  },
  props: {
    widgetList: { type: Array },
    graph: { type: Graph },
    dnd: { type: Object }
  },
  data() {
    return {
      widgetData: {},
      searchParam: { isActive: 1 }
    };
  },
  beforeCreate() {},
  created() {
    this.searchWidget();
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
    searchWidget() {
      this.$api.alert.topo.searchWidget(this.searchParam).then(res => {
        this.widgetData = res.Return;
      });
    },
    ready(graph, dnd, widgetData) {
      const node = NodeFactory.createNode(graph, widgetData.shape, widgetData.config);
      graph.addNode(node);
      setTimeout(() => {
        graph.zoomToFit({ maxScale: 1, padding: 10 });
        //graph.centerContent();
      }, 200);
    },
    drag(event, widget) {
      //不要修改原数据
      const config = this.$utils.deepClone(widget.config) || {};
      config.id = this.$utils.setUuid();
      config.widgetName = widget.name;
      const node = NodeFactory.createNode(this.graph, widget.shape, config);
      this.dnd.start(node, event);
      this.$emit('drag');
    }
  },
  filter: {},
  computed: {
    searchAttrList: function() {
      if (this.attrList && this.attrList.length > 0) {
        return this.attrList.filter(attr => {
          return attr.canSearch == 1;
        });
      } else {
        return null;
      }
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
@import '~@/resources/assets/css/variable.less';
.grid {
  display: grid;
  grid-template-columns: 30px auto;
}
.search-grid {
  display: grid;
  grid-template-columns: auto 25px;
}
.widget-text {
  text-align: center;
  font-size: 12px;
}
.mask {
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 20;
}
.theme(@background-color) {
  .widgetitem-container {
    ::v-deep .ivu-collapse-content {
      background-color: @background-color;
      > .ivu-collapse-content-box {
        padding-top: 0;
      }
    }
    ::v-deep .ivu-collapse {
      border: none;
    }
    ::v-deep .ivu-collapse-header {
      padding-left: 0px;
    }
    ::v-deep .ivu-icon-ios-arrow-forward {
      margin-right: 10px;
    }
  }
}
html {
  .theme(@default-background);

  &.theme-dark {
    .theme(@dark-background);
  }
}
</style>
