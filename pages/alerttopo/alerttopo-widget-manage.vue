<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="addWidget()">{{ $t('term.diagram.widget') }}</div>
        </div>
      </template>
      <template v-slot:topCenter>
        <div><!--占位--></div>
      </template>
      <template v-slot:topRight>
        <CombineSearcher v-model="searchVal" v-bind="searchConfig" @change="updatePage(1)"></CombineSearcher>
      </template>
      <template v-slot:content>
        <Loading v-if="loading" :loadingShow="true" type="fix"></Loading>
        <TsCard
          v-else
          v-bind="widgetData"
          :sm="12"
          :lg="8"
          :xl="6"
          :xxl="6"
          :padding="false"
          @updatePage="updatePage"
        >
          <template slot="header" slot-scope="{ row }">
            <div style="position: relative">
              <div :class="row.icon">
                <span>{{ row.label }}</span>
                <span class="text-grey">（</span>
                <span class="text-grey">{{ getWidgetType(row.type) }}</span>
                <span v-if="row.ciName" class="text-grey">·{{ row.ciLabel }}</span>
                <span class="text-grey">）</span>
              </div>
              <div class="text-grey fz10">{{ row.name }}</div>
            </div>
          </template>
          <div slot-scope="{ row }" class="radius-md" style="position: relative">
            <div v-if="!row.isActive" class="bg-grey radius-md mask"></div>
            <div class="padding-sm">
              <TopoEditor
                :readonly="true"
                :grid="false"
                :panning="false"
                :transition="true"
                height="120px"
                width="100%"
                @ready="
                  (graph, dnd) => {
                    ready(graph, dnd, row);
                  }
                "
              ></TopoEditor>
            </div>
          </div>
          <template v-slot:control="{ row }">
            <div class="action-item">
              <TsFormSwitch
                :value="row.isActive"
                :trueValue="1"
                :falseValue="0"
                :showStatus="true"
                :trueText="$t('page.isactived')"
                :falseText="$t('page.ban')"
                @on-change="
                  val => {
                    toggleWidgetActive(val, row);
                  }
                "
              ></TsFormSwitch>
            </div>
            <div class="action-item">
              <div class="text-action tsfont-edit" @click="editWidget(row.id)">{{ $t('page.edit') }}</div>
            </div>
            <div v-if="!row.templateCount" class="action-item">
              <div class="text-action tsfont-trash-o" @click="deleteWidget(row.id)">{{ $t('page.delete') }}</div>
            </div>
          </template>
        </TsCard>
      </template>
    </TsContain>
    <WidgetEdit v-if="isShowWidgetEdit" :id="currentWidgetId" @close="closeWidgetEdit"></WidgetEdit>
  </div>
</template>
<script>
import { NodeFactory } from '@/commercial-module/alert/pages/alerttopo/elements/core/NodeFactory.js';
import elements from '@/commercial-module/alert/pages/alerttopo/elements/view/shape/index.js';
import elementTypes from '@/commercial-module/alert/pages/alerttopo/elements/view/shape_type/index.js';

export default {
  name: '',
  components: {
    CombineSearcher: () => import('@/resources/components/CombineSearcher/CombineSearcher.vue'),
    TsFormSwitch: () => import('@/resources/plugins/TsForm/TsFormSwitch'),
    TsCard: () => import('@/resources/components/TsCard/TsCard.vue'),
    WidgetEdit: () => import('@/commercial-module/alert/pages/alerttopo/alerttopo-widget-edit.vue'),
    TopoEditor: () => import('@/commercial-module/alert/pages/alerttopo/alerttopo-editor.vue')
  },
  props: {},
  data() {
    return {
      loading: true,
      searchParam: { needTemplate: 1 },
      widgetData: {},
      isShowWidgetEdit: false,
      searchVal: {},
      searchConfig: {
        searchMode: 'clickBtnSearch',
        search: true,
        placeholder: this.$t('form.placeholder.pleaseinput', { target: this.$t('page.keyword') }),
        searchList: [
          {
            type: 'radio',
            name: 'isActive',
            label: this.$t('term.report.isactive'),
            dataList: [
              { value: 1, text: this.$t('page.yes') },
              { value: 0, text: this.$t('page.no') }
            ]
          },
          {
            type: 'select',
            name: 'shape',
            mode: 'group',
            label: this.$t('term.report.shape'),
            multiple: false,
            transfer: true
          }
        ]
      }
    };
  },
  beforeCreate() {},
  created() {
    this.init();
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
    restoreHistory(historyData) {
      this.searchParam = historyData['searchParam'];
      this.searchVal = historyData['searchVal'];
    },
    init() {
      const shape = this.searchConfig.searchList.find(d => d.name === 'shape');
      if (shape) {
        shape.dataList = this.shapeList;
      }
    },
    getWidgetType(type) {
      const elementType = elementTypes.find(d => d.name === type);
      if (elementType) {
        return elementType.label;
      }
    },
    ready(graph, dnd, widgetData) {
      const node = NodeFactory.createNode(graph, widgetData.shape, widgetData.config);
      graph.addNode(node);
      setTimeout(() => {
        graph.zoomToFit({ maxScale: 1, padding: 10 });
        //graph.centerContent();
      }, 200);
    },
    getGraphData(config) {
      return { cells: [config] };
    },
    deleteWidget(widgetId) {
      this.$createDialog({
        title: this.$t('dialog.title.deleteconfirm'),
        content: this.$t('dialog.content.deleteconfirm', { target: this.$t('term.diagram.widget') }),
        btnType: 'error',
        'on-ok': vnode => {
          this.$api.alert.topo.deleteWidget(widgetId).then(res => {
            this.$Message.success(this.$t('message.deletesuccess'));
            vnode.isShow = false;
            this.searchWidget();
          });
        }
      });
    },
    searchWidget() {
      this.loading = true;
      this.$addHistoryData('searchParam', this.searchParam);
      this.$addHistoryData('searchVal', this.searchVal);
      this.$api.alert.topo
        .searchWidget({ ...this.searchParam, ...this.searchVal })
        .then(res => {
          this.widgetData = res.Return;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updatePage(currentPage) {
      this.searchParam.currentPage = currentPage;
      this.searchWidget();
    },
    toggleWidgetActive(isActive, widget) {
      widget.isActive = isActive;
      this.$api.alert.topo.toggleWidgetActive(widget).then(res => {
        this.$Message.success(this.$t('message.updatesuccess'));
      });
    },
    addWidget() {
      this.currentWidgetId = null;
      this.isShowWidgetEdit = true;
    },
    editWidget(widgetId) {
      this.isShowWidgetEdit = true;
      this.currentWidgetId = widgetId;
    },
    closeWidgetEdit(needRefresh) {
      this.isShowWidgetEdit = false;
      this.currentWidgetId = null;
      if (needRefresh) {
        this.searchWidget();
      }
    }
  },
  filter: {},
  computed: {
    shapeList() {
      const shapeList = [];
      elementTypes.forEach(type => {
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
.mask {
  z-index: 10;
  opacity: 0.5;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
