<template>
  <div
    class="radius-md padding-md"
    :class="{
      'bg-grey': level % 2 !== 0,
      'bg-op': level % 2 === 0
    }"
  >
    <TsFormItem label="脚本" labelPosition="left">
      <TsCodemirror :value="configLocal.script" :isReadOnly="true" codeMode="javascript"></TsCodemirror>
    </TsFormItem>
    <TsFormItem v-if="handler.result" label="前后对比" labelPosition="left">
      <div class="grid">
        <div
          class="padding-md radius-md"
          :class="{
            'bg-op': level % 2 !== 0,
            'bg-grey': level % 2 === 0
          }"
        >
          <div>转换前</div>
          <Collapse>
            <Panel name="1">
              告警信息
              <div slot="content">
                <div class="attr-main">
                  <div
                    v-for="(attr, index) in finalAttrList(handler.result.oldAlert)"
                    :key="index"
                    class="attr-item"
                    :class="{ 'attr-item-row': attr.wholeRow }"
                  >
                    <div class="attr-title text-grey">{{ attr.label }}</div>
                    <div class="attr-content">
                      <span v-if="attr.kind === 'const'">
                        <AlertAttrViewer
                          type="const"
                          :attr="attr"
                          :row="handler.result.oldAlert"
                          mode="detail"
                          :value="handler.result.oldAlert[attr.name.replace('const_', '')]"
                        ></AlertAttrViewer>
                      </span>
                      <span v-else-if="attr.kind === 'attr' && handler.result.oldAlert.attrObj">
                        <AlertAttrViewer
                          v-if="handler.result.oldAlert.attrObj.hasOwnProperty(attr.name.replace('attr_', ''))"
                          type="attr"
                          mode="detail"
                          :row="handler.result.oldAlert"
                          :attr="attr"
                          :value="handler.result.oldAlert.attrObj[attr.name.replace('attr_', '')]"
                        ></AlertAttrViewer>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel name="2">
              原始数据
              <div slot="content">
                <JsonViewer copyable :value="handler.result.oldAlertObj"></JsonViewer>
              </div>
            </Panel>
          </Collapse>
        </div>
        <div
          class="padding-md radius-md"
          :class="{
            'bg-op': level % 2 !== 0,
            'bg-grey': level % 2 === 0
          }"
        >
          <div>转换后</div>
          <Collapse v-if="handler.result.newAlert || handler.result.newAlertObj">
            <Panel v-if="handler.result.newAlert" name="1">
              告警信息
              <div slot="content">
                <div class="attr-main">
                  <div
                    v-for="(attr, index) in finalAttrList(handler.result.newAlert)"
                    :key="index"
                    class="attr-item"
                    :class="{ 'attr-item-row': attr.wholeRow }"
                  >
                    <div class="attr-title text-grey">{{ attr.label }}</div>
                    <div class="attr-content">
                      <span v-if="attr.kind === 'const'">
                        <AlertAttrViewer
                          type="const"
                          :attr="attr"
                          :row="handler.result.newAlert"
                          mode="detail"
                          :value="alertData[attr.name.replace('const_', '')]"
                        ></AlertAttrViewer>
                      </span>
                      <span v-else-if="attr.kind === 'attr' && handler.result.newAlert.attrObj">
                        <AlertAttrViewer
                          v-if="handler.result.newAlert.attrObj.hasOwnProperty(attr.name.replace('attr_', ''))"
                          type="attr"
                          mode="detail"
                          :row="handler.result.newAlert"
                          :attr="attr"
                          :value="handler.result.newAlert.attrObj[attr.name.replace('attr_', '')]"
                        ></AlertAttrViewer>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel v-if="handler.result.newAlertObj" name="2">
              原始数据
              <div slot="content">
                <JsonViewer v-if="handler.result.newAlertObj" copyable :value="handler.result.newAlertObj"></JsonViewer>
                <TsCodemirror
                  v-else-if="handler.result.newAlertStr"
                  :value="handler.result.newAlertStr"
                  :readonly="true"
                  codeMode="json"
                ></TsCodemirror>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </TsFormItem>
    <TsFormItem v-if="handler.error" label="异常" labelPosition="left">
      <Alert type="error">{{ handler.error }}</Alert>
    </TsFormItem>
  </div>
</template>
<script>
import { AlertEventBase } from '@/community-module/alert/pages/alertevent/components/view/alertevent-view-base.js';

export default {
  name: '',
  components: {
    JsonViewer: () => import('vue-json-viewer'),
    TsCodemirror: () => import('@/resources/plugins/TsCodemirror/TsCodemirror'),
    TsFormItem: () => import('@/resources/plugins/TsForm/TsFormItem'),
    AlertAttrViewer: () => import('@/community-module/alert/pages/alert/alert-attr-viewer.vue')
  },
  extends: AlertEventBase,
  props: {},
  data() {
    return {
      split: 0.5,
      attrList: []
    };
  },
  beforeCreate() {},
  created() {
    this.listAlertAttrList();
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
    listAlertAttrList() {
      const param = {};
      this.$api.alert.alert.listAlertAttrList(param).then(res => {
        this.attrList = res.Return;
      });
    },
    finalAttrList(alertData) {
      const attrList = [];
      if (this.attrList && this.attrList.length > 0) {
        this.attrList.forEach(d => {
          if (d.kind === 'const') {
            attrList.push(d);
          } else if (alertData && alertData.attrObj && alertData.attrObj.hasOwnProperty(d.name.replace('attr_', ''))) {
            //没有值的扩展属性不显示
            attrList.push(d);
          }
        });
      }
      return attrList;
    }
  },
  filter: {},
  computed: {},
  watch: {}
};
</script>
<style lang="less" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.attr-main {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 10px;
  .attr-item-row {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  .attr-item {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 120px auto;
    .attr-title {
      text-align: left;
      padding: 3px;
    }
    .attr-content {
      padding: 3px;
      word-break: break-all;
    }
    .attr-content .content {
      word-break: break-all;
    }
  }
}
</style>
