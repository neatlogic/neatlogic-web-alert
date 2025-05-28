<template>
  <div>
    <TsContain>
      <template v-slot:topLeft>
        <div class="action-group">
          <div class="action-item tsfont-plus" @click="editTopo()">拓扑图</div>
        </div>
      </template>
      <template v-slot:content>
        <TsCard
          v-if="!loading"
          :cardList="topoData.tbodyList"
          :sm="12"
          :lg="8"
          :xl="8"
          :xxl="6"
          :padding="false"
        >
          <template slot="header" slot-scope="{ row }">
            <div style="position: relative">
              <!--没有templateId代表自动架构图-->
              <h3 class="text-grey">{{ row.label }}·{{ row.name }}</h3>
            </div>
          </template>
          <div slot-scope="{ row }" class="bg-grey">
            <TopoEditor
              :readonly="true"
              :grid="false"
              :panning="false"
              :transition="true"
              height="180px"
              width="100%"
              @ready="
                (graph, dnd) => {
                  ready(graph, dnd, row);
                }
              "
              @render:done="renderDone"
            ></TopoEditor>
          </div>
          <template v-slot:control="{ row }">
            <!--<div class="action-item">
              <span class="tsfont-search" @click="viewDiagram(row)">{{ $t('page.detail') }}</span>
            </div>-->
            <div class="action-item">
              <span class="tsfont-edit" @click="editDiagram(row)">{{ $t('page.edit') }}</span>
            </div>
            <div class="action-item">
              <span class="tsfont-trash-o" @click="deleteDiagram(row)">{{ $t('page.delete') }}</span>
            </div>
          </template>
        </TsCard>
      </template>
    </TsContain>
  </div>
</template>
<script>
export default {
  name: '',
  components: {
    TsCard: () => import('@/resources/components/TsCard/TsCard.vue'),
    TopoEditor: () => import('@/community-module/alert/pages/alerttopo/alerttopo-editor.vue')
  },
  props: {},
  data() {
    return {
      loading: false,
      searchParam: {},
      topoData: {}
    };
  },
  beforeCreate() {},
  created() {
    this.searchTopo();
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
    editDiagram(topo) {
      this.$router.push({
        path: '/alerttopo-edit',
        query: {
          id: topo.id
        }
      });
    },
    searchTopo() {
      this.loading = true;
      this.$api.alert.topo
        .searchTopo(this.searchParam)
        .then(res => {
          this.topoData = res.Return;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    ready(graph, dnd, diagram) {
      let data = null;
      if (diagram.templateId && diagram.currentVersion) {
        data = diagram.currentVersion.config;
      } else {
        data = diagram.config;
      }
      if (data && data.graph) {
        graph.fromJSON(data.graph);
      }
    },
    renderDone({ graph }) {
      setTimeout(() => {
        graph.zoomToFit({ maxScale: 1, padding: 10 });
      }, 200);
    },
    viewDiagram(topo) {
      this.$router.push({
        path: '/alerttopo-detail',
        query: {
          id: topo.id
        }
      });
    },
    editTopo(topo) {
      const param = {};
      if (topo) {
        param.id = topo.id;
      }
      this.$router.push({
        path: '/alerttopo-edit',
        query: param
      });
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less"></style>
