<template>
  <div classs="bg-op">
    <Loading v-if="loading" :loadingShow="loading" type="fix"></Loading>
    <div style="height: 34px">
      <TopoToolbar
        :readonly="true"
        :graph="graph"
        :config="config"
        :needMinimap="true"
        mode="graph"
        @fullscreen="fullscreen()"
      ></TopoToolbar>
    </div>
    <div ref="graph" style="height: calc(100vh - 150px); width: 100%">
      <TopoEditor
        v-if="!loading"
        :config="graphConfig"
        mode="graph"
        :grid="false"
        :transition="true"
        :readonly="true"
        @ready="ready"
        @render:done="renderDone"
      ></TopoEditor>
    </div>
    <AlertView
      v-if="isShowAlert"
      :id="currentAlertId"
      @close="
        isShowAlert = false;
        currentAlertId = null;
      "
    ></AlertView>
  </div>
</template>
<script>
import screenfull from '@/resources/assets/js/screenfull.js';

export default {
  name: '',
  components: {
    TopoToolbar: () => import('@/community-module/alert/pages/alerttopo/alerttopo-toolbar.vue'),
    TopoEditor: () => import('@/community-module/alert/pages/alerttopo/alerttopo-editor.vue'),
    AlertView: () => import('@/community-module/alert/pages/alert/alert-attr/components/alert-view-dialog.vue')
  },
  props: {
    alertList: { type: Array },
    id: { type: Number }
  },
  data() {
    return {
      isShowAlert: false,
      currentAlertId: null,
      isShowInteractTabPane: true,
      loading: true,
      graph: null,
      dnd: null,
      topoData: { isActive: 1 },
      graphConfig: {},
      config: {
        isSiderHide: false,
        isRightSiderHide: true,
        edgeMode: false,
        strictMode: false
      },
      alertAttrList: [],
      searchVal: {},
      searchParam: { mode: 'simple', pageSize: 500 }
    };
  },
  beforeCreate() {},
  created() {
    //this.getTopoById();
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
    addAlertDataToGraph() {
      const nodes = this.graph.getNodes();
      nodes.forEach(node => {
        //清除之前的alertdata工具
        node.removeTool('marquee');
        node.setAttrByPath('body/filter', null);
        //根据alertbind注入data数据，后续根据data数据产生tools
        const setting = node.getProp('setting');
        const alertbind = setting && setting.alertbind;
        if (alertbind) {
          //const displayAttr = alertbind.displayAttr;
          const filterList = alertbind.filterList;
          const bindAlertList = [];
          if (/*displayAttr && */ filterList && filterList.length > 0) {
            this.alertList.forEach(alert => {
              let isHit = false;
              //let alertName;
              if (alert.attrObj) {
                //alertName = alert.attrObj[displayAttr.substr(5)]; //去掉前缀attr_
                //if (alertName != undefined && alertName != null && alertName !== '') {
                //找到显示属性才继续，不然没意义，无法显示
                //console.log('name', displayAttr.substr(5), alertName);
                isHit = true;
                for (let i = 0; i < filterList.length; i++) {
                  const filter = filterList[i];
                  const attrName = filter.attr.substr(5); //去掉前缀attr_
                  //console.log('attrname', attrName, alert.attrObj[attrName], filter.value);
                  if (alert.attrObj[attrName] && filter.value && filter.value.length > 0) {
                    //console.log('filter compare', filter.value, filter, alert.attrObj[attrName]);
                    if (!filter.value.some(val => val.toLowerCase() === String(alert.attrObj[attrName]).toLowerCase())) {
                      isHit = false;
                      break;
                    }
                  } else {
                    isHit = false;
                  }
                }
                //}
              }
              if (isHit /*&& alertName*/) {
                bindAlertList.push({ id: alert.id, title: alert.title, /*name: alertName,*/ level: alert.alertLevel });
              }
            });
          }
          if (bindAlertList.length > 0) {
            node.setData({ alertList: bindAlertList });
            this.addAlertDataToNode(node);
          }
        }
      });
    },
    addAlertDataToNode(node) {
      //console.log('data', node.getData());
      const data = node.getData();
      const setting = node.getProp('setting');
      if (data.alertList && data.alertList.length > 0) {
        let maxLevel = 0;
        const alertSummaryList = [];
        for (let i = 0; i < data.alertList.length; i++) {
          const alert = data.alertList[i];
          if (alert.level) {
            let alertSummary = alertSummaryList.find(d => d.level === alert.level.level);
            if (!alertSummary) {
              alertSummary = {
                level: alert.level.level,
                label: alert.level.label,
                color: alert.level.color,
                count: 0
              };
              alertSummaryList.push(alertSummary);
            }
            alertSummary.count = alertSummary.count + 1;
          }
        }

        if (setting.alertbind.displayType === 'detail') {
          const divList = [];
          for (let i = 0; i < data.alertList.length; i++) {
            const alert = data.alertList[i];
            divList.push(`<div class="marquee-item cursor" alertId="${alert.id}"><span class="mr-xs" style="color:${alert.level.color}">${alert.level.label}</span><span>${alert.title}</span></div>`);
          }
          if (divList.length > 0) {
            node.addTools([
              {
                name: 'marquee',
                args: {
                  text: divList.join(''),
                  height: Math.min(divList.length, 5) * 20,
                  scrollamount: 3,
                  direction: 'up',
                  offset: { x: 0, y: -Math.min(divList.length, 5) * 20 },
                  onClick: item => {
                    if (item.getAttribute('alertId')) {
                      this.isShowAlert = true;
                      this.currentAlertId = parseInt(item.getAttribute('alertId'));
                    }
                  }
                }
              }
            ]);
          }
        } else if (setting.alertbind.displayType === 'summary') {
          if (alertSummaryList.length > 0) {
            const spanList = [];
            alertSummaryList.forEach(d => {
              spanList.push(`<span class="mr-sm"><span class="tsfont-warning-s" style="color:${d.color}">${d.label}</span><span class="text-grey">x</span><span><b class="text-grey">${d.count}</b></span></span>`);
            });
            node.addTools([
              {
                name: 'marquee',
                args: {
                  text: spanList.join(''),
                  height: 20,
                  scrollamount: 3,
                  direction: 'left',
                  offset: { x: 0, y: -20 }
                }
              }
            ]);
          }
        }
      }
    },
    fullscreen() {
      let fullDiv = this.$refs['graph'];
      if (screenfull.isEnabled) {
        screenfull.request(fullDiv);
      }
    },
    getTopoById() {
      if (this.id) {
        this.loading = true;
        this.$api.alert.topo
          .getTopoById(this.id)
          .then(res => {
            this.topoData = res.Return;
            if (this.topoData) {
              this.graphConfig = this.topoData?.config?.config || {};
            }
            if (this.graph) {
              this.graph.fromJSON(this.topoData?.config?.graph || {});
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
    ready(graph, dnd) {
      this.graph = graph;
      this.dnd = dnd;
      if (this.topoData) {
        this.graph.fromJSON(this.topoData?.config?.graph || {});
      }
    },
    renderDone({ graph }) {
      setTimeout(() => {
        if (this.alertList && this.alertList.length > 0) {
          this.addAlertDataToGraph();
        }
        graph.zoomToFit({ maxScale: 1, padding: 10 });
      }, 500);
    }
  },
  filter: {},
  computed: {},
  watch: {
    alertList: {
      handler(val) {
        if (val && this.graph) {
          this.addAlertDataToGraph();
        }
      }
    },
    id: {
      handler(val) {
        if (val) {
          this.getTopoById();
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="less">
.marquee-item:hover {
  text-decoration: underline;
}
</style>
