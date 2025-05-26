<template>
  <div>
    <EdgeConfigCommon :edge="edge" :graph="graph"></EdgeConfigCommon>
    <div v-if="edge && edge.getData() && edge.getData()['type'] === 'ci'">
      <Divider orientation="left">{{ $t('term.diagram.cientityinfo') }}</Divider>
      <div class="mb-xs text-grey">帮助：当前连线需要创建配置项</div>
      <div v-if="ciEntityList.length > 0" class="mb-xs">
        <Tag
          v-for="(cientity, index) in ciEntityList"
          :key="index"
          type="border"
          color="success"
        >
          <span>{{ $t('term.cmdb.newcientity') }}</span>
          <span class="ml-xs text-grey">({{ cientity.ciLabel }})</span>
        </Tag>
      </div>
    </div>
    <div v-else-if="edge && edge.getData() && edge.getData()['type'] === 'rel'">
      <Divider orientation="left">{{ $t('term.diagram.cientityinfo') }}</Divider>
      <div class="text-grey">帮助：当前连线将自动创建关系</div>
    </div>
  </div>
</template>
<script>
import { Graph, Edge } from '@antv/x6';
export default {
  name: '',
  components: {
    EdgeConfigCommon: () => import('./edge-config-common.vue')
  },
  props: {
    edge: { type: Edge },
    graph: { type: Graph }
  },
  data() {
    return {
      ciEntityData: { relEntityData: {} }, //通过连线创建的关系数据，进入配置项编辑后不能修改这些关系
      isEditCiEntityShow: false,
      isReady: true //由于cientity计算变量有缓存，需要用一个变量去刷新数据
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
    /*关系数据范例
    {
      "relto_1039752174247936": {
      "valueList": [
          {
          "ciId": 1039664412631040,
          "ciEntityId": 1047805078544553,
          "ciEntityName": "NACE_新柜面"
          }
        ]
      },
      "relfrom_1044211239493632": {
      "valueList": [
          {
          "ciId": 1039664412631040,
          "ciEntityId": 1047805078544489,
          "ciEntityName": "NACE13_新柜面13版"
          }
        ]
    }
    */
    init() {
      if (this.edge) {
        const sourceNodeData = this.edge.getSourceNode() && this.edge.getSourceNode().getData();
        const targetNodeData = this.edge.getTargetNode() && this.edge.getTargetNode().getData();
        const edgeData = this.edge.getData();
        if (sourceNodeData && targetNodeData && edgeData) {
          if (edgeData['type'] === 'ci') {
            const fromRelId = edgeData['fromRelId'];
            const toRelId = edgeData['toRelId'];
            if (fromRelId && toRelId) {
              //禁用掉这两个属性的编辑入口
              this.ciEntityData.disableAttrRelIdList = ['relto_' + fromRelId, 'relfrom_' + toRelId];
              if (fromRelId && toRelId) {
                //设置上游关系数据
                this.ciEntityData.relEntityData['relto_' + fromRelId] = {
                  valueList: [
                    {
                      ciId: sourceNodeData.ciId,
                      ciEntityId: sourceNodeData.ciEntityId,
                      ciEntityName: sourceNodeData.ciEntityName
                    }
                  ]
                };
                //设置下游关系数据
                this.ciEntityData.relEntityData['relfrom_' + toRelId] = {
                  valueList: [
                    {
                      ciId: targetNodeData.ciId,
                      ciEntityId: targetNodeData.ciEntityId,
                      ciEntityName: targetNodeData.ciEntityName
                    }
                  ]
                };
              }
              //
            }
          } else {
            //
          }
        }
      }
    },
    closeEditCiEntity(ciEntityList) {
      this.isEditCiEntityShow = false;
      if (ciEntityList) {
        this.edge.setData(
          {
            saveData: {
              ciEntityList: ciEntityList
            }
          },
          {
            deep: false
          }
        );
        this.isReady = false;
        //console.log(JSON.stringify(this.edge.getData(), null, 2));
        this.$nextTick(() => {
          this.isReady = true;
        });
      }
    }
  },
  filter: {},
  computed: {
    ciEntityList() {
      let cientityList = [];
      if (this.isReady && this.edge.getData()['type'] === 'ci' && this.edge.getData()['saveData'] && this.edge.getData()['saveData']['ciEntityList']) {
        cientityList = this.edge.getData()['saveData']['ciEntityList'];
      }
      return cientityList;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped></style>
